import React from 'react';
import {DispatchProps, Props} from './Types';
import {Container} from '../../data/container/Container';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {ContainerShipmentItem} from '../../data/container/ContainerShipmentItem';
import {
  fetchContainer,
  getContainer,
  getContainerStatus,
} from '../../redux/actions/lpn';
import {getShipmentPacking} from '../../redux/actions/packing';
import {connect} from 'react-redux';
import styles from './styles';
import Button from '../../components/Button';
import PrintModal from '../../components/PrintModal';
import showPopup from '../../components/Popup';

import SelectDropdown from 'react-native-select-dropdown';
const containerStatus = [
  'PACKING',
  'PACKED',
  'LOADED',
  'UNLOADED',
  'UNPACKING',
  'UNPACKED',
];
const renderIcon = () => {
  return (
    <Image
      style={styles.arrowDownIcon}
      source={require('../../assets/images/arrow-down.png')}
    />
  );
};

export interface State {
  container: Container | null;
  visible: boolean;
  containerDetails: any;
}

class LpnDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      container: null,
      visible: false,
      containerDetails: null,
    };
  }
  getContainerStatusDetails = (id: string) => {
    if (!id) {
      showPopup({
        message: 'id is empty',
        positiveButton: {text: 'Ok'},
      });
      return;
    }
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.error.message
            ? `Failed to load details with value = "${id}"`
            : null,
          message:
            data.error.message ?? `Failed to load details with value = "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getContainerStatus(id, actionCallback);
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        this.showShipmentReadyToPackScreen(data['shipment.id']);
      }
    };
    this.props.getContainerStatus(id, actionCallback);
  };

  showShipmentReadyToPackScreen = (id: string) => {
    this.props.navigation.navigate('OutboundStockDetails', {shipmentId: id});
  };

  getContainerDetails = (id: string) => {
    if (!id) {
      showPopup({
        message: 'id is empty',
        positiveButton: {text: 'Ok'},
      });
      return;
    }

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage
            ? `Failed to load details with value = "${id}"`
            : null,
          message:
            data.errorMessage ?? `Failed to load details with value = "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getContainer(id, actionCallback);
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        const {id} = this.props.route.params;
        data.product = {id};
        this.setState({containerDetails: data, visible: true});
      }
    };
    this.props.getContainer(id, actionCallback);
  };
  handleClick = () => {
    const {id} = this.props.route.params;
    this.getContainerDetails(id);
  };
  closeModal = () => {
    this.setState({visible: false});
  };

  componentDidMount() {
    const {id} = this.props.route.params;
    this.fetchContainerDetail(id);
  }

  fetchContainerDetail = (id: string) => {
    const actionCallback = (data: any) => {
      const {shipmentNumber} = this.props.route.params;
      data.shipmentNumber = shipmentNumber;
      this.setState({
        container: data,
      });
    };
    this.props.fetchContainer(id, actionCallback);
  };

  onTapped = (shipmentItem: ListRenderItemInfo<ContainerShipmentItem>) => {
    this.props.navigation.navigate('Packing', {shipment: shipmentItem});
  };

  render() {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Shipment Number</Text>
              <Text style={styles.value}>
                {this.state.container?.shipmentNumber}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{this.state.container?.name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Container Number</Text>
              <Text style={styles.value}>
                {this.state.container?.containerNumber}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Container Type</Text>
              <Text style={styles.value}>
                {this.state.container?.containerType?.name}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Number of Items</Text>
              <Text style={styles.value}>
                {this.state.container?.shipmentItems?.length}
              </Text>
            </View>
          </View>

          <Text style={styles.value}>{'Status'}</Text>
          <SelectDropdown
            data={containerStatus}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              const {id} = this.props.route.params;
              this.getContainerStatusDetails(id);
            }}
            defaultValueByIndex={0}
            renderDropdownIcon={renderIcon}
            buttonStyle={styles.select}
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            rowTextForSelection={(item, index) => item}
          />
          <FlatList
            data={this.state.container?.shipmentItems}
            renderItem={(
              shipmentItem: ListRenderItemInfo<ContainerShipmentItem>,
            ) => (
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() => this.onTapped(shipmentItem)}>
                <View style={styles.row}>
                  <View style={styles.col50}>
                    <Text style={styles.label}>Product Code</Text>
                    <Text style={styles.value}>
                      {shipmentItem.item?.inventoryItem?.product?.productCode}
                    </Text>
                  </View>
                  <View style={styles.col50}>
                    <Text style={styles.label}>Product</Text>
                    <Text style={styles.value}>
                      {shipmentItem.item?.inventoryItem?.product?.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col50}>
                    <Text style={styles.label}>Quantity</Text>
                    <Text style={styles.value}>
                      {shipmentItem.item.quantity}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            style={styles.list}
          />
          <View style={styles.bottom}>
            <Button
              title={'Print Barcode Label'}
              onPress={this.handleClick}
              disabled={false}
            />
          </View>
        </View>
        <Text style={styles.value}>{'Status'}</Text>
        <SelectDropdown
          data={containerStatus}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            const {id} = this.props.route.params;
            this.getContainerStatusDetails(id);
          }}
          defaultValueByIndex={0}
          renderDropdownIcon={renderIcon}
          buttonStyle={styles.select}
          buttonTextAfterSelection={(selectedItem, index) => selectedItem}
          rowTextForSelection={(item, index) => item}
        />
        <FlatList
          data={this.state.container?.shipmentItems}
          renderItem={(
            shipmentItem: ListRenderItemInfo<ContainerShipmentItem>,
          ) => (
            <TouchableOpacity
              style={styles.listItemContainer}
              onPress={() => this.onTapped(shipmentItem)}>
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Product Code</Text>
                  <Text style={styles.value}>
                    {shipmentItem.item?.inventoryItem?.product?.productCode}
                  </Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Product</Text>
                  <Text style={styles.value}>
                    {shipmentItem.item?.inventoryItem?.product?.name}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Quantity</Text>
                  <Text style={styles.value}>{shipmentItem.item.quantity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchContainer,
  getShipmentPacking,
  getContainer,
  getContainerStatus,
};

export default connect(null, mapDispatchToProps)(LpnDetail);
