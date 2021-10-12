import React from 'react';
import styles from './styles';
import {connect} from 'react-redux';
import {View} from 'react-native';
import showPopup from '../../components/Popup';
import {DispatchProps, State, Props} from './Types';
import OrdersList from './OrdersList';
import {Order} from '../../data/order/Order';
import Header from '../../components/Header';
import {getOrdersAction} from '../../redux/actions/orders';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      allOrders: null,
    };
  }

  componentDidMount() {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.error.message ? 'Failed to fetch products' : null,
          message: data.error.message ?? 'Failed to fetch products',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getOrdersAction(actionCallback);
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        // if (!data) {
        //   this.props.exit();
        //   return;
        // }
        if (data.length == 0) {
          this.setState({
            error: 'No products found',
            allOrders: data,
          });
        } else {
          this.setState({
            error: null,
            allOrders: data,
          });
        }
      }

      this.props.hideScreenLoading();
    };
    this.props.getOrdersAction(actionCallback);
  }

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
        <Header
          title="Orders"
          subtitle={'All Outbound Orders'}
          backButtonVisible={true}
          onBackButtonPress={this.onBackButtonPress}
        />
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
