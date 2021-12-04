/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import React, {Component} from 'react';
import {DispatchProps, Props, State} from './types';
import {
  TextInput,
  View,
  Text,
  Button,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {RootState} from '../../redux/reducers';
import styles from './styles';
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';
import {getBinLocationsAction} from '../../redux/actions/locations';
import {createPutawayOderAction} from '../../redux/actions/putaways';
import AutoInputBinLocation from '../../components/AutoInputBinLocation';

class PutawayItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedLocation: null,
      quantity: '1',
    };
  }

  UNSAFE_componentWillMount() {
    this.props.getBinLocationsAction();
  }

  create = () => {
    const {SelectedLocation, createPutawayOderAction} = this.props;
    const {item} = this.props.route.params;
    const {currentLocation} = this.props;
    const data = {
      putawayNumber: '',
      putawayStatus: 'PENDING',
      putawayDate: '',
      putawayAssignee: '',
      'origin.id': SelectedLocation?.id,
      // "origin.name": "Main Warehouse",
      'destination.id': SelectedLocation?.id,
      // "destination.name": "Main Warehouse",
      putawayItems: [
        {
          putawayStatus: 'PENDING',
          'product.id': item['product.id'],
          'inventoryItem.id': item['inventoryItem.id'],
          'putawayFacility.id': SelectedLocation?.id,
          'currentLocation.id': item['currentLocation.id'],
          'putawayLocation.id': this.state?.selectedLocation?.id,
          quantity: this.state?.quantity,
        },
      ],
      'orderedBy.id': '',
      sortBy: null,
    };
    createPutawayOderAction(data, () => {
      ToastAndroid.show('Order created successfully', ToastAndroid.SHORT);
      this.props.navigation.goBack();
      this.props.route.params.onRefresh();
    });
  };

  render() {
    const {item} = this.props.route.params;
    const {locations} = this.props;
    const {quantity} = this.state;
    return (
      <ScrollView
        style={{width: '100%', height: '100%'}}
        keyboardShouldPersistTaps={true}>
        <View style={styles.container}>
          <View style={styles.childContainer}>
            <View style={styles.row}>
              <Text>Product Code</Text>
              <TextInput value={item['product.productCode']} />
            </View>
            <View style={styles.row}>
              <Text>Product Name</Text>
              <TextInput value={item['product.name']} />
            </View>
            <View style={styles.row}>
              <Text>Lot Number</Text>
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                value={item['inventoryItem.lotNumber'] ?? 'Default'}
              />
            </View>
            <View style={styles.row}>
              <Text>Current Location</Text>
              <TextInput value={item['currentLocation.name'] ?? 'Default'} />
            </View>
            <View style={styles.row}>
              <Text>Putaway Location</Text>
              <AutoInputBinLocation
                label="AutoInputInternalContainer"
                data={locations.map(({name}) => name)}
                selectedData={(selectedLocation: any) => {
                  this.setState({selectedLocation});
                }}
              />
            </View>
            <View style={styles.row}>
              <Text>Quantity</Text>
              <View style={styles.quantityBox}>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="number-pad"
                  value={quantity}
                  onChangeText={changeQuantity => {
                    if (Number(changeQuantity) <= item.quantity) {
                      this.setState({quantity: changeQuantity});
                    } else {
                      ToastAndroid.show(
                        'quantity will be not grater then received quantity',
                        ToastAndroid.SHORT,
                      );
                    }
                  }}
                />
                <Text style={styles.quantityText}>{`/ ${item.quantity}`}</Text>
              </View>
            </View>
          </View>
          <Button
            style={{padding: 20}}
            title={'Create Putaway'}
            onPress={this.create}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  locations: state.locationsReducer.locations,
  currentLocation: state.mainReducer.currentLocation,
  SelectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
  getBinLocationsAction,
  createPutawayOderAction,
  showScreenLoading,
  hideScreenLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayItem);
