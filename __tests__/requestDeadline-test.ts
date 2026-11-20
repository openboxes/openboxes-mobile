import axios, { CancelToken } from 'axios';

import { withDeadline } from '../src/utils/requestDeadline';

// A request that never answers until its cancel token fires, like a server that accepts the
// connection and then stalls
function hangingRequest(cancelToken: CancelToken): Promise<never> {
  return new Promise((_resolve, reject) => {
    cancelToken.promise.then(reject);
  });
}

async function flush() {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('withDeadline', () => {
  it('cancels a request that has not settled by the deadline', async () => {
    const settled = jest.fn();
    const failed = jest.fn();
    withDeadline(5000, hangingRequest).then(settled, failed);

    jest.advanceTimersByTime(4999);
    await flush();
    expect(failed).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await flush();
    expect(settled).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalledTimes(1);
    expect(axios.isCancel(failed.mock.calls[0][0])).toBe(true);
  });

  it('returns the result of a request that settles in time and never cancels it afterwards', async () => {
    let token: CancelToken | undefined;
    const result = await withDeadline(5000, (cancelToken) => {
      token = cancelToken;
      return Promise.resolve('done');
    });

    jest.advanceTimersByTime(10000);
    await flush();
    expect(result).toBe('done');
    expect(token!.reason).toBeUndefined();
  });

  it('passes on a failure that happens in time and never cancels afterwards', async () => {
    let token: CancelToken | undefined;
    await expect(
      withDeadline(5000, (cancelToken) => {
        token = cancelToken;
        return Promise.reject(new Error('refused'));
      })
    ).rejects.toThrow('refused');

    jest.advanceTimersByTime(10000);
    await flush();
    expect(token!.reason).toBeUndefined();
  });
});
