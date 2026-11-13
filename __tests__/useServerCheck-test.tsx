import React from 'react';
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { useServerCheck } from '../src/screens/Profiles/useServerCheck';
import { ResolveResult } from '../src/utils/serverUrl';

type Deferred = { promise: Promise<ResolveResult>; resolve: (r: ResolveResult) => void; reject: (e: any) => void };

function deferred(): Deferred {
  let resolve: any;
  let reject: any;
  const promise = new Promise<ResolveResult>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const OK_A: ResolveResult = { kind: 'ok', url: 'https://a.example.org/api' };
const OK_B: ResolveResult = { kind: 'ok', url: 'https://b.example.org/api' };

function setup() {
  const pending: Deferred[] = [];
  const resolver = jest.fn(() => {
    const d = deferred();
    pending.push(d);
    return d.promise;
  });
  const hook: { current: ReturnType<typeof useServerCheck> } = { current: null as any };
  function Harness() {
    hook.current = useServerCheck(resolver);
    return null;
  }
  let renderer: ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(<Harness />);
  });
  return { hook, pending, resolver, unmount: () => act(() => renderer.unmount()) };
}

describe('useServerCheck', () => {
  it('returns and stores the result of a check', async () => {
    const { hook, pending } = setup();

    let checkPromise: Promise<ResolveResult | null>;
    act(() => {
      checkPromise = hook.current.check('a.example.org');
    });
    expect(hook.current.checking).toBe(true);

    let returned: ResolveResult | null = null;
    await act(async () => {
      pending[0].resolve(OK_A);
      returned = await checkPromise;
    });

    expect(returned).toEqual(OK_A);
    expect(hook.current.checking).toBe(false);
    expect(hook.current.result).toEqual(OK_A);
  });

  it('never applies a check canceled before a new check in a reopened dialog', async () => {
    const { hook, pending } = setup();

    let first: Promise<ResolveResult | null>;
    act(() => {
      first = hook.current.check('a.example.org');
    });
    act(() => hook.current.invalidate());
    let second: Promise<ResolveResult | null>;
    act(() => {
      second = hook.current.check('b.example.org');
    });

    let firstReturned: ResolveResult | null = OK_B;
    await act(async () => {
      pending[0].resolve(OK_A);
      firstReturned = await first;
    });
    expect(firstReturned).toBeNull();
    expect(hook.current.checking).toBe(true);
    expect(hook.current.result).toBeNull();

    await act(async () => {
      pending[1].resolve(OK_B);
      await second;
    });
    expect(hook.current.result).toEqual(OK_B);
  });

  it('lets a newer check win over an older one that finishes later', async () => {
    const { hook, pending } = setup();

    let first: Promise<ResolveResult | null>;
    let second: Promise<ResolveResult | null>;
    act(() => {
      first = hook.current.check('a.example.org');
    });
    act(() => {
      second = hook.current.check('b.example.org');
    });

    await act(async () => {
      pending[1].resolve(OK_B);
      await second;
    });
    let firstReturned: ResolveResult | null = OK_A;
    await act(async () => {
      pending[0].resolve(OK_A);
      firstReturned = await first;
    });

    expect(firstReturned).toBeNull();
    expect(hook.current.result).toEqual(OK_B);
  });

  it('clears checking and the result on invalidate, so an edit during a check never leaves it stuck', async () => {
    const { hook, pending } = setup();

    let first: Promise<ResolveResult | null>;
    act(() => {
      first = hook.current.check('a.example.org');
    });
    act(() => hook.current.invalidate());

    expect(hook.current.checking).toBe(false);
    await act(async () => {
      pending[0].resolve({ kind: 'unreachable', tried: ['https://a.example.org/api'] });
      await first;
    });
    expect(hook.current.checking).toBe(false);
    expect(hook.current.result).toBeNull();
  });

  it('clears a failed result (and with it Save anyway) on invalidate', async () => {
    const { hook, pending } = setup();

    let first: Promise<ResolveResult | null>;
    act(() => {
      first = hook.current.check('a.example.org');
    });
    await act(async () => {
      pending[0].resolve({ kind: 'not-openboxes', tried: ['https://a.example.org/api'] });
      await first;
    });
    expect(hook.current.result).toMatchObject({ kind: 'not-openboxes' });

    act(() => hook.current.invalidate());

    expect(hook.current.result).toBeNull();
  });

  it('drops a check that finishes after unmount', async () => {
    const { hook, pending, unmount } = setup();

    let first: Promise<ResolveResult | null>;
    act(() => {
      first = hook.current.check('a.example.org');
    });
    unmount();

    let returned: ResolveResult | null = OK_B;
    await act(async () => {
      pending[0].resolve(OK_A);
      returned = await first;
    });
    expect(returned).toBeNull();
  });

  it('treats a resolver error as unreachable', async () => {
    const { hook, pending } = setup();

    let first: Promise<ResolveResult | null>;
    act(() => {
      first = hook.current.check('a.example.org');
    });
    let returned: ResolveResult | null = null;
    await act(async () => {
      pending[0].reject(new Error('boom'));
      returned = await first;
    });

    expect(returned).toEqual({ kind: 'unreachable', tried: [] });
  });
});
