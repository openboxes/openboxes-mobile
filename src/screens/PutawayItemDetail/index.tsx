import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import showPopup from '../../components/Popup';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputBox from '../../components/InputBox';
import { useDispatch } from 'react-redux';
import { submitPutawayItem } from '../../redux/actions/putaways';
import Button from '../../components/Button';
import DetailsTable from "../../components/DetailsTable";
import {Props as LabeledDataType} from "../../components/LabeledData/types";
import { ContentContainer, ContentBody, ContentFooter } from '../../components/ContentLayout';

const PutawayItemDetail = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [state, setState] = useState<any>({
    error: null,
    putAway: null,
    putAwayItem: null,
    scannedPutawayLocation: '',
  });
  const {putAway, putAwayItem}: any = route.params;

  useEffect(() => {
    setState({
      ...state,
      putAway: putAway,
      putAwayItem: putAwayItem,
    });
  }, []);

  const formSubmit = () => {
    let errorTitle = '';
    let errorMessage = '';
    if (errorTitle !== '') {
      showPopup({
        title: errorTitle,
        message: errorMessage,
        negativeButtonText: 'Cancel',
      });
      return Promise.resolve(null);
    }

    const requestBody = {
      id: state.putAway?.id,
      putawayNumber: state.putAway?.putawayNumber,
      putawayStatus: 'COMPLETED',
      putawayDate: state.putAway?.putawayDate ?? '',
      putawayAssignee: '',
      'origin.id': state.putAway?.['origin.id'],
      'destination.id': state.putAway?.['destination.id'],
      putawayItems: [
        {
          id: state.putAwayItem?.id,
          putawayStatus: 'COMPLETED',
          'currentFacility.id': state.putAwayItem?.['currentFacility.id'],
          'currentLocation.id': state.putAwayItem?.['currentLocation.id'],
          'product.id': state.putAwayItem?.['product.id'],
          'inventoryItem.id': state.putAwayItem?.['inventoryItem.id'],
          'putawayFacility.id': state.putAwayItem?.['putawayFacility.id'],
          'putawayLocation.id': state.putAwayItem?.['putawayLocation.id'] || "",
          quantity: state.putAwayItem?.quantity,
          scannedPutawayLocation: state.scannedPutawayLocation,
        },
      ],
      'orderedBy.id': '',
      sortBy: '',
    };

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to submit' : "Error",
          message: data.errorMessage ?? 'Failed to submit details',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              dispatch(
                submitPutawayItem(
                  state.putAwayItem?.id as string,
                  requestBody,
                  actionCallback,
                ),
              );
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        showPopup({
          title: ' Success',
          message: 'Putaway was successfully submited',
          positiveButton: {
            text: 'ok',
            callback: () => {
              navigation.navigate('Dashboard');
            },
          },
        });
      }
    };
    dispatch(
      submitPutawayItem(
        state.putAwayItem?.id as string,
        requestBody,
        actionCallback,
      ),
    );
  };

  const onChangeScannedPutawayLocation = (text: string) => {
    setState({...state, scannedPutawayLocation: text});
  };

  const detailsData: LabeledDataType[] = [
    { label: 'Putaway Identifier', value: state.putAway?.putawayNumber },
    { label: 'Quantity to Putaway', value: state.putAwayItem?.quantity.toString() },
    { label: 'Product Code', value: state.putAwayItem?.['product.productCode'] },
    { label: 'Product Name', value: state.putAwayItem?.['product.name'] },
    { label: 'Lot Number', value: state.putAwayItem?.['inventoryItem.lotNumber'], defaultValue: "Default" },
    { label: 'Expiry Date', value: state.putAwayItem?.['inventoryItem.expiryDate'], defaultValue: "Never" },
    { label: 'Current Location', value: state.putAwayItem?.['currentLocation.name'], defaultValue: "Default" },
    { label: 'Putaway Location', value: state.putAwayItem?.['putawayLocation.name'], defaultValue: "Default" },
  ];

  return (
    <ContentContainer>
      <ContentBody>
        <DetailsTable style={{ margin: 10 }} data={detailsData} />
        <InputBox
          label={'Scan Putaway Location'}
          value={state.scannedPutawayLocation}
          onChange={onChangeScannedPutawayLocation}
          editable={false}
          disabled={false}
        />
      </ContentBody>
        <ContentFooter>
          <Button
            title="Confirm Putaway"
            onPress={formSubmit}
            disabled={false}
          />
        </ContentFooter>
    </ContentContainer>
  );
};

export default PutawayItemDetail;
