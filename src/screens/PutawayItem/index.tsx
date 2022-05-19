/* eslint-disable complexity */
/* eslint-disable no-shadow */
import _ from 'lodash';
import React, { Component } from 'react';
import { DispatchProps, Props, State } from './types';
import { View, Text, ToastAndroid, ScrollView } from 'react-native';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { connect } from 'react-redux';
import { searchInternalLocations } from '../../redux/actions/locations';
import { createPutawayOderAction } from '../../redux/actions/putaways';
import InputSpinner from '../../components/InputSpinner';
import InputBox from '../../components/InputBox';
import Button from '../../components/Button';
import showPopup from "../../components/Popup";
import AsyncModalSelect from "../../components/AsyncModalSelect";

class PutawayItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { item } = this.props.route.params;

    this.state = {
      selectedLocation: null,
      internalLocations: [],
      quantity: item ? item.quantity : 0
    };
  }

  getInternalLocations = (id: string = '') => {
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.message ? 'internal location details' : '',
          message:
            data.errorMessage ?? `Failed to load internal location value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.searchInternalLocations('', {
                'parentLocation.id': this.props.currentLocation.id,
                max: '10',
                offset: '0',
              }, callback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data && Object.keys(data).length !== 0) {
          this.setState({ internalLocations: _.map(data.data, internalLocation => ({
              name: internalLocation.name,
              id: internalLocation.id
            }))
          })
        }
      }
    };
    this.props.searchInternalLocations('', {
      'parentLocation.id': this.props.currentLocation.id,
      max: 10,
      offset: 0,
    }, callback);
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
      'origin.id': currentLocation?.id,
      'destination.id': currentLocation?.id,
      putawayItems: [
        {
          putawayStatus: 'PENDING',
          'product.id': item['product.id'],
          'inventoryItem.id': item['inventoryItem.id'],
          'putawayFacility.id': currentLocation?.id,
          'currentLocation.id': item['currentLocation.id'],
          'putawayLocation.id': this.state.selectedLocation?.id || item['putawayLocation.id'] || "",
          quantity: this.state?.quantity
        }
      ],
      'orderedBy.id': '',
      sortBy: null
    };
    createPutawayOderAction(data, ({ message, error }) => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      if (!error) {
        this.props.navigation.navigate('PutawayCandidates', {
          forceRefresh: true
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
      <ScrollView
        style={{width: '100%', height: '100%'}}
        keyboardShouldPersistTaps={true}
      >
        <View style={styles.container}>
          <View style={styles.childContainer}>
            <InputBox
              disabled
              label="Product Code"
              value={item['product.productCode']}
              editable={false}
            />
            <InputBox
              disabled
              label="Product Name"
              value={item['product.name']}
              editable={false}
            />
            <InputBox
              disabled
              label="Lot Number"
              value={item['inventoryItem.lotNumber'] ?? 'Default'}
              editable={false}
            />
            <InputBox
              disabled
              label="Current Location"
              value={item['currentLocation.name'] ?? 'Default'}
              editable={false}
            />
            <InputBox
              disabled
              label="Received Quantity"
              value={item['quantity'].toString() ?? '0'}
              editable={false}
            />

            <View style={styles.divider} />
            <View>
              <Text>Putaway Location</Text>
              <AsyncModalSelect
                placeholder="Default"
                label="Default"
                initValue={selectedLocation?.label || item['putawayLocation.name'] || ''}
                initialData={internalLocations}
                onSelect={(selectedLocation: any) => this.setState({ selectedLocation })}
                searchAction={searchInternalLocations}
                searchActionParams={{ 'parentLocation.id': this.props.currentLocation.id }}
              />
            </View>
            <View style={styles.inputSpinner}>
              <InputSpinner
                title="Quantity to Pick"
                value={quantity}
                setValue={this.changeQuantity}
              />
            </View>
          </View>
          <Button
            disabled={quantity > item.quantity || Number(quantity) <= 0}
            style={styles.submitButton}
            title="Create Putaway"
            onPress={this.create}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  binLocations: state.locationsReducer.binLocations,
  currentLocation: state.mainReducer.currentLocation,
});

const mapDispatchToProps: DispatchProps = {
  searchInternalLocations,
  createPutawayOderAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayItem);
