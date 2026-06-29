import { useWindowDimensions } from 'react-native';

export type BreakpointLabel = 'small' | 'medium' | 'large';

type BreakpointConfig = {
  [key: number]: { columns: number; label: BreakpointLabel };
};

type ResponsiveResult = {
  columns: number;
  label: BreakpointLabel;
  width: number;
};

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  320: { columns: 2, label: 'medium' },
  600: { columns: 3, label: 'large' }
};

const DEFAULT_CONFIG = { columns: 1, label: 'small' } as const;

/**
 * @name useResponsiveColumns
 * Hook that returns how many columns to use and a label (small/medium/large).
 *
 * @param breakpoints optional override, defaults to DEFAULT_BREAKPOINTS
 * @param defaultConfig optional override, defaults to DEFAULT_CONFIG
 */
export function useResponsiveColumns(
  breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS,
  defaultConfig: { columns: number; label: BreakpointLabel } = DEFAULT_CONFIG
): ResponsiveResult {
  const { width } = useWindowDimensions();

  // Sort numeric breakpoints ascending
  const sortedBreakpoints = Object.keys(breakpoints)
    .map((bp) => parseInt(bp, 10))
    .sort((a, b) => a - b);

  let result = defaultConfig;

  for (const bp of sortedBreakpoints) {
    if (width >= bp) {
      result = breakpoints[bp];
    } else {
      break;
    }
  }

  return { ...result, width };
}
