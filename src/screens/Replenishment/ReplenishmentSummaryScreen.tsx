import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Chip, Divider, Paragraph, Subheading, Text } from 'react-native-paper';

import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import { ProductDetailsItem } from '../../components/ProductDetails';
import { HYPHEN } from '../../constants';
import { navigate } from '../../NavigationService';
import { summarizeListTasks } from './lib';
import { useReplenishmentContext } from './ReplenishmentContext';
import styles from './styles';

function SummaryRow({ label, value }: ProductDetailsItem) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.paragraph}>{label}</Text>
      <Text style={[styles.paragraph, styles.fontBold]}>{value}</Text>
    </View>
  );
}

/** The completion summary of a replenishment list, once all its picks are done */
export default function ReplenishmentSummaryScreen() {
  const { currentList, listTasks, loadListTasks } = useReplenishmentContext();
  const [loadError, setLoadError] = useState<string | undefined>(undefined);
  const [hasLoaded, setHasLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadListTasks(({ errorMessage }) => {
        setLoadError(errorMessage);
        setHasLoaded(true);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentList?.id])
  );

  const summary = useMemo(() => summarizeListTasks(listTasks), [listTasks]);

  if (!currentList || loadError) {
    return (
      <View style={styles.flex1}>
        <EmptyView
          title="Replenishment Summary"
          description={
            loadError ?? 'There is no replenishment list to summarize. Choose a replenishment list to start.'
          }
        />
        <Button mode="text" style={styles.marginBottom} onPress={() => navigate('ReplenishmentList')}>
          Back To List
        </Button>
      </View>
    );
  }

  if (!hasLoaded) {
    return null;
  }

  const hasContainersToStage = summary.containersToStage.length > 0;

  return (
    <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
      <Card style={LayoutStyle.listItemContainer}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="identifier" style={[styles.chipDefault, styles.orderNumberChip]}>
              <Text style={[styles.orderNumberText, styles.fontBold]}>{currentList.orderNumber ?? HYPHEN}</Text>
            </Chip>
            <Chip icon="check-circle-outline" style={styles.chipDefault}>
              <Text style={[styles.chipText, styles.fontBold]}>
                {summary.open > 0 ? `${summary.open} to pick` : 'Picks Complete'}
              </Text>
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <SummaryRow label="Total Tasks" value={summary.total} />
          <SummaryRow label="Completed" value={summary.completed} />
          <SummaryRow label="Partial" value={summary.partial} />
          <SummaryRow label="Not Picked" value={summary.notPicked} />
          <SummaryRow
            label="Containers to Stage"
            value={
              hasContainersToStage
                ? summary.containersToStage.map(({ container }) => container.locationNumber).join(', ')
                : HYPHEN
            }
          />
        </Card.Content>
      </Card>

      <View style={styles.wrapperWithPadding}>
        {hasContainersToStage ? (
          <>
            <Subheading style={styles.subheading}>Stage Replenishment Containers</Subheading>
            <Paragraph style={styles.paragraph}>
              Take the containers to the replenishment awaiting putaway location and scan it for each container.
            </Paragraph>
            <Button mode="contained" style={styles.marginTop} onPress={() => navigate('ReplenishmentStagingLocation')}>
              Stage Containers
            </Button>
          </>
        ) : (
          <>
            <Paragraph style={styles.paragraph}>
              Nothing was put in a container, so there is nothing to stage.
            </Paragraph>
            <Button mode="text" style={styles.marginTop} onPress={() => navigate('ReplenishmentList')}>
              Back To List
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
}
