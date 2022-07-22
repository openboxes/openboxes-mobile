/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import showPopup from '../../components/Popup';
import { hideScreenLoading } from '../../redux/actions/main';
import { getInternalLocationDetail, getInternalLocationDetails } from '../../redux/actions/locations';
import { Card } from 'react-native-paper';
import { RootState } from '../../redux/reducers';
import Button from '../../components/Button';
import PrintModal from '../../components/PrintModal';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import { ContentContainer, ContentFooter, ContentBody, ContentHeader } from '../../components/ContentLayout';

const InternalLocationDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const location = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const [state, setState] = useState<any>({
    error: null,
    searchProductCode: null,
    locationData: null,
    visible: false,
    locationDetails: null
  });

  useEffect(() => {
    const { id }: any = route.params;
    onInternalLocation(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInternalLocation = (id: string) => {
    // handleBarcodeScan(barcodeNo);
    if (!id) {
      showPopup({
        message: 'Search id is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }
    const actionLocationCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? `Failed to load search results with value = "${id}"` : null,
          message: data.errorMessage ?? `Failed to load search results with value = "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(getInternalLocationDetails(id, location.id, actionLocationCallback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data.length === 0) {
          showPopup({
            message: `No search results found for Location name "${id}"`,
            positiveButton: { text: 'Ok' }
          });
        } else {
          if (data && Object.keys(data).length !== 0) {
            state.locationData = data.data;
            setState({ ...state });
          }
        }
        dispatch(hideScreenLoading());
      }
    };
    dispatch(getInternalLocationDetails(id, location.id, actionLocationCallback));
  };

  const navigateToDetails = (item: any) => {
    const stockItem = {
      product: {
        id: item['product.id'],
        productCode: item['product.productCode'],
        name: item['product.name']
      },
      inventoryItem: {
        id: item['inventoryItem.id'],
        lotNumber: item['inventoryItem.lotNumber'],
        expirationDate: item['inventoryItem.expirationDate']
      },
      binLocation: {
        id: item['binLocation.id'],
        name: item['binLocation.name'],
        locationNumber: item['binLocation.locationNumber']
      },
      quantityAvailableToPromise: item.quantityAvailable
    };
    navigation.navigate('AdjustStock', { item: stockItem });
  };

  const getLocationDetails = (id: string) => {
    if (!id) {
      showPopup({
        message: 'id is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? `Failed to load details with value = "${id}"` : null,
          message: data.errorMessage ?? `Failed to load details with value = "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(getInternalLocationDetail(id, actionCallback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        data.data.product = { id: data.data.id };
        setState({ ...state, locationDetails: data.data, visible: true });
      }
    };
    dispatch(getInternalLocationDetail(id, actionCallback));
  };

  const handleClick = () => {
    getLocationDetails(state.locationData?.name);
  };
  const closeModal = () => {
    setState({ ...state, visible: false });
  };

  const renderListItem = (item: any, index: any) => {
    const availableItemsData: LabeledDataType[] = [
      { label: 'Product Code', value: item['product.productCode'] },
      { label: 'Product Name', value: item['product.name'] },
      { label: 'Lot Number', value: item['inventoryItem.lotNumber'], defaultValue: 'Default' },
      { label: 'Lot Number', value: item['inventoryItem.expirationDate'], defaultValue: 'Never' },
      { label: 'Bin Location', value: item['binLocation.name'], defaultValue: 'Default' },
      { label: 'Quantity On Hand', value: item.quantityOnHand, defaultValue: '0' }
    ];

    return (
      <TouchableOpacity key={index} style={styles.itemView} onPress={() => navigateToDetails(item)}>
        <Card>
          <Card.Content>
            <DetailsTable data={availableItemsData} />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderData: LabeledDataType[] = [
    { label: 'Bin Location Name', value: state.locationData?.name, defaultValue: '' },
    { label: 'Location Type', value: state.locationData?.locationType.name, defaultValue: '' },
    { label: 'Facility Name', value: state.locationData?.parentLocation?.name, defaultValue: '' },
    { label: 'Zone Name', value: state.locationData?.zoneName, defaultValue: 'N/A' }
  ];

  return (
    <>
      {state.locationData && (
        <ContentContainer>
          <ContentHeader fixed>
            <Text style={styles.boxHeading}>Details</Text>
            <DetailsTable data={renderData} style={{ marginHorizontal: 10 }} />
            <Text style={styles.boxHeading}>Available Items ({state.locationData.availableItems.length ?? '0'})</Text>
          </ContentHeader>
          <ContentBody>
            {state.locationData?.availableItems?.map((item: any, index: any) => {
              return renderListItem(item, index);
            })}
          </ContentBody>
          <ContentFooter>
            <Button title={'Print Barcode Label'} onPress={handleClick} />
          </ContentFooter>
        </ContentContainer>
      )}
      <PrintModal
        visible={state.visible}
        closeModal={closeModal}
        type={'internalLocations'}
        product={state.locationDetails?.product}
        defaultBarcodeLabelUrl={state.locationDetails?.defaultBarcodeLabelUrl}
      />
    </>
  );
};

export default InternalLocationDetails;
