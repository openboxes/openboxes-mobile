import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, Text, ToastAndroid, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { LayoutStyle } from '../../assets/styles';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import showPopup from '../../components/Popup';
import { HYPHEN } from '../../constants';
import { completeStockTransfer, getStockTransfersSummary } from '../../redux/actions/transfers';
import Theme from '../../utils/Theme';
import styles from './styles';

const TransferDetails = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [transferDetail, setTransferDetails] = useState<any>({
    stockTransferItems: []
  });
  const { transfers }: any = route.params;

  useEffect(() => {
    getTransferSummary(transfers?.id);
  }, []);

  const getTransferSummary = (id: string) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Transfer Details' : null,
          message: data.errorMessage ?? `Failed to load Transfer details ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(getStockTransfersSummary(id, callback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          setTransferDetails(data);
        }
      }
    };
    dispatch(getStockTransfersSummary(id, callback));
  };

  const completeTransfers = (stockTransfer: any) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to Save' : null,
          message: data.errorMessage ?? 'Failed to Transfer details',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(completeStockTransfer(stockTransfer, callback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        ToastAndroid.show('Stock Transferred successfully', ToastAndroid.SHORT);
        navigation.goBack();
        route?.params?.onCallBackHandler(data);
      }
    };
    dispatch(completeStockTransfer(stockTransfer, callback));
  };

  const renderTransferDetails = (): Element => {
    return (
      <>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText}>
            {transferDetail?.stockTransferNumber}
          </Chip>
          <Chip style={styles.chipDefault} textStyle={styles.chipText}>
            {transferDetail?.status}
          </Chip>
        </View>
        <Divider style={{ marginVertical: Theme.spacing.medium }} />

        <Subheading style={styles.subheading}>{`Description: ${transferDetail?.description ?? HYPHEN}`}</Subheading>
        <Caption style={styles.caption}>{`Created on: ${transferDetail?.dateCreated}`}</Caption>

        <View style={styles.additionalInfoRow}>
          <Chip icon="truck" style={styles.chipDefault} textStyle={styles.chipText}>
            {transferDetail?.origin?.name}
          </Chip>
          <Chip icon="map-marker-check" style={styles.chipDefault} textStyle={styles.chipText}>
            {transferDetail?.destination?.name}
          </Chip>
        </View>
      </>
    );
  };

  const renderListItem = (item: any, index: any) => {
    return (
      <Card key={index} style={LayoutStyle.listItemContainer}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
              {item?.product?.productCode}
            </Chip>
            <Chip style={styles.chipDefault} textStyle={styles.chipText}>
              {item.status}
            </Chip>
          </View>
          <Divider style={styles.dividerHorizontal} />

          <Subheading style={styles.subheading}> {item?.product?.name} </Subheading>
          <View style={styles.additionalInfoRow}>
            <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Quantity: ${item.quantity}`}
            </Chip>
            <Chip icon="package-variant" style={styles.chipDefault} textStyle={styles.chipText}>
              {`On Hand: ${item.quantityOnHand}`}
            </Chip>
          </View>
          <Divider style={styles.dividerHorizontal} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.label}>Origin Bin Location</Text>
              <Text style={styles.value}>{item?.originBinLocation?.name ?? HYPHEN}</Text>
            </View>

            <View>
              <Text style={styles.label}>Destination Bin Location</Text>
              <Text style={styles.value}>{item?.destinationBinLocation?.name ?? HYPHEN}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailsContainer}>{renderTransferDetails()}</View>
      <Divider />

      {transferDetail?.stockTransferItems?.length > 0 ? (
        <FlatList
          data={transferDetail?.stockTransferItems}
          horizontal={false}
          numColumns={1}
          ListEmptyComponent={<EmptyView title="Transfers" description="There are no items for Transfer" />}
          renderItem={(item: ListRenderItemInfo<any>) => renderListItem(item?.item, item.index)}
        />
      ) : null}

      <Divider />
      <View style={styles.bottom}>
        <Button title="Complete Transfer" onPress={() => completeTransfers(transferDetail)} />
      </View>
    </View>
  );
};

export default TransferDetails;
