import axios, { CancelToken } from 'axios';

import { withDeadline } from './requestDeadline';

/**
 * Turns what a user types as a server address into a working API root.
 *
 * Servers differ in their context path: some answer at the root (https://host/api), others under
 * /openboxes (https://host/openboxes/api). The user may type a bare host, or a URL ending in /api,
 * /openboxes/api or /openboxes; resolveApiUrl probes the unauthenticated status endpoint to find the
 * root that answers.
 */

export type ApiSuffix = '' | '/api' | '/openboxes/api' | '/openboxes';

export type ParsedServerInput = {
  // scheme + host (+ port), lowercase
  origin: string;
  // the typed path without a recognized suffix; case kept
  path: string;
  // the recognized suffix the user typed, lowercase
  suffix: ApiSuffix;
  // origin + path
  base: string;
};

export type ResolveResult =
  | { kind: 'ok'; url: string }
  | { kind: 'not-openboxes'; tried: string[] }
  | { kind: 'unreachable'; tried: string[] };

type HttpGet = (
  url: string,
  config: { timeout: number; withCredentials: boolean; cancelToken: CancelToken }
) => Promise<any>;

export type ResolveOptions = {
  // per request
  timeoutMs?: number;
  // for the whole resolution
  totalMs?: number;
  get?: HttpGet;
};

const INVALID_ADDRESS = 'Enter a valid server address';
const SCHEME_PATTERN = /^([a-z][a-z0-9+.-]*):\/\//i;
const DNS_LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
const SUFFIXES: ApiSuffix[] = ['/openboxes/api', '/api', '/openboxes'];

function isIpv4(host: string): boolean {
  const octets = host.split('.');
  return octets.length === 4 && octets.every((o) => /^\d{1,3}$/.test(o) && Number(o) <= 255);
}

function isIpv6(address: string): boolean {
  if (!/^[0-9a-f:.]+$/i.test(address)) {
    return false;
  }
  const halves = address.split('::');
  if (halves.length > 2) {
    return false;
  }

  const groupsOf = (part: string): string[] => (part === '' ? [] : part.split(':'));
  const groups = [...groupsOf(halves[0]), ...(halves.length === 2 ? groupsOf(halves[1]) : [])];

  // An embedded IPv4 address may only end the address, and counts as two groups
  let count = groups.length;
  if (address.includes('.')) {
    const tail = address.slice(address.lastIndexOf(':') + 1);
    if (!isIpv4(tail) || groups[groups.length - 1] !== tail) {
      return false;
    }
    groups.pop();
    count += 1;
  }

  if (!groups.every((g) => /^[0-9a-f]{1,4}$/i.test(g))) {
    return false;
  }
  return halves.length === 2 ? count <= 7 : count === 8;
}

function isHostName(host: string): boolean {
  if (host.length > 253) {
    return false;
  }
  const labels = host.split('.');
  // Something that looks numeric must be a complete IPv4 address
  if (labels.every((l) => /^\d+$/.test(l))) {
    return isIpv4(host);
  }
  return labels.every((l) => DNS_LABEL_PATTERN.test(l));
}

function isValidAuthority(authority: string): boolean {
  let host = authority;
  let port: string | undefined;

  if (authority.startsWith('[')) {
    const match = /^\[([^\]]*)\](?::(.*))?$/.exec(authority);
    if (!match || !isIpv6(match[1])) {
      return false;
    }
    port = match[2];
  } else {
    const parts = authority.split(':');
    if (parts.length > 2) {
      return false;
    }
    [host, port] = parts;
    if (!isHostName(host)) {
      return false;
    }
  }

  if (port === undefined) {
    return true;
  }
  return /^\d{1,5}$/.test(port) && Number(port) >= 1 && Number(port) <= 65535;
}

/** Returns an error message, or null when the input is a usable server address. */
export function validateServerUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return 'URL is required';
  }

  const scheme = SCHEME_PATTERN.exec(trimmed);
  if (scheme && !/^https?$/i.test(scheme[1])) {
    return 'URL must start with http:// or https://';
  }
  if (/[\s@?#]/.test(trimmed)) {
    return INVALID_ADDRESS;
  }

  const rest = scheme ? trimmed.slice(scheme[0].length) : trimmed;
  const authority = rest.split('/')[0];
  if (!authority || !isValidAuthority(authority)) {
    return INVALID_ADDRESS;
  }
  return null;
}

/** Canonical form of a (validated) server address. Scheme and host are lowercased; the path keeps its case. */
export function parseServerInput(input: string): ParsedServerInput {
  let url = input.trim().replace(/\/+$/, '');
  if (!SCHEME_PATTERN.test(url)) {
    url = `https://${url}`;
  }

  const match = /^([a-z][a-z0-9+.-]*:\/\/[^/]*)(.*)$/i.exec(url);
  const origin = (match ? match[1] : url).toLowerCase();
  let path = match ? match[2] : '';

  let suffix: ApiSuffix = '';
  for (const candidate of SUFFIXES) {
    if (path.toLowerCase().endsWith(candidate)) {
      suffix = candidate;
      path = path.slice(0, path.length - candidate.length);
      break;
    }
  }

  return { origin, path, suffix, base: origin + path };
}

/** The API roots to probe, in order: root context first. */
export function candidateApiUrls(input: string): string[] {
  const { base } = parseServerInput(input);
  return [`${base}/api`, `${base}/openboxes/api`];
}

/** The API root to store when the user saves without a successful check. */
export function fallbackApiUrl(input: string): string {
  const { base, suffix } = parseServerInput(input);
  return suffix === '/api' || suffix === '/openboxes/api' ? base + suffix : `${base}/openboxes/api`;
}

function expandIpv6(address: string): string {
  let text = address.toLowerCase();
  const ipv4 = /(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(text);
  if (ipv4) {
    const [a, b, c, d] = ipv4.slice(1).map(Number);
    text = text.slice(0, ipv4.index) + (a * 256 + b).toString(16) + ':' + (c * 256 + d).toString(16);
  }
  const [head, tail] = text.split('::');
  const headGroups = head ? head.split(':') : [];
  const tailGroups = tail !== undefined && tail !== '' ? tail.split(':') : [];
  const zeros = tail !== undefined ? new Array(8 - headGroups.length - tailGroups.length).fill('0') : [];
  return [...headGroups, ...zeros, ...tailGroups].map((g) => parseInt(g, 16).toString(16)).join(':');
}

// Comparable form of an origin: default ports dropped, IPv6 literals expanded (platforms report
// the final URL in their own canonical form)
function comparableOrigin(origin: string): string {
  const match = /^(https?):\/\/(\[[^\]]*\]|[^:]*)(?::(\d+))?$/.exec(origin);
  if (!match) {
    return origin;
  }
  const [, scheme, host, port] = match;
  const defaultPort = scheme === 'https' ? '443' : '80';
  const hostPart = host.startsWith('[') && isIpv6(host.slice(1, -1)) ? `[${expandIpv6(host.slice(1, -1))}]` : host;
  return `${scheme}://${hostPart}${port && port !== defaultPort ? `:${port}` : ''}`;
}

function canonicalUrl(url: string): string {
  const { origin, path, suffix } = parseServerInput(url);
  return comparableOrigin(origin) + path + suffix;
}

// No HTTP answer: DNS, refused, TLS, timeout, abort. axios 0.22 can also settle a status-0 response.
function isTransportFailure(error: any): boolean {
  const response = error?.response;
  return !response || response.status === 0 || error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT';
}

function isOpenBoxesStatus(response: any): boolean {
  const data = response?.data;
  return response?.status === 200 && data !== null && typeof data === 'object' && data.status === 'OK';
}

/**
 * The root to store for a candidate that answered, or null when the request ended up somewhere else
 * (all app requests are relative to the stored root). Only an http -> https upgrade is allowed.
 */
function acceptedRoot(candidate: string, response: any): string | null {
  const finalUrl = response?.request?.responseURL;
  if (typeof finalUrl !== 'string' || !finalUrl) {
    return candidate;
  }

  const expected = canonicalUrl(`${candidate}/status`);
  const actual = canonicalUrl(finalUrl);
  if (actual === expected) {
    return candidate;
  }
  const upgraded = canonicalUrl(`https://${candidate.slice('http://'.length)}/status`);
  if (candidate.startsWith('http://') && actual === upgraded) {
    return `https://${candidate.slice('http://'.length)}`;
  }
  return null;
}

/** Finds the API root for what the user typed. Never throws. */
export async function resolveApiUrl(input: string, options: ResolveOptions = {}): Promise<ResolveResult> {
  const { timeoutMs = 6000, totalMs = 10000, get = axios.get } = options;
  const deadline = Date.now() + totalMs;
  const tried: string[] = [];
  let transportFailure = false;

  for (const candidate of candidateApiUrls(input)) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      transportFailure = true;
      break;
    }

    tried.push(candidate);
    try {
      const timeout = Math.min(timeoutMs, remaining);
      const response = await withDeadline(timeout, (cancelToken) =>
        get(`${candidate}/status`, { timeout, withCredentials: false, cancelToken })
      );
      if (response?.status === 0) {
        transportFailure = true;
      } else if (isOpenBoxesStatus(response)) {
        const root = acceptedRoot(candidate, response);
        if (root) {
          return { kind: 'ok', url: root };
        }
      }
    } catch (error: any) {
      if (isTransportFailure(error)) {
        transportFailure = true;
      }
    }
  }

  return transportFailure ? { kind: 'unreachable', tried } : { kind: 'not-openboxes', tried };
}
