import { DispatchProps, Props, State } from './types';
import React from 'react';
import { getOrdersAction } from '../../redux/actions/orders';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import EmptyView from '../../components/EmptyView';
import { getStockTransfers } from '../../redux/actions/transfers';
import showPopup from '../../components/Popup';
import { Card } from 'react-native-paper';
import { LayoutStyle } from '../../assets/styles';

class Transfers extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      transfersList: null
    };
  }
  componentDidMount() {
    this._getTransfersList();
  }

  _getTransfersList = () => {
    const { getStockTransfers, currentLocation } = this.props;

    if (!currentLocation || !currentLocation.id) {
      showPopup({
        title: 'Error',
        message: 'Current location is not set. Please try again later.',
        negativeButtonText: 'OK'
      });
      return;
    }

    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Inbound order details' : null,
          message: data.errorMessage ?? `Failed to load inbound order details value ${currentLocation.id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              getStockTransfers(currentLocation.id, callback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data.length === 0) {
          this.setState({
            error: 'No products found',
            transfersList: data
          });
        } else {
          const filteredList = data.filter((transferData) => transferData.status === 'APPROVED');

          this.setState({
            error: null,
            transfersList: filteredList
          });
        }
      }
    };

    getStockTransfers(currentLocation.id, callback);
  };

  onCallBackHandler = (data: undefined) => {
    const { transfersList } = this.state;
    this.setState({
      error: null,
      transfersList: transfersList ? transfersList.filter((transferData) => data?.id !== transferData?.id) : []
    });
  };

  onStockTransfersTapped = (data) => {
    this.props.navigation.navigate('TransferDetails', {
      transfers: data,
      onCallBackHandler: this.onCallBackHandler
    });
  };

  render() {
    const { transfersList } = this.state;
    return (
      <View style={styles.screenContainer}>
        {transfersList ? (
          <FlatList
            data={transfersList}
            ListEmptyComponent={<EmptyView title="Transfers" description="There are no items for Transfer" />}
            renderItem={(item: ListRenderItemInfo<any>) => (
              <Card style={LayoutStyle.listItemContainer} onPress={() => this.onStockTransfersTapped(item.item)}>
                <Card.Content>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Identify</Text>
                      <Text style={styles.value}>{item.item?.orderNumber}</Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Status</Text>
                      <Text style={styles.value}>{item.item?.status}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Origin</Text>
                      <Text style={styles.value}>{item.item?.origin}</Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Destination</Text>
                      <Text style={styles.value}>{item.item?.destination}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Number of Items</Text>
                      <Text style={styles.value}>{item.item?.orderItemsCount}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  transfers: state.putawayReducer.putAway,
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getOrdersAction,
  getStockTransfers
};
export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
