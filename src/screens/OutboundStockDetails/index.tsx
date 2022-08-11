import { DispatchProps, Props, State } from './types';
import React from 'react';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { getShipment } from '../../redux/actions/packing';
import OutboundVMMapper from './OutboubVmMapper';
import ContainerDetails from './ContainerDetails';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';
import ShipmentItems from '../../data/inbound/ShipmentItems';
import { Container } from '../../data/container/Shipment';
import showPopup from '../../components/Popup';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import { ContentContainer, ContentHeader, ContentFooter, ContentBody } from '../../components/ContentLayout';

// Shipment packing (Packing Order Details)
class OutboundStockDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipment: null,
      shipmentData: null,
      scannedValue: ''
    };
  }

  componentDidMount() {
    this.fetchShipment();
  }

  componentDidUpdate() {
    if (this.props.route.params.refetchShipment) {
      this.fetchShipment();
    }
  }

  fetchShipment = () => {
    const { shipmentId } = this.props.route.params;
    this.props.navigation.setParams({ refetchShipment: false });
    const actionCallback = (data: any) => {
      if (!data || data?.error) {
        return Promise.resolve(null);
      } else {
        this.setState({
          shipment: data,
          shipmentData: OutboundVMMapper(data)
        });
      }
      this.props.hideScreenLoading();
    };
    this.props.showScreenLoading('Loading..');
    this.props.getShipment(shipmentId, actionCallback);
  };

  onScan = (value: string) => {
    this.setState({ scannedValue: value }, () => {
      if (value) {
        const matchingLotNumberOrProduct = this.findMatchingLotNumberOrProduct(value);
        if (matchingLotNumberOrProduct) {
          this.setState({ scannedValue: '' }, () => {
            this.showOrderDetailsScreen(matchingLotNumberOrProduct);
          });
          return;
        }

        const matchingContainer = this.findMatchingContainer(value);
        if (matchingContainer) {
          this.setState({ scannedValue: '' }, () => {
            this.showLPNDetailsScreen(matchingContainer, this.state.shipment?.shipmentNumber);
          });
          return;
        }
      }
    });
  };

  onScanEnd = (value: string) => {
    if (value) {
      const matchingLotNumberOrProduct = this.findMatchingLotNumberOrProduct(value);
      if (matchingLotNumberOrProduct) {
        this.showOrderDetailsScreen(matchingLotNumberOrProduct);
        return;
      }
      const matchingContainer = this.findMatchingContainer(value);
      if (matchingContainer) {
        this.showLPNDetailsScreen(matchingContainer, this.state.shipment?.shipmentNumber);
        return;
      }
      showPopup({
        message: `Unable to locate a product, item, or container with identifier: ${value}`
      });
      this.setState({ scannedValue: '' });
    }
  };

  findMatchingLotNumberOrProduct = (input: string) => {
    const searchTerm = input.toLowerCase();
    return this.state.shipment?.shipmentItems?.find(
      (item: ShipmentItems) =>
        item.inventoryItem?.lotNumber?.toLowerCase().includes(searchTerm) ||
        item.lotNumber?.toLowerCase().includes(searchTerm) ||
        item.inventoryItem?.product?.productCode?.toLowerCase()?.includes(searchTerm)
    );
  };

  findMatchingContainer = (input: string) => {
    const searchTerm = input.toLowerCase();
    return this.state.shipment?.availableContainers?.find(
      (container: Container) =>
        container.containerNumber?.toLowerCase()?.includes(searchTerm) ||
        container?.name?.toLowerCase().includes(searchTerm)
    );
  };

  showOrderDetailsScreen = (item: any) => {
    this.props.navigation.navigate('ShipmentDetails', {
      item: item
    });
  };

  showLPNDetailsScreen = (container: Container, shipmentNumber: string | undefined) => {
    this.props.navigation.navigate('LpnDetail', {
      id: container?.id,
      shipmentNumber: shipmentNumber
    });
  };

  render() {
    const renderData: LabeledDataType[] = [
      { label: 'Shipment Number', value: this.state.shipment?.shipmentNumber },
      { label: 'Status', value: this.state.shipment?.displayStatus },
      { label: 'Destination', value: this.state.shipment?.destination.name },
      { label: 'Expected Shipping Date', value: this.state.shipment?.expectedShippingDate },
      { label: 'Packing Location', value: this.state.shipment?.packingLocation, defaultValue: 'Unassigned' },
      { label: 'Items Packed', value: this.state.shipment?.packingStatusDetails?.statusMessage }
    ];

    return (
      <ContentContainer>
        <ContentHeader>
          <DetailsTable data={renderData} />
          <InputBox
            style={styles.scanSearch}
            value={this.state.scannedValue}
            disabled={false}
            editable={false}
            label={'Search'}
            onChange={this.onScan}
            onEndEdit={this.onScanEnd}
          />
        </ContentHeader>
        <ContentBody>
          <ContainerDetails item={this.state.shipmentData?.sectionData ?? []} />
        </ContentBody>
        <ContentFooter fixed>
          <Button
            title={'Create LPN'}
            disabled={false}
            onPress={() => {
              this.props.navigation.navigate('CreateLpn', {
                id: this?.state?.shipment?.id,
                shipmentDetail: this?.state?.shipment
              });
            }}
          />
        </ContentFooter>
      </ContentContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getShipment
};
export default connect(mapStateToProps, mapDispatchToProps)(OutboundStockDetails);
