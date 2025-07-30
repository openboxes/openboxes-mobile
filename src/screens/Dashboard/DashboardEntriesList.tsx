import React from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Caption } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { useOrderedDashboardEntries } from '../../hooks/useOrderedDashboardEntries';
import { setDashboardEntriesOrder, setDashboardEntriesVisibility } from '../../redux/actions/settings';
import { RootState } from '../../redux/reducers';
import { DashboardEntry } from '../Dashboard/dashboardData';
import { DraggableRow } from './DraggableRow';
import { ToggleRow } from './ToggleRow';

export function DashboardEntriesList() {
  const dispatch = useDispatch();
  const { dashboardEntriesOrder, dashboardEntriesVisibility } = useSelector(
    (state: RootState) => state.settingsReducer
  );

  const orderedEntries = useOrderedDashboardEntries(dashboardEntriesOrder);

  if (!orderedEntries || orderedEntries.length === 0) {
    return <Caption> No dashboard entries available </Caption>;
  }

  return (
    <DraggableFlatList<DashboardEntry>
      data={orderedEntries}
      keyExtractor={(item) => item.key}
      renderItem={({ item, drag, isActive }: RenderItemParams<DashboardEntry>) => (
        <DraggableRow drag={drag} isActive={isActive}>
          <ToggleRow
            title={item.screenName}
            description={item.entryDescription}
            value={dashboardEntriesVisibility[item.key] ?? item.defaultVisible ?? true}
            onValueChange={() =>
              dispatch(
                setDashboardEntriesVisibility(
                  item.key,
                  !(dashboardEntriesVisibility[item.key] ?? item.defaultVisible ?? true)
                )
              )
            }
          />
        </DraggableRow>
      )}
      onDragEnd={({ data }) => dispatch(setDashboardEntriesOrder(data.map((d) => d.key)))}
    />
  );
}
