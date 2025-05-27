/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-sort-props */
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, ToastAndroid, View } from 'react-native';
import { Caption, Chip, Divider, Subheading } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import CLEAR from '../../assets/images/icon_clear.png';
import SCAN from '../../assets/images/scan.jpg';
import TICK from '../../assets/images/tick.png';
import Button from '../../components/Button';
import EditableModalSelect from '../../components/EditableModalSelect';
import InputSpinner from '../../components/InputSpinner';
import showPopup from '../../components/Popup';
import { HYPHEN } from '../../constants';
import { getAllContainers } from '../../redux/actions/lpn';
import { getShipment, submitShipmentDetails } from '../../redux/actions/packing';
import Theme from '../../utils/Theme';
import styles from './styles';

const ShipItemDetails = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { item }: any = route.params;
  const { section }: any = route.params;
  const [state, setState] = useState<any>({
    error: '',
    quantityPicked: 0,
    shipmentDetails: null,
    containerList: []
  });
  const [selectedContainerItem, setSelectedContainerItem] = useState<any>();

  useEffect(() => {
    getShipmentDetails(item.shipment.id);
    dispatch(
      getAllContainers((containers) => {
        setState((prev) => ({
          ...prev,
          containerList: containers.map((c) => ({ id: c.id, name: c.name }))
        }));
      })
    );
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
      (c) => c?.id === selectedContainerItem?.id || c?.name === selectedContainerItem?.id
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
          shipment: item.shipment,
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
    return _.find(containerList, (c) => c?.id === scannedContainerId || c?.name === scannedContainerId);
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
    <ScrollView>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Shipment Number: ${section?.shipmentNumber ?? HYPHEN}`}
          </Chip>
        </View>
        <Divider style={{ marginVertical: Theme.spacing.medium }} />

        <Subheading
          style={styles.subheading}
        >{`${item.inventoryItem.product.productCode} - ${item.inventoryItem.product.name}`}</Subheading>
        <Caption style={styles.caption}>{`Lot Number: ${item.inventoryItem.lotNumber ?? 'Default'}`}</Caption>

        <View style={styles.additionalInfoRow}>
          <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
            {`Quantity To Pack: ${item.quantity ?? HYPHEN}`}
          </Chip>
          <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipText}>{`Container: ${
            item?.container?.name ?? 'Default'
          }`}</Chip>
        </View>
      </View>
      <Divider />

      <View style={styles.formContainer}>
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
            onSelect={(selectedItem: any) => setSelectedContainerItem(selectedItem)}
          />
        </View>
        <InputSpinner title={'Quantity to Pick'} value={state.quantityPicked} setValue={quantityPickedChange} />
        <Button
          disabled={!(state.quantityPicked && state.quantityPicked > 0 && selectedContainerItem)}
          title="PACK ITEM"
          style={styles.button}
          size="100%"
          onPress={() => {
            submitShipmentDetail(item?.id);
          }}
        />
      </View>
    </ScrollView>
  );
};
export default ShipItemDetails;
