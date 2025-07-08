import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import CLEAR from '../../assets/images/icon_clear.png';
import SCAN from '../../assets/images/scan.jpg';
import TICK from '../../assets/images/tick.png';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import InputSpinner from '../../components/InputSpinner';
import showPopup from '../../components/Popup';
import Radio from '../../components/Radio';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import Theme from '../../utils/Theme';
import DetailsTable from '../DetailsTable';
import styles from './styles';
import { Props } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';

// TODO: Refactor (pull from api, when shortage reason codes will be available)
const SHORTAGE_REASON_CODES = [
  { value: 'INSUFFICIENT_QUANTITY_AVAILABLE', label: 'Insufficient quantity in location' },
  { value: 'DIFFERENT_LOCATION', label: 'Wrong item in location' },
  { value: 'DAMAGED', label: 'Damaged inventory in location' }
];

const PickListItem: React.FC<Props> = ({ item, onPickItem }) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [quantityToPick, setQuantityToPick] = useState<number>(item?.quantityToPick || 0);
  const [shortage, setShortage] = useState(item?.shortage || false);
  const [shortageReasonCode, setShortageReasonCode] = useState<string | undefined>(
    item.shortageReasonCode || undefined
  );
  const [scannedLotNumber, setScannedLotNumber] = useState<string>('');
  const [scannedBinLocation, setScannedBinLocation] = useState<string>('');
  const { productSummaryConfig } = useSelector((state: RootState) => state.settingsReducer);

  const isPropertyValid = (itemValue?: string, value?: string | null) => {
    if (!itemValue && !value) {
      return true;
    }

    return itemValue === value;
  };

  const getIcon = (value?: string, itemValue?: string | null) => {
    const isScannedPropertyValid = isPropertyValid(itemValue, value);

    if ((!itemValue && !value) || isScannedPropertyValid) {
      return TICK;
    }
    if (!value) {
      return SCAN;
    }
    return CLEAR;
  };

  const showShortageInfo = (item: PicklistItem) => {
    showPopup({
      title: 'Shortage Details',
      message: `Shortage Quantity: ${item?.quantityCanceled ?? 0}\nReason: ${
        item?.reasonCodeMessage ?? 'None'
      }\nPicker: ${item?.pickerName ?? 'Unassigned'}`,
      positiveButton: { text: 'Ok' }
    });
  };

  const showLotNumber = productSummaryConfig?.lotNumber !== false;
  const showLocationType = productSummaryConfig?.locationType !== false;

  const productColumns = [
    { label: 'Product Code', value: item?.productCode },
    { label: 'Product Name', value: item?.['product.name'] },
    showLotNumber ? { label: 'Lot Number', value: item?.lotNumber, defaultValue: 'Default' } : null
  ].filter(Boolean);

  const locationColumns = [
    { label: 'Location', value: item?.['binLocation.name'], defaultValue: 'Default' },
    showLocationType ? { label: 'Type', value: item?.['binLocation.locationType'], defaultValue: 'None' } : null,
    { label: 'Zone', value: item?.['binLocation.zoneName'], defaultValue: 'None' }
  ].filter(Boolean);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.inputContainer}>
          <DetailsTable style={styles.dataTable} columns={productColumns.length} data={productColumns} />
          {showLotNumber ? (
            <InputBox
              editable
              value={scannedLotNumber}
              placeholder={item.lotNumber || ''}
              label={'Lot Number'}
              disabled={!showLotNumber}
              icon={getIcon(scannedLotNumber, item.lotNumber)}
              onEndEdit={setScannedLotNumber}
              onChange={setScannedLotNumber}
              onIconClick={() => {
                if (scannedLotNumber && !isPropertyValid(scannedLotNumber, item.lotNumber)) {
                  setScannedLotNumber('');
                  return;
                }
                showPopup({
                  message: `Scan lot number. Expected: ${
                    item.lotNumber || ''
                  }.\n\nTo validate lot number click on this field and scan lot number.`,
                  positiveButton: {
                    text: 'Ok'
                  }
                });
              }}
            />
          ) : null}
          <View>
            <DetailsTable style={styles.dataTable} columns={locationColumns.length} data={locationColumns} />
            <InputBox
              editable
              value={scannedBinLocation}
              placeholder={item['binLocation.locationNumber'] || item['binLocation.name'] || ''}
              label={'Bin Location'}
              disabled={false}
              icon={getIcon(scannedBinLocation, item['binLocation.name'])}
              onEndEdit={setScannedBinLocation}
              onChange={setScannedBinLocation}
              onIconClick={() => {
                const expectedBinLocation = item['binLocation.locationNumber'] || item['binLocation.name'] || '';
                if (scannedBinLocation && !isPropertyValid(scannedBinLocation, expectedBinLocation)) {
                  setScannedBinLocation('');
                  return;
                }
                showPopup({
                  message: `Scan bin location. Expected: ${expectedBinLocation}.
                  \n\nTo validate bin location click on this field and scan bin location.`,
                  positiveButton: {
                    text: 'Ok'
                  }
                });
              }}
            />
            <DetailsTable
              style={styles.dataTable}
              columns={3}
              data={[
                { label: 'Picked', value: `${item?.quantityPicked} / ${item?.quantity}` },
                { label: 'Remaining', value: item?.quantityRemaining },
                shortage
                  ? {
                      label: 'Status',
                      value: (
                        <TouchableOpacity onPress={() => showShortageInfo(item)}>
                          <Text style={styles.value}>
                            <FontAwesome5
                              name="exclamation-triangle"
                              size={10}
                              color={Theme.colors.primary}
                              style={styles.infoButton}
                            />
                            &nbsp;Shortage
                          </Text>
                        </TouchableOpacity>
                      )
                    }
                  : {
                      label: 'Picked by',
                      defaultValue: 'Unassigned',
                      value: item?.pickerName
                    }
              ]}
            />
            <View style={styles.inputSpinner}>
              <InputSpinner
                title={'Quantity to Pick'}
                ratio={1.15}
                value={quantityToPick}
                setValue={(quantity: number) => {
                  setQuantityToPick(quantity);
                  if (quantity === item?.quantityRemaining) {
                    setShortage(false);
                    setShortageReasonCode('');
                  }
                }}
              />
            </View>
            {quantityToPick < item.quantityRemaining && (
              <Radio title={'Shortage (not enough quantity to pick)'} setChecked={setShortage} checked={shortage} />
            )}
            {quantityToPick < item.quantityRemaining && shortage && (
              <DropDown
                label="Shortage Reason Code"
                mode="outlined"
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                value={shortageReasonCode}
                setValue={setShortageReasonCode}
                list={SHORTAGE_REASON_CODES}
                onDismiss={() => setShowDropDown(false)}
              />
            )}
            <Button
              title="Pick Item"
              size="100%"
              disabled={!item?.quantityRemaining}
              style={styles.submitButton}
              onPress={() =>
                onPickItem({
                  ...item,
                  shortage,
                  quantityToPick,
                  shortageReasonCode,
                  scannedLotNumber,
                  scannedBinLocation
                })
              }
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default PickListItem;
