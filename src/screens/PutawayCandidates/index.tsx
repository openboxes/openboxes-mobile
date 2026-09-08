import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import showPopup from '../../components/Popup';
import { EMPTY_STRING } from '../../constants';
import { getCandidates } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import { putawayCandidateKey } from '../../utils/putawayCandidate';
import PutawayCandidateCardSkeleton from './PutawayCandidateCardSkeleton';
import styles from './styles';
import { PutawayCandidate } from './types';

const SKELETON_CARD_COUNT = 6;

function matchesSearchTerm(candidate: PutawayCandidate, term: string): boolean {
  return (
    (candidate['inventoryItem.lotNumber']?.toLowerCase().includes(term) ?? false) ||
    (candidate['currentLocation.name']?.toLowerCase().includes(term) ?? false) ||
    (candidate['currentLocation.id']?.toLowerCase().includes(term) ?? false)
  );
}

export default function PutawayCandidates() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const candidates = useSelector((state: RootState) => state.putawayReducer.candidates);
  const putawayOverrides = useSelector((state: RootState) => state.putawayReducer.putawayOverrides);
  const currentLocation = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const productSummaryConfig = useSelector((state: RootState) => state.settingsReducer.productSummaryConfig);

  const [searchTerm, setSearchTerm] = useState<string>(EMPTY_STRING);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const showLotNumber = productSummaryConfig?.lotNumber !== false;
  const showExpirationDate = productSummaryConfig?.expirationDate !== false;

  const navigateToPutawayItem = useCallback(
    (item: PutawayCandidate) => navigation.navigate('PutawayItem', { item }),
    [navigation]
  );

  const getScreenData = useCallback(() => {
    if (!currentLocation?.id) {
      setRefreshing(false);
      setInitialLoading(false);
      return;
    }

    setRefreshing(true);
    dispatch(
      getCandidates(
        currentLocation.id,
        (data: any) => {
          setRefreshing(false);
          setInitialLoading(false);
          if (data?.error) {
            showPopup({
              title: 'Putaway Candidates',
              message: data.errorMessage ?? 'Failed to load putaway candidates',
              positiveButton: {
                text: 'Retry',
                callback: () => getScreenData()
              },
              negativeButtonText: 'Cancel'
            });
          }
        },
        true
      )
    );
  }, [dispatch, currentLocation?.id]);

  useFocusEffect(
    useCallback(() => {
      getScreenData();
    }, [getScreenData])
  );

  const putawayCandidates = useMemo<PutawayCandidate[]>(
    () =>
      (candidates ?? [])
        .filter((candidate: PutawayCandidate) => candidate.putawayStatus === 'READY')
        .map((candidate: PutawayCandidate) => {
          const override = putawayOverrides?.[putawayCandidateKey(candidate)];
          return override === undefined ? candidate : { ...candidate, quantity: override };
        })
        .filter((candidate: PutawayCandidate) => Number(candidate.quantity) > 0)
        .sort((a: PutawayCandidate, b: PutawayCandidate) =>
          (a['currentLocation.name'] ?? '').toLowerCase().localeCompare((b['currentLocation.name'] ?? '').toLowerCase())
        ),
    [candidates, putawayOverrides]
  );

  const visibleData = useMemo<PutawayCandidate[]>(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return putawayCandidates;
    }
    return putawayCandidates.filter((candidate) => matchesSearchTerm(candidate, term));
  }, [putawayCandidates, searchTerm]);

  const resetFiltering = useCallback(() => setSearchTerm(EMPTY_STRING), []);

  const onSearchTermSubmit = useCallback(
    (query: string) => {
      const term = query.trim().toLowerCase();
      if (!term) {
        resetFiltering();
        return;
      }

      const exactLotMatches = putawayCandidates.filter(
        (candidate) => candidate['inventoryItem.lotNumber']?.toLowerCase() === term
      );

      if (exactLotMatches.length === 1) {
        resetFiltering();
        navigateToPutawayItem(exactLotMatches[0]);
        return;
      }

      setSearchTerm(query);
    },
    [putawayCandidates, navigateToPutawayItem, resetFiltering]
  );

  const renderItem = useCallback(
    (item: PutawayCandidate) => (
      <Card style={LayoutStyle.listItemContainer} onPress={() => navigateToPutawayItem(item)}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
              {`Location: ${item['currentLocation.name']}`}
            </Chip>
            <Chip style={styles.chipWarning} textStyle={styles.chipWarningText}>
              {item.putawayStatus}
            </Chip>
          </View>
          <Divider style={styles.contentDivider} />

          <Subheading style={styles.destinationSubheading}>
            {`${item['product.productCode']} - ${item['product.name']}`}
          </Subheading>
          {showLotNumber && (
            <Caption style={styles.caption}> {`Lot Number: ${item['inventoryItem.lotNumber'] ?? 'Default'}`}</Caption>
          )}

          <View style={styles.additionalInfoRow}>
            {showExpirationDate && (
              <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
                {`Expiration Date: ${item['inventoryItem.expirationDate'] ?? 'Never'}`}
              </Chip>
            )}
            <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
              {`Quantity: ${item.quantity}`}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    ),
    [navigateToPutawayItem, showLotNumber, showExpirationDate]
  );

  return (
    <SafeAreaView style={styles.container}>
      <BarcodeSearchHeader
        autoSearch
        placeholder="Search by lot number or current location"
        resetSearch={resetFiltering}
        searchBox={false}
        loading={initialLoading || refreshing}
        accessibilityLabel="Search putaway candidates"
        onSearchTermSubmit={onSearchTermSubmit}
      />
      <Button style={styles.refreshButton} size="90%" title="Refresh (Get Latest Data)" onPress={getScreenData} />
      {initialLoading ? (
        <ListLoadingSkeleton visible count={SKELETON_CARD_COUNT} CardComponent={PutawayCandidateCardSkeleton} />
      ) : (
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getScreenData} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          data={visibleData}
          renderItem={({ item }) => renderItem(item)}
          ListEmptyComponent={
            <EmptyView
              title="Putaway Candidates"
              description={emptyStateMessage('candidates', searchTerm, 'There are no candidate items to Putaway')}
              isRefresh={false}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
