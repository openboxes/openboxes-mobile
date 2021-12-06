/* eslint-disable no-shadow */
import React, {Component} from 'react';
import {DispatchProps, Props, State} from './types';
import {
  View,
  Text,
  ToastAndroid,
} from 'react-native';
import {RootState} from '../../redux/reducers';
import styles from './styles';
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';
import {getBinLocationsAction} from '../../redux/actions/locations';
import {createPutawayOderAction} from '../../redux/actions/putaways';
import AutoInputBinLocation from '../../components/AutoInputBinLocation';
import InputSpinner from '../../components/InputSpinner'
import InputBox from '../../components/InputBox';
import Button from "../../components/Button"

class PutawayItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { item } = this.props.route.params;

    this.state = {
      selectedLocation: null,
      quantity: item ? item.quantity : 0,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.getBinLocationsAction();
  }

  create = () => {
    const { selectedLocation, createPutawayOderAction } = this.props;
    const { item } = this.props.route.params;
    const { currentLocation } = this.props;
    const data = {
      putawayNumber: '',
      putawayStatus: 'PENDING',
      putawayDate: '',
      putawayAssignee: '',
      'origin.id': selectedLocation?.id,
      'destination.id': selectedLocation?.id,
      putawayItems: [
        {
          putawayStatus: 'PENDING',
          'product.id': item['product.id'],
          'inventoryItem.id': item['inventoryItem.id'],
          'putawayFacility.id': selectedLocation?.id,
          'currentLocation.id': item['currentLocation.id'],
          'putawayLocation.id': this.state?.selectedLocation?.id,
          quantity: this.state?.quantity,
        },
      ],
      'orderedBy.id': '',
      sortBy: null,
    };

    createPutawayOderAction(data, ({ message, error }) => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      if (!error) {
        this.props.navigation.navigate('PutawayCandidates', { forceRefresh: true });
      }
    });
  };

  changeQuantity = quantity => {
    const { item } = this.props.route.params;
    if (quantity > item.quantity) {
      ToastAndroid.showWithGravity(
        'Quantity to put away can not be grater then received quantity',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }

    this.setState({ quantity });
  };

  render() {
    const { item } = this.props.route.params;
    const { locations } = this.props;
    const { quantity } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.childContainer}>
          <InputBox
            label="Product Code"
            value={item['product.productCode']}
            disabled={true}
            editable={false}
          />
          <InputBox
            label="Product Name"
            value={item['product.name']}
            disabled={true}
            editable={false}
          />
          <InputBox
            label="Lot Number"
            value={item['inventoryItem.lotNumber'] ?? 'Default'}
            disabled={true}
            editable={false}
          />
          <InputBox
            label="Current Location"
            value={item['currentLocation.name'] ?? 'Default'}
            disabled={true}
            editable={false}
          />
          <InputBox
            label="Received Quantity"
            value={item['quantity'].toString() ?? '0'}
            disabled={true}
            editable={false}
          />

          <View style={styles.divider} />

          <View>
            <Text>Putaway Location</Text>
            <AutoInputBinLocation
                placeholder="Default"
                data={locations.map(({name}) => name)}
                selectedData={(selectedLocation: any) => {
              this.setState({selectedLocation});
            }}
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
          disabled={quantity > item.quantity}
          style={styles.submitButton}
          title="Create Putaway"
          onPress={this.create}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  locations: state.locationsReducer.locations,
  currentLocation: state.mainReducer.currentLocation,
  selectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
  getBinLocationsAction,
  createPutawayOderAction,
  showScreenLoading,
  hideScreenLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayItem);
