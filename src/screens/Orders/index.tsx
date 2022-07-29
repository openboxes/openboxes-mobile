/* eslint-disable complexity */
import React from 'react';
import { typography, common, margin } from '../../assets/styles';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import showPopup from '../../components/Popup';
import { DispatchProps, Props, State } from './types';
import OrdersList from './OrdersList';
import { Order } from '../../data/order/Order';
import { getOrdersAction } from '../../redux/actions/orders';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader';

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
    if (this.props.route.params.refetchOrders) {
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
      <View style={[common.containerFlexColumn, common.flex1]}>
        <BarcodeSearchHeader
          placeholder={'Search Orders by Name'}
          resetSearch={() => null}
          autoSearch={false}
          searchBox={false}
          onSearchTermSubmit={this.searchOrders}
        />
        <Text style={[typography.label, margin.M1, margin.ML3]}>{`Returned ${this.state.resultCount} results`}</Text>
        <View style={[common.containerFlexColumn, common.flex1]}>
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
