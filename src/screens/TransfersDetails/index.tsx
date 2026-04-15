import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, ListRenderItemInfo, RefreshControl, ToastAndroid, View } from 'react-native';
import { Caption, Card, Chip, Divider, Text, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import ArrowRight from '../../assets/images/arrow_right.svg';
import Button from '../../components/Button';
import { TransferDetailsSkeleton } from '../../components/ContentSkeleton';
import EmptyView from '../../components/EmptyView';
import { EMPTY_FALLBACK } from '../../constants';
import { completeStockTransfer, getStockTransfersSummary } from '../../redux/actions/transfers';
import styles from './styles';

type TransferDetailsRouteParams = {
  TransferDetails: {
    transfers: any;
    onCallBackHandler: (data: any) => void;
  };
};

type TransferDetailsRouteProp = RouteProp<TransferDetailsRouteParams, 'TransferDetails'>;

const COMPLETABLE_STATUSES = ['PENDING', 'APPROVED'];

export default function TransferDetails() {
  const route = useRoute<TransferDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { transfers, onCallBackHandler } = route.params;

  const [transferDetail, setTransferDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransferSummary = useCallback(() => {
    setIsLoading(true);
    dispatch(
      getStockTransfersSummary(transfers?.id, (data: any) => {
        setIsLoading(false);
        if (data?.error) {
          Alert.alert('Failed to Load', data.errorMessage ?? 'Could not load transfer details.', [
            { text: 'Retry', onPress: fetchTransferSummary },
            { text: 'Cancel', style: 'cancel' }
          ]);
        } else if (data) {
          setTransferDetail(data);
        }
      })
    );
  }, [dispatch, transfers?.id]);

  useEffect(() => {
    fetchTransferSummary();
  }, [fetchTransferSummary]);

  const handleComplete = useCallback(() => {
    if (!transferDetail) {
      return;
    }

    setIsSubmitting(true);
    dispatch(
      completeStockTransfer(transferDetail, (data: any) => {
        setIsSubmitting(false);
        if (data?.error) {
          Alert.alert('Transfer Failed', data.errorMessage ?? 'Failed to complete transfer.', [
            { text: 'Retry', onPress: handleComplete },
            { text: 'Cancel', style: 'cancel' }
          ]);
        } else {
          ToastAndroid.show('Stock transferred successfully', ToastAndroid.SHORT);
          onCallBackHandler?.(data);
          navigation.goBack();
        }
      })
    );
  }, [transferDetail, dispatch, navigation, onCallBackHandler]);

  const items = transferDetail?.stockTransferItems ?? [];
  const canComplete = transferDetail && COMPLETABLE_STATUSES.includes(transferDetail.status);

  const renderItem = ({ item }: ListRenderItemInfo<any>) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <View style={styles.cardProductInfo}>
            <Text style={styles.cardProductCode}>{item?.product?.productCode}</Text>
            <Text style={styles.cardProductName} numberOfLines={2}>
              {item?.product?.name}
            </Text>
            {item.quantityOnHand !== null && (
              <Text style={styles.cardOnHand}>
                On Hand: <Text style={styles.cardOnHandValue}>{item.quantityOnHand}</Text>
              </Text>
            )}
          </View>
          <View style={styles.cardQuantityBlock}>
            <Text style={styles.cardQuantityValue}>{item.quantity}</Text>
            <Text style={styles.cardQuantityLabel}>TRANSFER QTY</Text>
          </View>
        </View>

        <View style={styles.binFlow}>
          <View style={styles.binBlock}>
            <Text style={styles.binLabel}>From</Text>
            <Text style={styles.binValue} numberOfLines={1}>
              {item?.originBinLocation?.name ?? EMPTY_FALLBACK}
            </Text>
          </View>
          <ArrowRight width={20} height={20} />
          <View style={styles.binBlock}>
            <Text style={styles.binLabel}>To</Text>
            <Text style={styles.binValue} numberOfLines={1}>
              {item?.destinationBinLocation?.name ?? EMPTY_FALLBACK}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <TransferDetailsSkeleton />;
  }

  if (!transferDetail) {
    return (
      <View style={styles.loadingContainer}>
        <EmptyView
          isRefresh
          title="Transfer Not Found"
          description="Could not load transfer details."
          onPress={fetchTransferSummary}
        />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText}>
            {transferDetail.stockTransferNumber}
          </Chip>
          <Chip style={styles.chipDefault} textStyle={styles.chipText}>
            {transferDetail.status}
          </Chip>
        </View>

        <Divider style={styles.contentDivider} />

        <Title style={styles.title}>{`Created on: ${transferDetail.dateCreated}`}</Title>
        <Caption>{`Description: ${transferDetail.description ?? EMPTY_FALLBACK}`}</Caption>

        <View style={styles.binFlow}>
          <View style={styles.binBlock}>
            <Text style={styles.binLabel}>Origin</Text>
            <Text style={styles.binValue} numberOfLines={1}>
              {transferDetail.origin?.name ?? EMPTY_FALLBACK}
            </Text>
          </View>
          <ArrowRight width={18} height={18} />
          <View style={styles.binBlock}>
            <Text style={styles.binLabel}>Destination</Text>
            <Text style={styles.binValue} numberOfLines={1}>
              {transferDetail.destination?.name ?? EMPTY_FALLBACK}
            </Text>
          </View>
        </View>
      </View>

      <Divider />

      <FlatList
        style={styles.contentContainer}
        data={items}
        keyExtractor={(item, index) => item?.id ?? String(index)}
        ListHeaderComponent={
          items.length > 0 ? (
            <Text style={styles.listSectionLabel}>{`Items To Transfer (${items.length})`}</Text>
          ) : null
        }
        ListEmptyComponent={<EmptyView title="No Items" description="There are no items in this transfer." />}
        renderItem={renderItem}
        contentContainerStyle={styles.itemListContainer}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTransferSummary} />}
      />

      {canComplete && (
        <View style={styles.bottom}>
          <Button
            title={isSubmitting ? 'Completing...' : 'Complete Transfer'}
            mode="contained"
            size="100%"
            disabled={items.length === 0 || isSubmitting}
            onPress={handleComplete}
          />
        </View>
      )}
    </View>
  );
}
