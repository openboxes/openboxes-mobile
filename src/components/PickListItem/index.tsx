import React, { useState } from 'react';
import styles from './styles';
import { Text, View, TouchableOpacity } from 'react-native';
import showPopup from '../../components/Popup';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import { colors } from '../../constants';
import { PicklistItem } from '../../data/picklist/PicklistItem';
import InputSpinner from '../../components/InputSpinner';
import { Card } from 'react-native-paper';
import SCAN from '../../assets/images/scan.jpg';
import TICK from '../../assets/images/tick.png';
import CLEAR from '../../assets/images/icon_clear.png';
import Radio from '../../components/Radio';
import DropDown from 'react-native-paper-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DetailsTable from '../DetailsTable';
import { Props } from './types';

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

  const isPropertyValid = (itemValue?: string, value?: string) => {
    if (!itemValue && !value) {
      return true;
    }

    return itemValue === value;
  };

  const getIcon = (value?: string, itemValue?: string) => {
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
      }\nPicker: ${item?.picker?.name ?? 'Unassigned'}`,
      positiveButton: { text: 'Ok' }
    });
  };

  return (
    <Card>
      <Card.Title
        title={<Text>Pick Task ({item?.indexString ?? ''}) </Text>}
        subtitle={<Text>{item?.pickTypeClassification ?? ''}</Text>}
        right={(props) => (
          <Text style={styles.status} {...props}>
            {item?.statusMessage ?? ''}
          </Text>
        )}
        style={styles.cardTitle}
        titleStyle={styles.cardTitleString}
      />
      <Card.Content>
        <View style={styles.inputContainer}>
          <DetailsTable
            style={styles.dataTable}
            columns={3}
            data={[
              { label: 'Product Code', value: item?.productCode },
              { label: 'Product Name', value: item?.['product.name'] },
              { label: 'Lot Number', value: item?.lotNumber, defaultValue: 'Default' }
            ]}
          />
          <View>
            <InputBox
              editable
              value={scannedLotNumber}
              placeholder={item.lotNumber || 'Lot Number'}
              label={item.lotNumber || 'Lot Number'}
              disabled={false}
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
                    item.lotNumber || 'DEFAULT (empty)'
                  }.\n\nTo validate lot number click on this field and scan lot number.`,
                  positiveButton: {
                    text: 'Ok'
                  }
                });
              }}
            />
          </View>
          <View>
            <DetailsTable
              style={styles.dataTable}
              columns={3}
              data={[
                { label: 'Location', value: item?.['binLocation.name'], defaultValue: 'Default' },
                { label: 'Type', value: item?.['binLocation.locationType'], defaultValue: 'None' },
                { label: 'Zone', value: item?.['binLocation.zoneName'], defaultValue: 'None' }
              ]}
            />
            <InputBox
              editable
              value={scannedBinLocation}
              placeholder={item['binLocation.locationNumber'] || 'Default'}
              label={item['binLocation.locationNumber'] || 'Bin Location'}
              disabled={false}
              icon={getIcon(scannedBinLocation, item['binLocation.locationNumber'])}
              onEndEdit={setScannedBinLocation}
              onChange={setScannedBinLocation}
              onIconClick={() => {
                if (scannedBinLocation && !isPropertyValid(scannedBinLocation, item['binLocation.locationNumber'])) {
                  setScannedBinLocation('');
                  return;
                }
                showPopup({
                  message: `Scan bin location. Expected: ${
                    item['binLocation.locationNumber'] || 'DEFAULT (empty)'
                  }.\n\nTo validate bin location click on this field and scan bin location.`,
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
                              color={colors.headerColor}
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
                      value: item?.picker?.name
                    }
              ]}
            />
            <View style={styles.inputSpinner}>
              <InputSpinner
                title={'Quantity to Pick'}
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
              disabled={!item?.quantityRemaining}
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
