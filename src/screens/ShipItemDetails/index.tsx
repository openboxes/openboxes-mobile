/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-sort-props */
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, ToastAndroid } from 'react-native';
import styles from './styles';
import Button from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import showPopup from '../../components/Popup';
import { getShipment, submitShipmentDetails } from '../../redux/actions/packing';
import InputSpinner from '../../components/InputSpinner';
import EditableModalSelect from '../../components/EditableModalSelect';
import CLEAR from '../../assets/images/icon_clear.png';
import SCAN from '../../assets/images/scan.jpg';
import TICK from '../../assets/images/tick.png';
import _ from 'lodash';

const ShipItemDetails = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { item }: any = route.params;
  const [state, setState] = useState<any>({
    error: '',
    quantityPicked: 0,
    shipmentDetails: null,
    containerList: []
  });
  const [selectedContainerItem, setSelectedContainerItem] = useState<any>();

  useEffect(() => {
    getShipmentDetails(item.shipment.shipmentNumber);
  }, []);
  const getShipmentDetails = (id: string) => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Shipment details' : 'Error',
          message: data.errorMessage ?? `Failed to load Shipment details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(getShipment(id, callback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          setState({
            quantityPicked: item.quantityRemaining || 0,
            shipmentDetails: data,
            containerList: data.availableContainers.map((dataItem: any) => ({
              name: dataItem.name,
              id: dataItem.id
            }))
          });
          setSelectedContainerItem({ id: item?.container?.id || null, name: item.container?.name || null });
        }
      }
    };
    dispatch(getShipment(id, callback));
  };

  const submitShipmentDetail = (id: string) => {
    if (Number(state.quantityPicked) > Number(item.quantityRemaining)) {
      showPopup({
        message: 'Quantity packed is higher than quantity on shipment item',
        positiveButton: {
          text: 'Ok'
        }
      });
      return;
    }

    if (selectedContainerItem?.id && !isContainerValid(selectedContainerItem?.id, state.containerList)) {
      showPopup({
        message: 'Scanned container is not valid. Please scan or select proper container.',
        positiveButton: {
          text: 'Ok'
        }
      });
      return;
    }

    // find proper container id in case it was scanned
    const container = _.find(
      state.containerList,
      c => c?.id === selectedContainerItem?.id || c?.name === selectedContainerItem?.id,
    );

    const request = {
      action: 'PACK',
      'container.id': container?.id ?? '',
      quantityToPack: state.quantityPicked
    };

    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Packing Error' : 'Error',
          message: data.errorMessage ?? 'Failed to pack item',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(submitShipmentDetails(id, request, callback));
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        ToastAndroid.showWithGravity(
          'Shipment Detail Submitted successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        navigation.navigate('OutboundStockDetails', {
          shipmentId: item.shipment.id,
          refetchShipment: true
        });
      }
    };
    dispatch(submitShipmentDetails(id, request, callback));
  };

  const isContainerValid = (scannedContainerId?: string, containerList?: Array<any>) => {
    if (!scannedContainerId && containerList?.length === 0) {
      return true;
    }

    // compare against id and name because when manually scanned there won't be id, but container number
    return _.find(containerList, c => c?.id === scannedContainerId || c?.name === scannedContainerId);
  };

  const getIcon = (scannedContainerId?: string, containerList?: Array<any>) => {
    const isScannedPropertyValid = isContainerValid(scannedContainerId, containerList);

    if ((!scannedContainerId && containerList?.length === 0) || isScannedPropertyValid) {
      return TICK;
    }
    if (!scannedContainerId) {
      return SCAN;
    }
    return CLEAR;
  };

  const quantityPickedChange = (query: string) => {
    setState({
      ...state,
      quantityPicked: query
    });
  };
  return (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.rowItem}>
        <View style={styles.columnItem}>
          <Text style={styles.label}>{'Container'}</Text>
          <Text style={styles.value}>{item?.container?.name ?? 'Default'}</Text>
        </View>
        <View style={styles.columnItem}>
          <Text style={styles.label}>{'Shipment Number'}</Text>
          <Text style={styles.value}>{item.shipment.shipmentNumber}</Text>
        </View>
      </View>
      <View style={styles.rowItem}>
        <View style={styles.columnItem}>
          <Text style={styles.label}>{'Product Code'}</Text>
          <Text style={styles.value}>{item.inventoryItem.product.productCode}</Text>
        </View>
        <View style={styles.columnItem}>
          <Text style={styles.label}>{'Product Name'}</Text>
          <Text style={styles.value}>{item.inventoryItem.product.name}</Text>
        </View>
      </View>
      <View style={styles.rowItem}>
        <View style={styles.columnItem}>
          <Text style={styles.label}>{'LOT Number'}</Text>
          <Text style={styles.value}>{item.inventoryItem.lotNumber ?? 'Default'}</Text>
        </View>
        <View style={styles.columnItem}>
          <Text style={styles.label}>{'Quantity to pack'}</Text>
          <Text style={styles.value}>{item.quantityRemaining}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{'Container'}</Text>
        <EditableModalSelect
          placeholder="Container"
          label="Container"
          initialData={state.containerList ?? []}
          helperIcon={getIcon(selectedContainerItem?.id, state.containerList)}
          onHelperIconClick={() => {
            if (selectedContainerItem?.id && !isContainerValid(selectedContainerItem?.id, state.containerList)) {
              setSelectedContainerItem({ id: null, name: null });
              return;
            }
            showPopup({
              message: `Scan a proper container.
                \n\nTo validate container click on this field and scan a container or use select (click on magnifying glass icon)`,
              positiveButton: {
                text: 'Ok'
              }
            });
          }}
          initValue={selectedContainerItem?.name || ''}
          searchAction={() => null}
          searchActionParams={{}}
          onSelect={(selectedItem: any, index: number) => setSelectedContainerItem(selectedItem)}
        />
      </View>
      <View style={styles.alignCenterContent}>
        <InputSpinner title={'Quantity to Pick'} value={state.quantityPicked} setValue={quantityPickedChange} />
      </View>
      <View style={styles.bottom}>
        <Button
          disabled={!(state.quantityPicked && state.quantityPicked > 0)}
          title="PACK ITEM"
          onPress={() => {
            submitShipmentDetail(item?.id);
          }}
        />
      </View>
    </ScrollView>
  );
};
export default ShipItemDetails;
