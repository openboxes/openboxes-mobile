import { useCallback, useEffect, useRef, useState } from 'react';

import { resolveApiUrl, ResolveResult } from '../../utils/serverUrl';

type Resolver = (input: string) => Promise<ResolveResult>;

type UseServerCheckResult = {
  checking: boolean;
  result: ResolveResult | null;
  // Resolves to null when the check was superseded or invalidated before it finished
  check: (input: string) => Promise<ResolveResult | null>;
  // Drops any check in flight and clears its state
  invalidate: () => void;
};

/**
 * Runs server checks for the profile dialog. Every check, invalidation and unmount moves a token
 * forward, so a check that finishes late can never be applied.
 */
export function useServerCheck(resolve: Resolver = resolveApiUrl): UseServerCheckResult {
  const token = useRef(0);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ResolveResult | null>(null);

  useEffect(() => {
    return () => {
      token.current += 1;
    };
  }, []);

  const invalidate = useCallback(() => {
    token.current += 1;
    setChecking(false);
    setResult(null);
  }, []);

  const check = useCallback(
    async (input: string): Promise<ResolveResult | null> => {
      token.current += 1;
      const mine = token.current;
      setChecking(true);
      setResult(null);

      let outcome: ResolveResult;
      try {
        outcome = await resolve(input);
      } catch {
        outcome = { kind: 'unreachable', tried: [] };
      }

      if (mine !== token.current) {
        return null;
      }
      setChecking(false);
      setResult(outcome);
      return outcome;
    },
    [resolve]
  );

  return { checking, result, check, invalidate };
}
