import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, ToastAndroid } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import showPopup from '../../components/Popup';
import { getStockTransfersSummary, completeStockTransfer } from '../../redux/actions/transfers';
import EmptyView from '../../components/EmptyView';
import Button from '../../components/Button';
import { LayoutStyle } from '../../assets/styles';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import { ContentContainer, ContentFooter, ContentBody } from '../../components/ContentLayout';

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
              dispatch(completeStockTransfer(stockTransfer?.id, callback));
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
    dispatch(completeStockTransfer(stockTransfer?.id, callback));
  };

  const RenderTransferItem: React.FC = () => {
    const renderTransferItemData: LabeledDataType[] = [
      { label: 'Order Number', value: transferDetail?.stockTransferNumber },
      { label: 'Status', value: transferDetail?.status },
      { label: 'Origin', value: transferDetail?.['origin.name'] },
      { label: 'Destination', value: transferDetail?.['destination.name'] },
      { label: 'Description', value: transferDetail?.description },
      { label: 'Number of Items', value: transferDetail?.stockTransferItems?.length },
      { label: 'Created Date', value: transferDetail?.dateCreated }
    ];

    return (
      <Card style={LayoutStyle.listItemContainer}>
        <Card.Content>
          <DetailsTable data={renderTransferItemData} />
        </Card.Content>
      </Card>
    );
  };

  const renderListItem = (item: any) => {
    const renderListItemData: LabeledDataType[] = [
      { label: 'Product Code', value: item?.['product.productCode'] },
      { label: 'Product Name', value: item?.['product.name'] },
      { label: 'Origin Bin Location', value: item?.['originBinLocation.name'] },
      { label: 'Destination Bin Location', value: item?.['destinationBinLocation.name'] },
      { label: 'Quantity', value: item.quantity },
      { label: 'Quantity OnHand', value: item.quantityOnHand },
      { label: 'Status', value: item.status }
    ];

    return (
      <Card key={item?.['product.productCode']} style={LayoutStyle.listItemContainer}>
        <Card.Content>
          <DetailsTable data={renderListItemData} />
        </Card.Content>
      </Card>
    );
  };
  return (
    <ContentContainer>
      <ContentBody>
        <RenderTransferItem />
        {transferDetail?.stockTransferItems?.length > 0 && (
          <FlatList
            data={transferDetail?.stockTransferItems}
            horizontal={false}
            numColumns={1}
            ListEmptyComponent={<EmptyView title="Transfers" description="There are no items for Transfer" />}
            renderItem={(item: ListRenderItemInfo<any>) => renderListItem(item?.item)}
          />
        )}
      </ContentBody>
      <ContentFooter>
        <Button title="Complete Transfer" onPress={() => completeTransfers(transferDetail)} />
      </ContentFooter>
    </ContentContainer>
  );
};
export default TransferDetails;
