/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import useEventListener from '../../hooks/useEventListener';
import showPopup from '../../components/Popup';
import { hideScreenLoading } from '../../redux/actions/main';
import {
  getInternalLocationDetail,
  getInternalLocationDetails
} from '../../redux/actions/locations';
import { Card } from 'react-native-paper';
import { RootState } from '../../redux/reducers';
import Button from '../../components/Button';
import PrintModal from '../../components/PrintModal';

const InternalLocationDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const location = useSelector(
    (state: RootState) => state.mainReducer.currentLocation
  );
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
          title: data.errorMessage
            ? `Failed to load search results with value = "${id}"`
            : null,
          message:
            data.errorMessage ??
            `Failed to load search results with value = "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(
                getInternalLocationDetails(
                  id,
                  location.id,
                  actionLocationCallback
                )
              );
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
    dispatch(
      getInternalLocationDetails(id, location.id, actionLocationCallback)
    );
  };

  const RenderItem = ({ title, subTitle }: any) => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subTitle}</Text>
      </View>
    );
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
          title: data.errorMessage
            ? `Failed to load details with value = "${id}"`
            : null,
          message:
            data.errorMessage ?? `Failed to load details with value = "${id}"`,
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

  const renderListItem = (item: any, index: any) => (
    <TouchableOpacity
      key={index}
      style={styles.itemView}
      onPress={() => navigateToDetails(item)}
    >
      <Card>
        <Card.Content>
          <View style={styles.rowItem}>
            <RenderItem
              title={'Product Code'}
              subTitle={item['product.productCode']}
            />
            <RenderItem
              title={'Product Name'}
              subTitle={item['product.name']}
            />
          </View>
          <View style={styles.rowItem}>
            <RenderItem
              title={'Lot Number'}
              subTitle={item['inventoryItem.lotNumber'] ?? 'Default'}
            />
            <RenderItem
              title={'Lot Number'}
              subTitle={item['inventoryItem.expirationDate'] ?? 'Never'}
            />
          </View>
          <View style={styles.rowItem}>
            <RenderItem
              title={'Bin Location'}
              subTitle={item['binLocation.name'] ?? 'Default'}
            />
            <RenderItem
              title={'Quantity On Hand'}
              subTitle={item.quantityOnHand ?? 0}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
  return (
    <View style={styles.screenContainer}>
      {state.locationData && (
        <View>
          <Text style={styles.boxHeading}>Details</Text>
          <View style={styles.rowItem}>
            <RenderItem
              title={'Bin Location Name'}
              subTitle={state.locationData?.name ?? ''}
            />
            <RenderItem
              title={'Location Type'}
              subTitle={state.locationData?.locationType.name ?? ''}
            />
          </View>
          <View style={styles.rowItem}>
            <RenderItem
              title={'Facility Name'}
              subTitle={state.locationData?.parentLocation?.name ?? ''}
            />
            <RenderItem
              title={'Zone Name'}
              subTitle={state.locationData?.zoneName ?? 'N/A'}
            />
          </View>
          <Text style={styles.boxHeading}>
            Available Items ({state.locationData.availableItems.length ?? '0'})
          </Text>
          {state.locationData?.availableItems?.map((item: any, index: any) => {
            return renderListItem(item, index);
          })}
          <View style={styles.bottom}>
            <Button title={'Print Barcode Label'} onPress={handleClick} />
          </View>
        </View>
      )}
      <PrintModal
        visible={state.visible}
        closeModal={closeModal}
        type={'internalLocations'}
        product={state.locationDetails?.product}
        defaultBarcodeLabelUrl={state.locationDetails?.defaultBarcodeLabelUrl}
      />
    </View>
  );
};

export default InternalLocationDetails;
