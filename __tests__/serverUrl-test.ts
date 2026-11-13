import {
  candidateApiUrls,
  fallbackApiUrl,
  parseServerInput,
  resolveApiUrl,
  validateServerUrl
} from '../src/utils/serverUrl';

type FakeAnswer =
  | { status: number; data?: any; responseURL?: string }
  | { transportError: true }
  | ((url: string) => Promise<any>);

// Builds a fake axios-style `get`: a 2xx answer resolves, other HTTP answers reject with `response`,
// transport errors reject without one
function fakeGet(answers: Record<string, FakeAnswer>) {
  return jest.fn((url: string, _config?: any) => {
    const answer = answers[url];
    if (typeof answer === 'function') {
      return answer(url);
    }
    if (!answer || 'transportError' in answer) {
      return Promise.reject(Object.assign(new Error('Network Error'), { request: {} }));
    }
    const response = {
      status: answer.status,
      data: answer.data,
      request: answer.responseURL !== undefined ? { responseURL: answer.responseURL } : {}
    };
    return answer.status >= 200 && answer.status < 300
      ? Promise.resolve(response)
      : Promise.reject(Object.assign(new Error('Request failed'), { response }));
  });
}

const OK = { status: 200, data: { status: 'OK', database: { status: true } } };

describe('validateServerUrl', () => {
  it.each([
    'vvg-stage.openboxes.cloud',
    'https://vvg-stage.openboxes.cloud',
    'HTTPS://Example.COM',
    'http://localhost:8080/openboxes',
    'https://example.org/api/',
    'https://example.org/ob/openboxes/api',
    '10.0.2.2:8080',
    'https://192.168.1.20',
    'https://[::1]:8443',
    'https://[2001:db8::1]/openboxes',
    'https://[2001:db8:0:0:0:0:0:1]',
    'https://[::ffff:192.0.2.1]',
    '  https://example.org  '
  ])('accepts %s', (input) => {
    expect(validateServerUrl(input)).toBeNull();
  });

  it.each([
    ['', 'URL is required'],
    ['   ', 'URL is required'],
    ['ftp://example.org', 'URL must start with http:// or https://'],
    ['https://exa mple.org', 'Enter a valid server address'],
    ['https://user@example.org', 'Enter a valid server address'],
    ['https://example.org/api?x=1', 'Enter a valid server address'],
    ['https://example.org/#top', 'Enter a valid server address'],
    ['https://-', 'Enter a valid server address'],
    ['https://-example.org', 'Enter a valid server address'],
    ['https://example-.org', 'Enter a valid server address'],
    ['https://', 'Enter a valid server address'],
    ['1.2.3.999', 'Enter a valid server address'],
    ['1.2.3', 'Enter a valid server address'],
    ['example.org:abc', 'Enter a valid server address'],
    ['example.org:0', 'Enter a valid server address'],
    ['example.org:99999', 'Enter a valid server address'],
    ['https://[]', 'Enter a valid server address'],
    ['https://[:]', 'Enter a valid server address'],
    ['https://[....]', 'Enter a valid server address'],
    ['https://[1:2:3:4:5:6:7:8:9]', 'Enter a valid server address'],
    ['https://[1::2::3]', 'Enter a valid server address'],
    ['https://[12345::1]', 'Enter a valid server address'],
    ['https://[192.0.2.1::]', 'Enter a valid server address'],
    ['https://[::192.0.2.1:1]', 'Enter a valid server address'],
    ['https://' + 'a'.repeat(64) + '.org', 'Enter a valid server address']
  ])('rejects %p', (input, message) => {
    expect(validateServerUrl(input)).toBe(message);
  });
});

describe('parseServerInput', () => {
  it.each([
    ['vvg-stage.openboxes.cloud', 'https://vvg-stage.openboxes.cloud', ''],
    ['https://vvg-stage.openboxes.cloud/', 'https://vvg-stage.openboxes.cloud', ''],
    ['https://vvg-stage.openboxes.cloud/api', 'https://vvg-stage.openboxes.cloud', '/api'],
    ['https://vvg-stage.openboxes.cloud/api/', 'https://vvg-stage.openboxes.cloud', '/api'],
    ['https://vvg.openboxes.com/openboxes/api', 'https://vvg.openboxes.com', '/openboxes/api'],
    ['https://vvg.openboxes.com/openboxes', 'https://vvg.openboxes.com', '/openboxes'],
    ['HTTPS://VVG.OpenBoxes.com/OpenBoxes/API', 'https://vvg.openboxes.com', '/openboxes/api'],
    ['http://Host:8080/Ob/api', 'http://host:8080/Ob', '/api'],
    ['https://example.org/apiary', 'https://example.org/apiary', '']
  ])('%s -> base %s, suffix %p', (input, base, suffix) => {
    expect(parseServerInput(input)).toMatchObject({ base, suffix });
  });
});

describe('candidateApiUrls', () => {
  it('tries the root context first, then /openboxes/api', () => {
    expect(candidateApiUrls('https://vvg.openboxes.com/openboxes')).toEqual([
      'https://vvg.openboxes.com/api',
      'https://vvg.openboxes.com/openboxes/api'
    ]);
  });
});

describe('fallbackApiUrl', () => {
  it.each([
    ['example.org/api', 'https://example.org/api'],
    ['example.org/api/', 'https://example.org/api'],
    ['https://example.org/API', 'https://example.org/api'],
    ['https://example.org/openboxes/api', 'https://example.org/openboxes/api'],
    ['https://example.org/openboxes', 'https://example.org/openboxes/api'],
    ['example.org', 'https://example.org/openboxes/api']
  ])('%s -> %s', (input, expected) => {
    expect(fallbackApiUrl(input)).toBe(expected);
  });
});

describe('resolveApiUrl', () => {
  it('picks /api when the root context answers', async () => {
    const get = fakeGet({ 'https://vvg-stage.openboxes.cloud/api/status': OK });

    const result = await resolveApiUrl('vvg-stage.openboxes.cloud/openboxes/api', { get });

    expect(result).toEqual({ kind: 'ok', url: 'https://vvg-stage.openboxes.cloud/api' });
    expect(get).toHaveBeenCalledTimes(1);
    expect(get.mock.calls[0][1]).toMatchObject({ withCredentials: false });
  });

  it('falls back to /openboxes/api when /api is not found', async () => {
    const get = fakeGet({
      'https://vvg.openboxes.com/api/status': { status: 404, data: '<html>' },
      'https://vvg.openboxes.com/openboxes/api/status': OK
    });

    const result = await resolveApiUrl('https://vvg.openboxes.com', { get });

    expect(result).toEqual({ kind: 'ok', url: 'https://vvg.openboxes.com/openboxes/api' });
  });

  it('tries the second candidate after a transport error on the first', async () => {
    const get = fakeGet({
      'https://example.org/api/status': { transportError: true },
      'https://example.org/openboxes/api/status': OK
    });

    expect(await resolveApiUrl('example.org', { get })).toEqual({
      kind: 'ok',
      url: 'https://example.org/openboxes/api'
    });
  });

  it('accepts a database-down status as an OpenBoxes server', async () => {
    const get = fakeGet({
      'https://example.org/api/status': { status: 200, data: { status: 'OK', database: { status: false } } }
    });

    expect(await resolveApiUrl('example.org', { get })).toMatchObject({ kind: 'ok' });
  });

  it.each([
    ['an HTML page', { status: 200, data: '<html>login</html>' }],
    ['a JSON 401', { status: 401, data: { error: 'unauthorized' } }],
    ['JSON without status OK', { status: 200, data: { status: 'DOWN' } }]
  ])('rejects %s', async (_name, answer) => {
    const get = fakeGet({
      'https://example.org/api/status': answer,
      'https://example.org/openboxes/api/status': answer
    });

    expect(await resolveApiUrl('example.org', { get })).toEqual({
      kind: 'not-openboxes',
      tried: ['https://example.org/api', 'https://example.org/openboxes/api']
    });
  });

  it.each([
    ['a longer path', 'https://example.org/api-v2/status'],
    ['another host', 'https://other.example.org/api/status'],
    ['another root on the same host', 'https://example.org/openboxes/api/status']
  ])('rejects a redirect to %s', async (_name, responseURL) => {
    const get = fakeGet({
      'https://example.org/api/status': { ...OK, responseURL },
      'https://example.org/openboxes/api/status': { status: 404 }
    });

    expect(await resolveApiUrl('example.org', { get })).toMatchObject({ kind: 'not-openboxes' });
  });

  it('accepts a final URL that differs only in host case or a trailing slash', async () => {
    const get = fakeGet({
      'https://example.org/api/status': { ...OK, responseURL: 'https://EXAMPLE.org/api/status/' }
    });

    expect(await resolveApiUrl('example.org', { get })).toEqual({ kind: 'ok', url: 'https://example.org/api' });
  });

  it('accepts an http to https upgrade and stores the https URL', async () => {
    const get = fakeGet({
      'http://example.org/api/status': { ...OK, responseURL: 'https://example.org/api/status' }
    });

    expect(await resolveApiUrl('http://example.org', { get })).toEqual({
      kind: 'ok',
      url: 'https://example.org/api'
    });
  });

  it('rejects an https to http downgrade', async () => {
    const get = fakeGet({
      'https://example.org/api/status': { ...OK, responseURL: 'http://example.org/api/status' },
      'https://example.org/openboxes/api/status': { status: 404 }
    });

    expect(await resolveApiUrl('example.org', { get })).toMatchObject({ kind: 'not-openboxes' });
  });

  it('reports unreachable when nothing qualifies and a request failed in transport', async () => {
    const get = fakeGet({
      'https://example.org/api/status': { status: 404 },
      'https://example.org/openboxes/api/status': { transportError: true }
    });

    expect(await resolveApiUrl('example.org', { get })).toEqual({
      kind: 'unreachable',
      tried: ['https://example.org/api', 'https://example.org/openboxes/api']
    });
  });

  it.each([
    ['a resolved status-0 response', () => Promise.resolve({ status: 0, data: '', request: {} })],
    [
      'a rejected status-0 response',
      () => Promise.reject(Object.assign(new Error('Network Error'), { response: { status: 0 } }))
    ],
    [
      'a timeout error that carries a response',
      () => Promise.reject(Object.assign(new Error('timeout'), { code: 'ECONNABORTED', response: { status: 504 } }))
    ]
  ])('counts %s as a transport failure', async (_name, answer) => {
    const get = fakeGet({
      'https://example.org/api/status': answer,
      'https://example.org/openboxes/api/status': { status: 404 }
    });

    expect(await resolveApiUrl('example.org', { get })).toMatchObject({ kind: 'unreachable' });
  });

  it('accepts a final URL without the default port', async () => {
    const get = fakeGet({
      'https://example.org:443/api/status': { ...OK, responseURL: 'https://example.org/api/status' }
    });

    expect(await resolveApiUrl('https://example.org:443', { get })).toEqual({
      kind: 'ok',
      url: 'https://example.org:443/api'
    });
  });

  it('accepts a final URL with a compressed IPv6 literal', async () => {
    const get = fakeGet({
      'https://[2001:db8:0:0:0:0:0:1]/api/status': { ...OK, responseURL: 'https://[2001:db8::1]/api/status' }
    });

    expect(await resolveApiUrl('https://[2001:db8:0:0:0:0:0:1]', { get })).toMatchObject({ kind: 'ok' });
  });

  it('still rejects a final URL on another port', async () => {
    const get = fakeGet({
      'https://example.org/api/status': { ...OK, responseURL: 'https://example.org:8443/api/status' },
      'https://example.org/openboxes/api/status': { status: 404 }
    });

    expect(await resolveApiUrl('example.org', { get })).toMatchObject({ kind: 'not-openboxes' });
  });

  it('aborts a stalled request at its deadline and tries the next candidate', async () => {
    jest.useFakeTimers();
    const get = jest.fn((url: string, config: any) =>
      url === 'https://example.org/api/status'
        ? new Promise((_resolve, reject) => config.cancelToken.promise.then(reject))
        : Promise.resolve({ status: 200, data: { status: 'OK' }, request: {} })
    );

    const pending = resolveApiUrl('example.org', { get, timeoutMs: 6000, totalMs: 10000 });
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
    }
    jest.advanceTimersByTime(6000);
    const result = await pending;
    jest.useRealTimers();

    expect(result).toEqual({ kind: 'ok', url: 'https://example.org/openboxes/api' });
    expect(get.mock.calls[0][1].cancelToken).toBeDefined();
  });

  it('caps each request timeout by the remaining total budget', async () => {
    const now = jest.spyOn(Date, 'now');
    now.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(7000);
    const get = fakeGet({});

    await resolveApiUrl('example.org', { get, timeoutMs: 6000, totalMs: 10000 });

    expect(get.mock.calls.map((c) => c[1].timeout)).toEqual([6000, 3000]);
    now.mockRestore();
  });

  it('does not start a request once the total budget is spent', async () => {
    const now = jest.spyOn(Date, 'now');
    now.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(10000);
    const get = fakeGet({});

    const result = await resolveApiUrl('example.org', { get, timeoutMs: 6000, totalMs: 10000 });

    expect(get).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ kind: 'unreachable', tried: ['https://example.org/api'] });
    now.mockRestore();
  });
});
