import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Chip, Divider, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_FALLBACK, EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { getStockTransferCandidatesAction } from '../../redux/actions/createTransfer';
import { RootState } from '../../redux/reducers';
import CreateTransferItemRowSkeleton from './CreateTransferItemRowSkeleton';
import styles from './styles';
import { CreateTransferStackParams, SelectedInventoryItem, StockTransferCandidate } from './types';

type ItemListRouteProp = RouteProp<CreateTransferStackParams, 'CreateTransferItemList'>;

const SKELETON_ROW_COUNT = 6;

type CandidateRowProps = {
  candidate: StockTransferCandidate;
  onPress: (candidate: StockTransferCandidate) => void;
};

function CandidateRow({ candidate, onPress }: CandidateRowProps) {
  const productCode = candidate.product?.productCode || '-';
  const productName = candidate.product?.name;
  const bin = candidate.originBinLocation?.locationNumber || candidate.originBinLocation?.name || '-';
  const lot = candidate.lotNumber ? `Lot ${candidate.lotNumber}` : '';
  const expiry = candidate.expirationDate ? ` • Exp ${candidate.expirationDate}` : '';
  const detail = `${lot}${expiry}`.trim();
  const qty = candidate.quantityNotPicked ?? candidate.quantityOnHand ?? 0;

  const handlePress = useCallback(() => onPress(candidate), [candidate, onPress]);

  return (
    <TouchableOpacity style={styles.candidateRow} activeOpacity={0.7} onPress={handlePress}>
      <View style={styles.candidateRowMain}>
        <View style={styles.candidateColProduct}>
          <Text style={styles.candidateProduct} numberOfLines={1}>
            {productCode}
          </Text>
          {productName ? (
            <Text style={styles.candidateProductName} numberOfLines={1}>
              {productName}
            </Text>
          ) : null}
        </View>
        <View style={styles.candidateColBin}>
          <Text style={styles.candidateBin} numberOfLines={1}>
            {bin}
          </Text>
          {detail ? (
            <Text style={styles.candidateLot} numberOfLines={1}>
              {detail}
            </Text>
          ) : null}
        </View>
        <View style={styles.candidateColQty}>
          <Text style={styles.candidateQty}>{qty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CreateTransferItemListScreen() {
  const { params } = useRoute<ItemListRouteProp>();
  const { productId, productCode, binId, binName, searchTerm: initialSearchTerm } = params || {};

  const dispatch = useDispatch();
  const currentLocation = useSelector((state: RootState) => state.mainReducer.currentLocation);

  const [candidates, setCandidates] = useState<StockTransferCandidate[]>([]);
  // filterInput tracks the controlled value; searchTerm only updates on debounced submit.
  const [filterInput, setFilterInput] = useState<string>(initialSearchTerm ?? EMPTY_STRING);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm ?? EMPTY_STRING);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCandidates = useCallback(() => {
    if (!currentLocation?.id) {
      return;
    }
    setIsLoading(true);
    dispatch(
      getStockTransferCandidatesAction(
        currentLocation.id,
        (response: any) => {
          setIsLoading(false);
          if (response && !response.error && Array.isArray(response.data)) {
            setCandidates(response.data as StockTransferCandidate[]);
          } else {
            setCandidates([]);
          }
        },
        true
      )
    );
  }, [dispatch, currentLocation?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchCandidates();
    }, [fetchCandidates])
  );

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return candidates.filter((c) => {
      if (productId && c.product?.id !== productId) {
        return false;
      }
      if (binId && c.originBinLocation?.id !== binId) {
        return false;
      }
      if (!term) {
        return true;
      }
      const code = c.product?.productCode?.toLowerCase() || '';
      const name = c.product?.name?.toLowerCase() || '';
      const bin = c.originBinLocation?.locationNumber?.toLowerCase() || c.originBinLocation?.name?.toLowerCase() || '';
      const lot = c.lotNumber?.toLowerCase() || '';
      return code.includes(term) || name.includes(term) || bin.includes(term) || lot.includes(term);
    });
  }, [candidates, productId, binId, searchTerm]);

  const contextLabel = useMemo(() => {
    if (productCode) {
      return { label: 'Product', value: productCode };
    }
    if (binName) {
      return { label: 'Bin', value: binName };
    }
    return { label: 'Search', value: initialSearchTerm ?? EMPTY_STRING };
  }, [productCode, binName, initialSearchTerm]);

  const handleRowPress = useCallback((candidate: StockTransferCandidate) => {
    if (!candidate?.originBinLocation?.id || !candidate?.inventoryItem?.id || !candidate?.product?.id) {
      return;
    }
    const selected: SelectedInventoryItem = {
      inventoryItemId: candidate.inventoryItem.id,
      productAvailabilityId: candidate.productAvailabilityId,
      product: candidate.product,
      originBinLocation: candidate.originBinLocation,
      lotNumber: candidate.lotNumber ?? null,
      expirationDate: candidate.expirationDate ?? null,
      quantityOnHand: candidate.quantityOnHand,
      quantityNotPicked: candidate.quantityNotPicked
    };
    navigate('CreateTransferQuantity', { item: selected });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: StockTransferCandidate }) => <CandidateRow candidate={item} onPress={handleRowPress} />,
    [handleRowPress]
  );

  const handleFilterChange = useCallback((next: string) => {
    setFilterInput(next);
    // ScannerInput's auto-submit skips empty values; clear searchTerm eagerly.
    if (next.trim() === '') {
      setSearchTerm('');
    }
  }, []);

  const keyExtractor = useCallback(
    (c: StockTransferCandidate) => `${c.inventoryItem?.id}-${c.originBinLocation?.id}`,
    []
  );

  const ListHeader = (
    <>
      <View style={[styles.productDetails]}>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText}>
            {contextLabel.label}: <Text style={styles.bold}>{contextLabel.value}</Text>
          </Chip>
        </View>
        <ScannerInput
          style={styles.filterInputSpacing}
          label="Filter"
          placeholder="Filter by product, bin, or lot"
          autoSubmitTimeout={400}
          value={filterInput}
          onChange={handleFilterChange}
          onSubmit={setSearchTerm}
        />
      </View>

      <Divider />

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.tableHeaderProduct]}>Product</Text>
        <Text style={[styles.tableHeaderText, styles.tableHeaderBin]}>Bin / Lot</Text>
        <Text style={[styles.tableHeaderText, styles.tableHeaderQty]}>Qty</Text>
      </View>
    </>
  );

  const ListEmpty = isLoading ? (
    <View>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_unused, idx) => (
        <CreateTransferItemRowSkeleton key={`skeleton-${idx}`} />
      ))}
    </View>
  ) : (
    <View style={styles.emptyTableContent}>
      <Paragraph style={styles.emptyText}>
        {candidates.length === 0 ? 'No inventory found.' : `No matches for "${searchTerm || EMPTY_FALLBACK}".`}
      </Paragraph>
    </View>
  );

  return (
    <FlatList
      style={styles.contentWrapper}
      keyboardShouldPersistTaps="always"
      data={isLoading ? [] : filteredCandidates}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmpty}
    />
  );
}
