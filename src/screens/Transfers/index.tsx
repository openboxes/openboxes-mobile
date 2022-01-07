import { DispatchProps, Props, State } from './types';
import React from 'react';
import { getOrdersAction } from '../../redux/actions/orders';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { connect, useSelector } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import EmptyView from '../../components/EmptyView';
import { getStockTransfers } from '../../redux/actions/transfers';
import showPopup from '../../components/Popup';

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
    const { getStockTransfers } = this.props;
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Inbound order details' : null,
          message:
            data.errorMessage ??
            `Failed to load inbound order details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              getStockTransfers(callback, id);
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
          const { currentLocation } = this.props;
          this.setState({
            error: null,
            transfersList: data.filter(
              (transferData) =>
                currentLocation?.id === transferData?.origin?.id &&
                transferData.status.name === 'APPROVED'
            )
          });
        }
      }
    };
    getStockTransfers(callback);
  };

  onCallBackHandler = (data: undefined) => {
    const { transfersList } = this.state;
    this.setState({
      error: null,
      transfersList: transfersList.filter(
        (transferData) => data?.id !== transferData?.id
      )
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
          <View style={styles.contentContainer}>
            <FlatList
              data={transfersList}
              ListEmptyComponent={
                <EmptyView
                  title="Transfers"
                  description="There are no items for Transfer"
                />
              }
              renderItem={(item: ListRenderItemInfo<any>) => (
                <TouchableOpacity
                  style={styles.listItemContainer}
                  onPress={() => this.onStockTransfersTapped(item.item)}
                >
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Identify</Text>
                      <Text style={styles.value}>{item.item?.orderNumber}</Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Status</Text>
                      <Text style={styles.value}>{item.item?.status.name}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Origin</Text>
                      <Text style={styles.value}>
                        {item.item?.origin?.name}
                      </Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Destination</Text>
                      <Text style={styles.value}>
                        {item.item?.destination?.name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Number of Items</Text>
                      <Text style={styles.value}>
                        {item.item?.orderItems?.length}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          </View>
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
