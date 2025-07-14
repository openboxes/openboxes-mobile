/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Caption, Chip, Divider, Subheading, Text } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';

import CLEAR from '../../assets/images/icon_clear.png';
import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import InputSpinner from '../../components/InputSpinner';
import showPopup from '../../components/Popup';
import Radio from '../../components/Radio';
import ShipmentItems from '../../data/inbound/ShipmentItems';
import Location from '../../data/location/Location';
import { createReceivingBin, submitPartialReceiving } from '../../redux/actions/inboundorder';
import { searchInternalLocations } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import styles from './styles';

type ShipmentData = {
  id: string;
  shipmentNumber?: string;
  expectedDeliveryDate?: string;
  name?: string;
};

const renderIcon = () => <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')} />;

const InboundReceiveDetail: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { shipmentItem, shipmentData, shipmentId } = route.params as {
    shipmentItem: ShipmentItems;
    shipmentData: ShipmentData;
    shipmentId: string;
  };

  const currentLocation = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

  const [quantity, setQuantity] = useState<number>(shipmentItem.quantityRemaining);
  const [cancelRemaining, setCancelRemaining] = useState(false);
  const [receiveLocation, setReceiveLocation] = useState<Pick<Location, 'id' | 'name'>>({
    id: shipmentItem['binLocation.id'],
    name: shipmentItem['binLocation.name']
  });
  const [internalLocations, setInternalLocations] = useState<Pick<Location, 'id' | 'name'>[]>([]);
  const [lotNumber, setLotNumber] = useState<string>(shipmentItem.lotNumber ?? '');
  const [expirationDate, setExpirationDate] = useState<string | undefined>(shipmentItem.expirationDate);
  const [comments, setComments] = useState<string>('');
  const [lotStatus, setLotStatus] = useState<string>('');

  const lotStatusOptions = useMemo(
    () => ['Select lot status', 'APPROVED', 'RECALLED', 'ON_HOLD', 'QUARANTINED', 'EXPIRED', 'RESERVED', 'DAMAGED'],
    []
  );

  useEffect(() => {
    dispatch(
      searchInternalLocations(
        '',
        {
          'parentLocation.id': currentLocation.id,
          max: '25',
          offset: '0'
        },
        (data: any) => {
          if (data?.error) {
            showPopup({
              title: 'Internal location error',
              message: data.errorMessage || 'Failed to load internal locations'
            });
            return;
          }
          const locs: Location[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.name
          }));
          setInternalLocations(locs);
          const found = locs.find((l) => l.id === receiveLocation.id);
          if (found) {
            setReceiveLocation(found);
          }
        }
      )
    );
  }, [currentLocation.id, dispatch, receiveLocation.id]);

  useEffect(() => {
    dispatch(
      createReceivingBin(shipmentData.id, (data: any) => {
        if (!data?.error && data.data?.id) {
          const bin: Pick<Location, 'id' | 'name'> = {
            id: data.data.id,
            name: data.data.name
          };
          setInternalLocations((prev) => (prev.some((l) => l.id === bin.id) ? prev : [...prev, bin]));
          setReceiveLocation(bin);
        }
      })
    );
  }, [dispatch, shipmentData.id]);

  const createPendingReceivingPayload = useCallback(
    () => ({
      receiptId: '',
      receiptStatus: 'PENDING',
      shipmentId,
      containers: [
        {
          'container.id': shipmentItem['container.id'] ?? '',
          shipmentItems: [
            {
              receiptItemId: '',
              shipmentItemId: shipmentItem.shipmentItemId,
              product: {
                id: shipmentItem['product.id'] ?? ''
              },
              binLocation: receiveLocation.id,
              lotNumber,
              expirationDate,
              recipient: '',
              quantityReceiving: quantity,
              cancelRemaining,
              quantityOnHand: '',
              comment: comments,
              mobile: true,
              lotStatusCode: lotStatus
            }
          ]
        }
      ]
    }),
    [
      shipmentId,
      shipmentItem,
      receiveLocation.id,
      lotNumber,
      expirationDate,
      comments,
      lotStatus,
      quantity,
      cancelRemaining
    ]
  );

  const createCompleteReceivingPayload = useCallback(
    (responseData: any) => ({
      isShipmentFromPurchaseOrder: responseData.isShipmentFromPurchaseOrder,
      receiptStatus: 'COMPLETED',
      containers: responseData.containers,
      dateShipped: responseData.dateShipped,
      description: responseData.description,
      destination: {
        id: responseData['destination.id']
      },
      origin: {
        id: responseData['origin.id']
      },
      receiptId: responseData.receiptId,
      shipmentStatus: responseData.shipmentStatus,
      shipment: {
        name: responseData['shipment.name'],
        shipmentNumber: responseData['shipment.shipmentNumber']
      },
      requisition: responseData.requisition,
      recipient: responseData.recipient.id
    }),
    []
  );

  const onReceive = useCallback(() => {
    if (quantity <= 0 && !cancelRemaining) {
      showPopup({
        title: 'Quantity to receive is 0',
        message: 'You cannot receive 0 without cancelling remaining'
      });
      return;
    }
    if (quantity > shipmentItem.quantityRemaining) {
      showPopup({
        title: 'Quantity!',
        message: 'You cannot receive more than the remaining quantity'
      });
      return;
    }
    if (expirationDate && !lotNumber) {
      showPopup({
        title: 'Expiration date without Lot',
        message: 'Please fill the Lot Number if you want to set the Expiration Date'
      });
      return;
    }

    const partialReceivingPayload = createPendingReceivingPayload();

    dispatch(
      submitPartialReceiving(shipmentId, partialReceivingPayload, (response: any) => {
        if (response?.error) {
          showPopup({
            title: 'Receive error',
            message: response.errorMessage
          });
          return;
        }

        const responseData = response?.data;

        if (!responseData) {
          showPopup({
            title: 'Receive error',
            message: 'No data received from the server'
          });
          return;
        }

        const completeReceivingPayload = createCompleteReceivingPayload(responseData);

        dispatch(
          submitPartialReceiving(shipmentId, completeReceivingPayload, (res: any) => {
            if (!res?.error) {
              navigation.goBack();
            }
          })
        );
      })
    );
  }, [
    cancelRemaining,
    comments,
    dispatch,
    expirationDate,
    lotNumber,
    lotStatus,
    navigation,
    quantity,
    receiveLocation.id,
    shipmentId,
    shipmentItem
  ]);

  const onClearDate = useCallback(() => {
    setExpirationDate(undefined);
  }, []);

  const showLotNumber = useMemo(() => productSummaryConfig?.lotNumber !== false, [productSummaryConfig]);
  const showExpirationDate = useMemo(() => productSummaryConfig?.expirationDate !== false, [productSummaryConfig]);

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.inboundDetailsContainer}>
        <View style={styles.headerRow}>
          <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipWarningText}>
            {shipmentItem['product.productCode']}
          </Chip>
          {showExpirationDate && (
            <Chip icon="calendar" style={[styles.chipDefault, styles.lastChild]} textStyle={styles.chipWarningText}>
              {`Expiration Date: ${shipmentItem.expirationDate || 'Never'}`}
            </Chip>
          )}
        </View>
        <Divider style={styles.dividerHorizontal} />

        <Subheading style={{ fontWeight: 'bold' }}>{shipmentItem['product.name']}</Subheading>
        <Caption>{shipmentData.name}</Caption>
        <Divider style={styles.dividerHorizontal} />

        <View style={styles.additionalInfoRow}>
          <View style={styles.columnItem}>
            <Text style={styles.label}>{'Shipment Number'}</Text>
            <Text style={styles.value}>{shipmentData?.shipmentNumber || ''}</Text>
          </View>
          {showLotNumber && (
            <View style={styles.columnItem}>
              <Text style={styles.label}>{'Lot / Serial Number'}</Text>
              <Text style={styles.value}>{shipmentItem?.lotNumber || 'Default'}</Text>
            </View>
          )}
        </View>
        <Divider style={styles.dividerHorizontal} />

        <View style={styles.rowItem}>
          <Chip icon="truck" style={{ ...styles.chipDefault, flex: 1 }} textStyle={styles.chipWarningText}>
            {`Shipped: ${shipmentItem.quantityShipped}`}
          </Chip>
          <Chip
            icon="database"
            style={{
              ...styles.chipDefault,
              ...styles.lastChild,
              flex: 1
            }}
            textStyle={styles.chipWarningText}
          >
            {`Remaining: ${shipmentItem.quantityRemaining > 0 ? shipmentItem.quantityRemaining : 0}`}
          </Chip>
        </View>

        <View style={styles.rowItem}>
          <Chip
            icon="thumb-up"
            style={{
              ...styles.chipDefault,
              ...styles.lastChild,
              flex: 1,
              marginTop: Theme.spacing.small
            }}
            textStyle={styles.chipWarningText}
          >
            {`Received: ${shipmentItem.quantityReceived}`}
          </Chip>
        </View>
      </View>
      <Divider />
      <View style={styles.container}>
        <View style={styles.from}>
          <View style={styles.itemView}>
            <InputSpinner title="Quantity to Receive" value={quantity} setValue={setQuantity} />
          </View>
          <Radio
            title="Cancel remaining quantity"
            checked={cancelRemaining}
            setChecked={setCancelRemaining}
            disabled={quantity >= shipmentItem.quantityRemaining}
          />

          <AsyncModalSelect
            key={receiveLocation.id}
            placeholder="Receiving Location"
            label="Receiving Location"
            initValue={receiveLocation.name}
            initialData={internalLocations}
            searchAction={searchInternalLocations}
            searchActionParams={{
              'parentLocation.id': currentLocation.id
            }}
            onSelect={(loc: Location) => setReceiveLocation(loc)}
          />

          {showLotNumber ? (
            <InputBox
              value={lotNumber}
              editable={true}
              label="Lot Number"
              onChange={setLotNumber}
              style={{ marginBottom: Theme.spacing.small }}
            />
          ) : null}

          <SelectDropdown
            renderDropdownIcon={renderIcon}
            data={lotStatusOptions}
            defaultValue={lotStatusOptions[0]}
            buttonTextStyle={styles.lotStatusSelectTextStyle}
            buttonStyle={styles.lotStatusSelectStyle}
            rowTextForSelection={(item) => item}
            buttonTextAfterSelection={(item) => item}
            onSelect={(s) => setLotStatus(s === lotStatusOptions[0] ? '' : s)}
          />

          <View style={styles.datePickerContainer}>
            <DatePicker
              style={styles.datePicker}
              date={expirationDate}
              mode="date"
              placeholder="Expiration Date"
              format="MM/DD/YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={styles.datePickerCustomStyle}
              onDateChange={setExpirationDate}
            />

            {expirationDate && (
              <TouchableOpacity onPress={onClearDate}>
                <Image source={CLEAR} style={styles.imageIcon} />
              </TouchableOpacity>
            )}
          </View>
          <InputBox value={comments} editable={true} label="Comments" onChange={setComments} />
        </View>
      </View>
      <Divider />
      <View style={styles.bottom}>
        <Button size="100%" title="Receive" disabled={false} onPress={onReceive} />
      </View>
    </ScrollView>
  );
};

export default InboundReceiveDetail;
