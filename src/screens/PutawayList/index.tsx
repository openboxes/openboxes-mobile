/* eslint-disable complexity */
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
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import showPopup from '../../components/Popup';
import styles from './styles';
import PutAwayItem from '../../components/PutAwayItem';
import PutAwayItems from '../../data/putaway/PutAwayItems';
import { fetchPutAwayFromOrderAction } from '../../redux/actions/putaways';
import PutAway from '../../data/putaway/PutAway';
import EmptyView from '../../components/EmptyView';
class PutawayList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      putAwayList: null,
      putAway: null,
      orderId: null,
      showList: false,
      showDetail: false
    };
  }
  componentDidMount() {
    this.fetchPutAways(null);
  }

  searchOrder = (query: string) => {
    this.fetchPutAways(query);
    const actionCallback = (data: any) => {
      if (!data || data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to fetch Order' : 'Error',
          message: data.errorMessage ?? 'Failed to fetch Order with:' + query,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getOrdersAction(query, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data.length === 0) {
          showPopup({
            title: data.errorMessage ? 'Failed to fetch Order' : 'Error',
            message: data.errorMessage ?? 'Failed to fetch Order with:' + query,
            positiveButton: {
              text: 'OK'
            }
          });
          this.setState({
            error: 'No orders found'
          });
        } else if (data.length === 1) {
          this.fetchPutAway(data[0]['id']);
        } else {
          this.setState({
            error: null
          });
        }
      }
      this.props.hideScreenLoading();
    };
    this.props.getOrdersAction(query, actionCallback);
  };

  fetchPutAways = (query: any) => {
    const actionCallback = (data: any) => {
      if (!data || data?.error) {
        return Promise.resolve(null);
      } else {
        this.setState({
          showList: true,
          putAwayList: data,
          putAway: null
        });
      }
      this.props.hideScreenLoading();
    };

    this.props.fetchPutAwayFromOrderAction(query, actionCallback);
  };

  renderItem = (item: ListRenderItemInfo<PutAwayItems>) => {
    return <PutAwayItem item={item.item} />;
  };

  goToPutawayItemDetailScreen = (
    putAway: PutAway,
    putAwayItem: PutAwayItems
  ) => {
    this.props.navigation.navigate('PutawayItemDetail', {
      putAway: putAway,
      putAwayItem: putAwayItem
    });
  };
  onPutAwayTapped = (putAway: PutAway) => {
    this.props.navigation.navigate('PutawayDetails', {
      putAway: putAway,
      exit: () => {
        this.props.navigation.navigate('PutawayList');
      }
    });
  };

  render() {
    const { showList } = this.state;
    return (
      <View style={styles.screenContainer}>
        <BarCodeSearchHeader
          onBarCodeSearchQuerySubmitted={this.searchOrder}
          placeHolder={'Search Orders by Name'}
          searchBox={false}
        />
        {showList ? (
          <View style={styles.contentContainer}>
            <FlatList
              data={this.state.putAwayList}
              ListEmptyComponent={
                <EmptyView
                  title="Putaway"
                  description="There are no items to putaway"
                />
              }
              renderItem={(item: ListRenderItemInfo<PutAway>) => (
                <TouchableOpacity
                  style={styles.listItemContainer}
                  onPress={() => this.onPutAwayTapped(item.item)}
                >
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Status</Text>
                      <Text style={styles.value}>
                        {item.item?.putawayStatus}
                      </Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>PutAway Number</Text>
                      <Text style={styles.value}>
                        {item.item?.putawayNumber}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Origin</Text>
                      <Text style={styles.value}>
                        {item.item?.['origin.name']}
                      </Text>
                    </View>
                    <View style={styles.col50}>
                      <Text style={styles.label}>Destination</Text>
                      <Text style={styles.value}>
                        {item.item?.['destination.name']}
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
  putAway: state.putawayReducer.putAway
});

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getOrdersAction,
  fetchPutAwayFromOrderAction
};
export default connect(mapStateToProps, mapDispatchToProps)(PutawayList);
