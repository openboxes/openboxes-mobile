import { useMemo } from 'react';

import { DashboardEntry } from '../screens/Dashboard/dashboardData';

/**
 * @name useFilteredDashboardEntries
 * @description
 * Filters the dashboard entries based on user preferences.
 */
export function useFilteredDashboardEntries(
  entries: DashboardEntry[] = [],
  entriesVisibility: { [key: string]: boolean } = {}
): DashboardEntry[] {
  return useMemo(
    () =>
      entries.filter((entry) => {
        const userPref = entriesVisibility[entry.key];

        if (userPref === undefined) {
          // No user preference → defaultVisible (undefined => true)
          return entry.defaultVisible !== false;
        }

        // Show unless explicitly false
        return userPref !== false;
      }),
    [entries, entriesVisibility]
  );
}
