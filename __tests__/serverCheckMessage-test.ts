import { checkErrorMessage } from '../src/screens/Profiles/serverCheckMessage';

describe('checkErrorMessage', () => {
  const unreachable = { kind: 'unreachable' as const, tried: ['https://10.0.2.2:8080/api'] };

  it('suggests http:// when the address had no scheme and the server could not be reached', () => {
    expect(checkErrorMessage(unreachable, '10.0.2.2:8080')).toBe(
      'Could not reach the server. Check the address and your connection. If the server does not use HTTPS, include http:// in the address.'
    );
  });

  it('does not suggest http:// when the user typed a scheme', () => {
    expect(checkErrorMessage(unreachable, 'https://10.0.2.2:8080')).toBe(
      'Could not reach the server. Check the address and your connection.'
    );
  });

  it('lists the tried roots when no OpenBoxes server was found', () => {
    expect(
      checkErrorMessage(
        { kind: 'not-openboxes', tried: ['https://example.org/api', 'https://example.org/openboxes/api'] },
        'example.org'
      )
    ).toBe('No OpenBoxes server found at https://example.org/api or https://example.org/openboxes/api.');
  });

  it('says the server is down, not that the address is wrong, for a 5xx', () => {
    expect(
      checkErrorMessage({ kind: 'unavailable', status: 503, tried: ['https://example.org/api'] }, 'example.org')
    ).toBe('The server answered with an error (503). It may be down or restarting. Try again later.');
  });

  it('has no message for a successful check', () => {
    expect(checkErrorMessage({ kind: 'ok', url: 'https://example.org/api' }, 'example.org')).toBeNull();
  });
});
