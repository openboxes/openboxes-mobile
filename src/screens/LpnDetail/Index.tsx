import React from 'react';
import { DispatchProps, Props } from './Types';
import { Container } from '../../data/container/Container';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  Image,
  TouchableOpacity,
  View
} from 'react-native';
import { ContainerShipmentItem } from '../../data/container/ContainerShipmentItem';
import {
  fetchContainer,
  getContainer,
  updateContainerStatus
} from '../../redux/actions/lpn';
import { getShipmentPacking } from '../../redux/actions/packing';
import { connect } from 'react-redux';
import styles from './styles';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import PrintModal from '../../components/PrintModal';
import EmptyView from '../../components/EmptyView';
import SelectDropdown from 'react-native-select-dropdown';

const containerStatuses = [
  'OPEN',
  'PACKING',
  'PACKED',
  'LOADED',
  'UNLOADED',
  'UNPACKING',
  'UNPACKED'
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
      containerDetails: null
    };
  }
  updateContainerStatus = (id: string, status: string) => {
    if (!id) {
      showPopup({
        message: 'Id of container is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage
            ? `Failed to update status of container with id: ${id} into ${status}`
            : null,
          message:
            data.errorMessage ?? `Failed to update status of container with id: ${id} into ${status}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.updateContainerStatus(id, status, actionCallback)
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        this.getContainerDetails(id, false)
      }
    };

    this.props.updateContainerStatus(id, status, actionCallback);
  };

  getContainerDetails = (id: string, openModal: boolean) => {
    if (!id) {
      showPopup({
        message: 'Id of container is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage
            ? `Failed to load details of container with id: "${id}"`
            : null,
          message:
            data.errorMessage ?? `Failed to load details of container with id: "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getContainer(id, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        const { id } = this.props.route.params;
        data.product = { id };
        this.setState({ containerDetails: data, visible: openModal });
      }
    };
    this.props.getContainer(id, actionCallback);
  };

  handleClick = () => {
    const { id } = this.props.route.params;
    this.getContainerDetails(id, true);
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  componentDidMount() {
    const { id } = this.props.route.params;
    this.fetchContainerDetail(id);
  }

  fetchContainerDetail = (id: string) => {
    const actionCallback = (data: any) => {
      const { shipmentNumber } = this.props.route.params;
      data.shipmentNumber = shipmentNumber;
      this.setState({
        container: data
      });
    };
    this.props.fetchContainer(id, actionCallback);
  };

  onTapped = (listRenderItemInfo: ListRenderItemInfo<ContainerShipmentItem>) => {
    this.props.navigation.navigate('ShipmentDetails', { item: listRenderItemInfo.item });
  };

  render() {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{this.state.container?.name}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Container Number</Text>
              <Text style={styles.value}>
                {this.state.container?.containerNumber}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Container Type</Text>
              <Text style={styles.value}>
                {this.state.container?.containerType?.name}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Number of Items</Text>
              <Text style={styles.value}>
                {this.state.container?.shipmentItems?.length}
              </Text>
            </View>
          </View>
          <View style={styles.row} />

          <Text style={styles.value}>{'Status'}</Text>
          <SelectDropdown
            data={containerStatuses}
            onSelect={(selectedItem, index) => {
              const { id } = this.props.route.params;
              this.updateContainerStatus(id, selectedItem);
            }}
            defaultValue={this.state.container?.containerStatus?.id}
            renderDropdownIcon={renderIcon}
            buttonStyle={styles.select}
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            rowTextForSelection={(item, index) => item}
          />
          <FlatList
            data={this.state.container?.shipmentItems}
            ListEmptyComponent={
              <EmptyView title="LPN Details" description="There are no items" isRefresh={false} />
            }
            renderItem={(
              shipmentItem: ListRenderItemInfo<ContainerShipmentItem>
            ) => (
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() => this.onTapped(shipmentItem)}
              >
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
                    <Text style={styles.label}>Shipment Number</Text>
                    <Text style={styles.value}>
                      {shipmentItem.item.shipment.shipmentNumber}
                    </Text>
                  </View>
                  <View style={styles.col50}>
                    <Text style={styles.label}>Quantity</Text>
                    <Text style={styles.value}>
                      {shipmentItem.item.quantity}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
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
        <PrintModal
          visible={this.state.visible}
          closeModal={this.closeModal}
          type={'containers'}
          product={this.state.containerDetails?.product}
          defaultBarcodeLabelUrl={
            this.state.containerDetails?.defaultBarcodeLabelUrl
          }
        />
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchContainer,
  getShipmentPacking,
  getContainer,
  updateContainerStatus
};

export default connect(null, mapDispatchToProps)(LpnDetail);
