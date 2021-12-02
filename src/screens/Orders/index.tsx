import React from 'react';
import styles from './styles';
import {connect} from 'react-redux';
import {Text, View} from 'react-native';
import showPopup from '../../components/Popup';
import {DispatchProps, Props, State} from './types';
import OrdersList from './OrdersList';
import {Order} from '../../data/order/Order';
import {getOrdersAction} from '../../redux/actions/orders';
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import BarCodeSearchHeader from '../Products/BarCodeSearchHeader';

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      allOrders: null,
      resultCount: 0,
    };
  }

  componentDidMount() {
    this.searchOrders(null);
  }

  searchOrders = (query: string | null) => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to fetch products' : "Error",
          message: data.errorMessage ?? 'Failed to fetch products',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getOrdersAction(query, actionCallback);
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        if (data?.length == 0) {
          this.setState({
            error: 'No outbound orders found',
            allOrders: data,
            resultCount: 0,
          });
        } else {
          this.setState({
            error: null,
            allOrders: data,
            resultCount: data.length,
          });
          if (data.length == 1) {
            this.goToOrderDetailsScreen(data[0]);
          }
        }
      }

      this.props.hideScreenLoading();
    };
    this.props.getOrdersAction(query, actionCallback);
  };

  onBackButtonPress = () => {
    this.props.exit();
  };

  goToOrderDetailsScreen = (order: Order) => {
    this.props.navigation.navigate('OrderDetails', {
      order,
      pickList: null,
      exit: () => {
        this.props.navigation.navigate('Orders');
      },
    });
  };

  render() {
    return (
        <View style={styles.screenContainer}>
          {/*<Header*/}
          {/*  title="Orders"*/}
          {/*  subtitle={'All Outbound Orders'}*/}
          {/*  backButtonVisible={true}*/}
          {/*  onBackButtonPress={this.onBackButtonPress}*/}
          {/*/>*/}
          <BarCodeSearchHeader
              onBarCodeSearchQuerySubmitted={this.searchOrders}
              placeholder={'Search Orders by Name'}
              autoSearch={true}
              searchBox={false}/>
          <Text style={styles.label}>{' '} Returned {this.state.resultCount} results</Text>
          <View style={styles.content}>
            <OrdersList
                orders={this.state.allOrders}
                onOrderTapped={this.goToOrderDetailsScreen}
            />
            {/*<CentralMessage message={this.state.centralErrorMessage}/>*/}
          </View>
        </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  getOrdersAction,
  showScreenLoading,
  hideScreenLoading,
};

export default connect(null, mapDispatchToProps)(Index);
