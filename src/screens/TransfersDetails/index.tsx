/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ListRenderItemInfo,
  ToastAndroid
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import { Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import showPopup from '../../components/Popup';
import {
  getStockTransfersSummary,
  postCompleteStockTransfer
} from '../../redux/actions/transfers';
import EmptyView from '../../components/EmptyView';
import Button from '../../components/Button';

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

  const completeTransfers = (item: any) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to Save' : null,
          message: data.errorMessage ?? 'Failed to Transfer details',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(postCompleteStockTransfer(item?.id, callback));
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
    dispatch(postCompleteStockTransfer(item?.id, callback));
  };

  const RenderData = ({ title, subText }: any): JSX.Element => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  const renderTransferItem = (): JSX.Element => {
    return (
      <View style={styles.itemView}>
        <Card>
          <Card.Content>
            <View style={styles.rowItem}>
              <RenderData
                title={'Order Number'}
                subText={transferDetail?.stockTransferNumber}
              />
              <RenderData title={'Status'} subText={transferDetail?.status} />
            </View>
            <View style={styles.rowItem}>
              <RenderData
                title={'Origin'}
                subText={transferDetail?.['origin.name']}
              />
              <RenderData
                title={'Destination'}
                subText={transferDetail?.['destination.name']}
              />
            </View>

            <View style={styles.rowItem}>
              <RenderData
                title={'Description'}
                subText={transferDetail?.description}
              />
              <RenderData
                title={'Number of Items'}
                subText={transferDetail?.stockTransferItems?.length}
              />
            </View>

            <View style={styles.rowItem}>
              <RenderData
                title={'Created Date'}
                subText={transferDetail?.dateCreated}
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderListItem = (item: any, index: any) => {
    return (
      <TouchableOpacity key={index} style={styles.itemView}>
        <Card>
          <Card.Content>
            <View style={styles.rowItem}>
              <RenderData
                title={'Product Code'}
                subText={item?.['product.productCode']}
              />
              <RenderData
                title={'Product Name'}
                subText={item?.['product.name']}
              />
            </View>
            <View style={styles.rowItem}>
              <RenderData
                title={'Origin Bin Location'}
                subText={item?.['originBinLocation.name']}
              />
              <RenderData
                title={'Destination Bin Location'}
                subText={item?.['destinationBinLocation.name']}
              />
            </View>
            <View style={styles.rowItem}>
              <RenderData title={'Quantity'} subText={item.quantity} />
              <RenderData
                title={'Quantity OnHand'}
                subText={item.quantityOnHand}
              />
            </View>

            <View style={styles.rowItem}>
              <RenderData title={'Status'} subText={item.status} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        {renderTransferItem()}

        {transferDetail?.stockTransferItems?.length > 0 ? (
          <FlatList
            data={transferDetail?.stockTransferItems}
            horizontal={false}
            numColumns={1}
            ListEmptyComponent={
              <EmptyView
                title="Transfers"
                description="There are no items for Transfer"
              />
            }
            renderItem={(item: ListRenderItemInfo<any>) =>
              renderListItem(item?.item, item.index)
            }
          />
        ) : null}
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          title="Complete Transfer"
          onPress={() => completeTransfers(transferDetail)}
        />
      </View>
    </View>
  );
};
export default TransferDetails;
