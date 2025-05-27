import { DispatchProps, Props, State } from '../OutboundStockDetails/types';
import React from 'react';
import { Alert, ScrollView, SectionList, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from '../OutboundStockDetails/styles';
import { getShipment } from '../../redux/actions/packing';
import OrderDetailsSection from './OrderDetailsSection';
import EmptyView from '../../components/EmptyView';
import { Shipment, Container } from '../../data/container/Shipment';
import { Card, Divider } from 'react-native-paper';
import _ from 'lodash';
import InputBox from '../../components/InputBox';
import showPopup from '../../components/Popup';
import { HYPHEN } from '../../constants';

// Shipment loading
class OutboundLoadingDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      shipment: null,
      scannedContainer: ''
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

  actionCallback = (data: any) => {
    const allContainers = data?.containers?.filter((c) => c.id !== null) || [];
    const loadedContainers = data?.containers?.filter((c) => c.status === 'LOADED') || [];

    if (!data || data?.error) {
      return Promise.resolve(null);
    } else {
      if (allContainers.length > 0 && loadedContainers.length === allContainers.length) {
        Alert.alert(
          'All containers are loaded', // title
          'What do you want to do now?', // message
          [
            {
              // button list
              text: 'See the details',
              onPress: () => null
            },
            {
              text: 'Go to the loading list',
              onPress: () => this.props.navigation.navigate('OutboundLoadingList')
            }
          ],
          {
            cancelable: false
          }
        );
      }

      this.setState({
        shipment: data,
        scannedContainer: ''
      });
    }
    this.props.hideScreenLoading();
  };

  fetchShipment = () => {
    const { shipmentId } = this.props.route.params;
    this.props.navigation.setParams({ refetchShipment: false });
    this.props.showScreenLoading('Loading..');
    this.props.getShipment(shipmentId, this.actionCallback);
  };

  showLoadingLPNScreen = (container: Container, shipment: Shipment | null, scanned?: boolean) => {
    this.props.navigation.navigate('OutboundLoadingContainer', {
      container: container,
      shipment: shipment,
      scanned
    });
  };

  findMatchingContainer = (searchTerm: string) => {
    return _.find(
      this.state.shipment?.containers,
      (container: Container) =>
        container?.name?.toLowerCase() === searchTerm?.toLowerCase() ||
        container?.containerNumber?.toLowerCase() === searchTerm?.toLowerCase()
    );
  };

  onContainerScan = (value: string) => {
    this.setState({ scannedContainer: value }, () => {
      if (value) {
        const matchingContainer = this.findMatchingContainer(value);
        if (matchingContainer) {
          this.setState(
            {
              scannedContainer: '' // reset scan value before redirecting
            },
            () => this.showLoadingLPNScreen(matchingContainer, this.state.shipment, true)
          );
        }
      }
    });
  };

  onContainerScanEnd = (value: string) => {
    if (value) {
      const matchingContainer = this.findMatchingContainer(value);
      if (matchingContainer) {
        this.showLoadingLPNScreen(matchingContainer, this.state.shipment, true);
      } else {
        showPopup({
          message: `The LPN: ${value} is not for this order`
        });
        this.setState({ scannedContainer: '' });
      }
    }
  };

  renderListItem = (item: Container, index: number, section: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.itemView}
        onPress={() => this.showLoadingLPNScreen(item, this.state.shipment, true)}
      >
        <Card>
          <Card.Content>
            <View style={styles.rowItem}>
              {this.RenderData({ title: 'Container Name', subText: item.name ?? HYPHEN })}
              {this.RenderData({ title: 'Container Number', subText: item.containerNumber ?? HYPHEN })}
            </View>
            <View style={styles.rowItem}>
              {this.RenderData({ title: 'Container Type', subText: item.type ?? HYPHEN })}
              {this.RenderData({ title: 'Container Status', subText: item.status ?? HYPHEN })}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  RenderData = ({ title, subText }: { title: string; subText: string }) => {
    return (
      <View style={styles.columnItem}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>{subText}</Text>
      </View>
    );
  };

  render() {
    return (
      <>
        <OrderDetailsSection shipment={this.state.shipment} />
        <Divider />

        <View style={styles.formContainer}>
          <InputBox
            style={styles.scanSearch}
            value={this.state.scannedContainer}
            disabled={false}
            editable={false}
            label={'Scan LPN'}
            onChange={this.onContainerScan}
            onEndEdit={this.onContainerScanEnd}
          />
          <SectionList
            sections={(
              this.state.shipment?.containers
                ?.filter((c) => c.id !== null)
                ?.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')) || []
            ).map((container) => ({
              title: container.name ?? HYPHEN,
              data: [container]
            }))}
            renderItem={({ item, index, section }) => this.renderListItem(item, index, section)}
            renderSectionHeader={({ section }) => (
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{section.title}</Text>
              </View>
            )}
            ListEmptyComponent={
              <EmptyView title="Loading" description="There are no containers available" isRefresh={false} />
            }
            keyExtractor={(item, index) => item.id || index.toString()}
          />
        </View>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutboundLoadingDetails);
