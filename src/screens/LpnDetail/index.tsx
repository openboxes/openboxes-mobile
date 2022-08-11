import React from 'react';
import { DispatchProps, Props } from './types';
import { Container } from '../../data/container/Container';
import { FlatList, ListRenderItemInfo, Text, Image, TouchableOpacity, View } from 'react-native';
import { ContainerShipmentItem } from '../../data/container/ContainerShipmentItem';
import { fetchContainer, getContainer, updateContainerStatus } from '../../redux/actions/lpn';
import { connect } from 'react-redux';
import styles from './styles';
import { margin, typography } from '../../assets/styles';
import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import PrintModal from '../../components/PrintModal';
import EmptyView from '../../components/EmptyView';
import SelectDropdown from 'react-native-select-dropdown';
import { Card } from 'react-native-paper';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from '../../components/DetailsTable';
import { ContentContainer, ContentHeader, ContentFooter, ContentBody } from '../../components/ContentLayout';

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
    this.renderShipmentItems = this.renderShipmentItems.bind(this);
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

  renderShipmentItems(shipmentItem: ListRenderItemInfo<ContainerShipmentItem>) {
    const shipmentItemsData: LabeledDataType[] = [
      { label: 'Product Code', value: shipmentItem.item?.inventoryItem?.product?.productCode },
      { label: 'Product', value: shipmentItem.item?.inventoryItem?.product?.name },
      { label: 'Shipment Number', value: shipmentItem.item.shipment.shipmentNumber },
      { label: 'Quantity', value: shipmentItem.item.quantity }
    ];

    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={() => this.onTapped(shipmentItem)}>
        <Card>
          <Card.Content>
            <DetailsTable data={shipmentItemsData} />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ContentContainer>
        <ContentHeader style={margin.MB1}>
          <DetailsTable
            data={[
              { label: 'Name', value: this.state.container?.name },
              { label: 'Container Number', value: this.state.container?.containerNumber },
              { label: 'Container Type', value: this.state.container?.containerType?.name },
              { label: 'Number of Items', value: this.state.container?.shipmentItems?.length }
            ]}
          />
          <View>
            <Text style={typography.label}>{'Status'}</Text>
            <SelectDropdown
              data={containerStatuses}
              defaultValue={this.state.container?.containerStatus?.id}
              renderDropdownIcon={renderIcon}
              buttonStyle={styles.select}
              buttonTextAfterSelection={(selectedItem) => selectedItem}
              rowTextForSelection={(item) => item}
              onSelect={(selectedItem) => {
                const { id } = this.props.route.params;
                this.updateContainerStatus(id, selectedItem);
              }}
            />
          </View>
        </ContentHeader>
        <ContentBody>
          <Text style={typography.label}>{'Items'}</Text>
          <FlatList
            data={this.state.container?.shipmentItems}
            ListEmptyComponent={<EmptyView title="LPN Details" description="There are no items" isRefresh={false} />}
            renderItem={this.renderShipmentItems}
            keyExtractor={(item) => item.id}
          />
        </ContentBody>
        <ContentFooter>
          <Button title={'Print Barcode Label'} disabled={false} onPress={this.handleClick} />
          <PrintModal
            visible={this.state.visible}
            closeModal={this.closeModal}
            type={'containers'}
            product={this.state.containerDetails?.product}
            defaultBarcodeLabelUrl={this.state.containerDetails?.defaultBarcodeLabelUrl}
          />
        </ContentFooter>
      </ContentContainer>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchContainer,
  getContainer,
  updateContainerStatus
};

export default connect(null, mapDispatchToProps)(LpnDetail);
