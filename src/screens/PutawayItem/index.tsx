/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, Text, ToastAndroid, View } from 'react-native';
import { Caption, Chip, Divider, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import AsyncModalSelect from '../../components/AsyncModalSelect';
import Button from '../../components/Button';
import InputSpinner from '../../components/InputSpinner';
import showPopup from '../../components/Popup';
import { searchInternalLocations } from '../../redux/actions/locations';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { createPutawayOderAction } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { DispatchProps, Props, State } from './types';

class PutawayItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { item } = this.props.route.params;

    const preferredBin = {
      id: item['preferredBin.id'],
      label: item['preferredBin.name']
    };

    this.state = {
      selectedLocation: preferredBin.id ? preferredBin : null,
      internalLocations: [],
      quantity: item ? item.quantity : 0
    };
  }

  getInternalLocations = (id: string = '') => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.message ? 'internal location details' : '',
          message: data.errorMessage ?? `Failed to load internal location value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.searchInternalLocations(
                '',
                {
                  'parentLocation.id': this.props.currentLocation.id,
                  locationTypeCode: 'BIN_LOCATION',
                  max: '25',
                  offset: '0'
                },
                callback
              );
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          this.setState({
            internalLocations: _.map(data.data, (internalLocation) => ({
              name: internalLocation.name,
              id: internalLocation.id
            }))
          });
        }
      }
    };
    this.props.searchInternalLocations(
      '',
      {
        'parentLocation.id': this.props.currentLocation.id,
        locationTypeCode: 'BIN_LOCATION',
        max: 25,
        offset: 0
      },
      callback
    );
  };

  UNSAFE_componentWillMount() {
    this.getInternalLocations(this.props.currentLocation);
  }

  create = () => {
    const { currentLocation, createPutawayOderAction } = this.props;
    const { item } = this.props.route.params;

    const data = {
      putawayNumber: '',
      putawayStatus: 'PENDING',
      putawayDate: '',
      putawayAssignee: '',
      origin: currentLocation?.id,
      destination: currentLocation?.id,
      putawayItems: [
        {
          putawayStatus: 'PENDING',
          product: item['product.id'],
          inventoryItem: item['inventoryItem.id'],
          putawayFacility: currentLocation?.id,
          currentLocation: item['currentLocation.id'],
          putawayLocation: this.state.selectedLocation?.id || '',
          quantity: this.state?.quantity
        }
      ],
      orderedBy: '',
      sortBy: null
    };

    createPutawayOderAction(data, ({ message, error, response }) => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      if (!error) {
        const putAway = response?.data;
        const putAwayItem = _.get(response, 'data.putawayItems[0]', {});
        this.props.navigation.navigate('PutawayItemDetail', {
          putAway,
          putAwayItem
        });
      }
    });
  };

  changeQuantity = (quantity: any) => {
    const { item } = this.props.route.params;
    if (quantity > item.quantity) {
      ToastAndroid.showWithGravity(
        'Quantity to put away can not be grater then received quantity',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
    if (quantity <= 0) {
      ToastAndroid.showWithGravity(
        'Quantity to put away can not be less than 1',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }

    this.setState({ quantity });
  };

  render() {
    const { item } = this.props.route.params;
    const { quantity, internalLocations, selectedLocation } = this.state;

    return (
      <ScrollView keyboardShouldPersistTaps style={{ width: '100%', height: '100%' }}>
        <View style={styles.container}>
          <View style={styles.dataContainer}>
            <View style={styles.headerRow}>
              <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipWarningText}>
                {item['stockMovement.id']}
              </Chip>
              <Chip icon="calendar" style={[styles.chipDefault, styles.lastChild]} textStyle={styles.chipWarningText}>
                {`Expiration Date: ${item?.['inventoryItem.expirationDate'] || 'Never'}`}
              </Chip>
            </View>
            <Divider style={styles.dividerHorizontal} />

            <Subheading style={{ fontWeight: 'bold' }}>
              {`${item?.['product.productCode']} - ${item?.['product.name']}`}
            </Subheading>
            <Caption> {`Lot Number: ${item['inventoryItem.lotNumber'] ?? 'Default'}`} </Caption>

            <View style={styles.rowItem}>
              <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipWarningText}>
                {`Current Location: ${item['currentLocation.name'] ?? 'Default'}`}
              </Chip>
              <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipWarningText}>
                {`Received Quantity: ${item.quantity.toString() ?? '0'}`}
              </Chip>
            </View>
          </View>
          <Divider />
          <View style={styles.formContainer}>
            <Text>Putaway Location</Text>
            <AsyncModalSelect
              placeholder="Default"
              label="Default"
              initValue={selectedLocation?.label || ''}
              initialData={internalLocations}
              searchAction={searchInternalLocations}
              searchActionParams={{
                'parentLocation.id': this.props.currentLocation.id
              }}
              onSelect={(selectedLocation: any) => this.setState({ selectedLocation })}
            />
            <View style={styles.inputSpinner}>
              <InputSpinner title="Quantity to Pick" value={quantity} setValue={this.changeQuantity} />
            </View>
            <Button
              disabled={quantity > item.quantity || Number(quantity) <= 0}
              title="Create Putaway"
              size="100%"
              onPress={this.create}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  binLocations: state.locationsReducer.binLocations,
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  searchInternalLocations,
  createPutawayOderAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayItem);
