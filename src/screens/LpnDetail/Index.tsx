import React from 'react';
import { FlatList, Image, ListRenderItemInfo, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import showPopup from '../../components/Popup';
import PrintModal from '../../components/PrintModal';
import { HYPHEN } from '../../constants';
import { Container } from '../../data/container/Container';
import { ContainerShipmentItem } from '../../data/container/ContainerShipmentItem';
import { fetchContainer, getContainer, updateContainerStatus } from '../../redux/actions/lpn';
import styles from './styles';
import { DispatchProps, Props } from './Types';

const containerStatuses = ['OPEN', 'PACKING', 'PACKED', 'LOADING', 'LOADED', 'MISSING'];

const renderIcon = () => {
  return <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')} />;
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
          title: data.errorMessage ? `Failed to update status of container with id: ${id} into ${status}` : null,
          message: data.errorMessage ?? `Failed to update status of container with id: ${id} into ${status}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.updateContainerStatus(id, { status }, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        this.getContainerDetails(id, false);
      }
    };

    this.props.updateContainerStatus(id, { status }, actionCallback);
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
          title: data.errorMessage ? `Failed to load details of container with id: "${id}"` : null,
          message: data.errorMessage ?? `Failed to load details of container with id: "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getContainer(id, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        const { id, shipmentId } = this.props.route.params;
        data.product = { id };
        this.setState({ containerDetails: data, visible: openModal });
        this.props.navigation.navigate('OutboundStockDetails', {
          refetchShipment: true,
          shipmentId: shipmentId
        });
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
      <ScrollView style={styles.contentContainer}>
        <View style={styles.lpnDetailsContainer}>
          <View style={styles.headerRow}>
            <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Container Number: ${this.state.container?.containerNumber || HYPHEN}`}
            </Chip>
            <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Number of Items: ${this.state.container?.shipmentItems?.length ?? HYPHEN}`}
            </Chip>
          </View>

          <Divider style={styles.contentDivider} />

          <Subheading style={styles.subheading}>
            {`Container Name: ${this.state.container?.containerNumber}`}
          </Subheading>
          <Caption style={styles.caption}> {`Container Type: ${this.state.container?.containerType?.name}`} </Caption>

          <View style={styles.additionalInfoRow}>
            <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Number of Items: ${this.state.container?.shipmentItems?.length ?? HYPHEN}`}
            </Chip>
          </View>
        </View>
        <Divider />
        <View style={styles.containerDetails}>
          <Text style={styles.label}>Status</Text>
          <SelectDropdown
            data={containerStatuses}
            defaultValue={this.props.route.params.status}
            renderDropdownIcon={renderIcon}
            buttonStyle={styles.select}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
            rowTextForSelection={(item) => item}
            onSelect={(selectedItem) => {
              const { id } = this.props.route.params;
              this.updateContainerStatus(id, selectedItem);
            }}
          />
          <FlatList
            data={this.state.container?.shipmentItems}
            ListEmptyComponent={<EmptyView title="LPN Details" description="There are no items" isRefresh={false} />}
            renderItem={(shipmentItem: ListRenderItemInfo<ContainerShipmentItem>) => (
              <TouchableOpacity style={styles.listItemContainer} onPress={() => this.onTapped(shipmentItem)}>
                <Card>
                  <Card.Content>
                    <View style={styles.row}>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Product Code</Text>
                        <Text style={styles.value}>{shipmentItem.item?.inventoryItem?.product?.productCode}</Text>
                      </View>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Product</Text>
                        <Text style={styles.value}>{shipmentItem.item?.inventoryItem?.product?.name}</Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Shipment Number</Text>
                        <Text style={styles.value}>{shipmentItem.item.shipment.shipmentNumber}</Text>
                      </View>
                      <View style={styles.col50}>
                        <Text style={styles.label}>Quantity</Text>
                        <Text style={styles.value}>{shipmentItem.item.quantity}</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
          <View style={styles.bottom}>
            <Button size="100%" title={'Print Barcode Label'} disabled={false} onPress={this.handleClick} />
          </View>
        </View>

        <PrintModal
          visible={this.state.visible}
          closeModal={this.closeModal}
          type={'containers'}
          product={this.state.containerDetails?.product}
          defaultBarcodeLabelUrl={this.state.containerDetails?.defaultBarcodeLabelUrl}
        />
      </ScrollView>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchContainer,
  getContainer,
  updateContainerStatus
};

export default connect(null, mapDispatchToProps)(LpnDetail);
