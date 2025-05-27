import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import showPopup from '../../components/Popup';
import { Order } from '../../data/order/Order';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getOrdersAction } from '../../redux/actions/orders';
import OrdersList from './OrdersList';
import styles from './styles';
import { DispatchProps, Props, State } from './types';

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      allOrders: null,
      resultCount: 0
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
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to fetch products' : 'Error',
          message: data.errorMessage ?? 'Failed to fetch products',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getOrdersAction(query, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data?.length === 0) {
          this.setState({
            error: 'No outbound orders found',
            allOrders: data,
            resultCount: 0
          });
        } else {
          this.setState({
            error: null,
            allOrders: data,
            resultCount: data.length
          });
        }
      }

      this.props.hideScreenLoading();
    };
    this.props.showScreenLoading('Loading..');
    this.props.getOrdersAction(query, actionCallback);
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
    return (
      <View style={styles.screenContainer}>
        <BarcodeSearchHeader
          placeholder={'Search Orders by Name'}
          resetSearch={() => null}
          autoSearch={false}
          searchBox={false}
          onSearchTermSubmit={this.searchOrders}
        />
        <View style={styles.content}>
          <OrdersList orders={this.state.allOrders} onOrderTapped={this.goToOrderDetailsScreen} />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  getOrdersAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(null, mapDispatchToProps)(Index);
