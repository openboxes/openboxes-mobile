import axios, { CancelToken } from 'axios';

/**
 * Runs a request that is aborted after `ms`, whatever phase it is in.
 *
 * The axios `timeout` alone is not enough on Android: React Native passes it to OkHttp as the
 * connect timeout only, so a server that accepts the connection but never answers would hang.
 */
export function withDeadline<T>(ms: number, run: (cancelToken: CancelToken) => Promise<T>): Promise<T> {
  const source = axios.CancelToken.source();
  const timer = setTimeout(() => source.cancel(`timeout of ${ms}ms exceeded`), ms);
  return run(source.token).finally(() => clearTimeout(timer));
}
