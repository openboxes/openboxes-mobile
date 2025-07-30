import { useMemo } from 'react';

import { DashboardEntry, getDashboardEntries } from '../screens/Dashboard/dashboardData';

/**
 * @name useOrderedDashboardEntries
 * @description
 * Returns the ordered list of dashboard entries based on the user-saved order.
 */
export function useOrderedDashboardEntries(dashboardEntriesOrder: string[]): DashboardEntry[] {
  const allEntries = useMemo(() => getDashboardEntries(), []);

  const orderedEntries = useMemo(() => {
    const defaultKeys = allEntries.map((entry) => entry.key);
    const keyOrder = dashboardEntriesOrder && dashboardEntriesOrder.length > 0 ? dashboardEntriesOrder : defaultKeys;

    // Build a map for quick key→entry lookup.
    const entryByKey = new Map<string, DashboardEntry>(allEntries.map((entry) => [entry.key, entry]));

    // Pull out entries in the requested key order (skip missing keys).
    const core: DashboardEntry[] = [];
    keyOrder.forEach((key) => {
      const entry = entryByKey.get(key);
      if (entry) {
        core.push(entry);
        entryByKey.delete(key);
      }
    });

    // Any remaining entries (newly added) go on the end.
    const extras: DashboardEntry[] = [];
    allEntries.forEach((entry) => {
      if (entryByKey.has(entry.key)) {
        extras.push(entry);
      }
    });

    return [...core, ...extras];
  }, [allEntries, dashboardEntriesOrder]);

  return orderedEntries;
}
