import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import showPopup from '../../components/Popup';
import { Order } from '../../data/order/Order';
import { getOrdersAction } from '../../redux/actions/orders';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import OrderCardSkeleton from './OrderCardSkeleton';
import OrdersList from './OrdersList';
import styles from './styles';
import { DispatchProps, Props, State } from './types';

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allOrders: null,
      loading: true,
      searchTerm: ''
    };
  }

  componentDidMount() {
    this.searchOrders(null);
  }

  componentDidUpdate() {
    if (this.props?.route?.params?.refetchOrders) {
      this.searchOrders(null);
    }
  }

  searchOrders = (query: string | null) => {
    this.props.navigation.setParams({ refetchOrders: false });
    this.setState({ searchTerm: query ?? '', loading: true });
    const actionCallback = (data: any) => {
      this.setState({ loading: false });
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to fetch orders' : 'Error',
          message: data.errorMessage ?? 'Failed to fetch orders',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.searchOrders(query);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      this.setState({ allOrders: data ?? [] });
    };
    this.props.getOrdersAction(query, actionCallback, true);
  };

  goToOrderDetailsScreen = (order: Order) => {
    this.props.navigation.navigate('OrderDetails', {
      order,
      pickList: null,
      exit: () => {
        this.props.navigation.navigate('Orders');
      }
    });
  };

  render() {
    const { loading, allOrders, searchTerm } = this.state;
    return (
      <View style={styles.screenContainer}>
        <BarcodeSearchHeader
          autoSearch
          placeholder={'Search Orders by Name'}
          resetSearch={() => this.searchOrders(null)}
          searchBox={false}
          loading={loading}
          accessibilityLabel="Search orders"
          onSearchTermSubmit={this.searchOrders}
        />
        <View style={styles.content}>
          {loading ? (
            <ListLoadingSkeleton visible count={5} CardComponent={OrderCardSkeleton} />
          ) : (
            <OrdersList
              orders={allOrders}
              emptyDescription={emptyStateMessage('orders', searchTerm, 'No outbound orders found')}
              onOrderTapped={this.goToOrderDetailsScreen}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  getOrdersAction
};

export default connect(null, mapDispatchToProps)(Index);
