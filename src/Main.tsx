import React, {Component} from 'react';
// import {connect} from 'react-redux';
import * as NavigationService from './NavigationService';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './screens/Login';
import Orders from './screens/Orders';
import OrderDetails from './screens/OrderDetails';
import ProductDetails from './screens/ProductDetails';
import Dashboard from './screens/Dashboard';
import Products from './screens/Products';
import ChooseCurrentLocation from './screens/ChooseCurrentLocation';
import PickOrderItem from './screens/PickList';
import FullScreenLoadingIndicator from './components/FullScreenLoadingIndicator';
import {RootState} from './redux/reducers';
import {connect} from 'react-redux';
import {View} from 'react-native';
import Location from './data/location/Location';
import {Session} from './data/auth/Session';
import {getSessionAction} from './redux/actions/main';
import showPopup from './components/Popup';
const Stack = createStackNavigator();

export interface OwnProps {
  //no-op
}

interface StateProps {
  loggedIn: boolean;
  fullScreenLoadingIndicator: {
    visible: boolean;
    message?: string | null;
  };
  currentLocation?: Location | null;
  session?: Session | null;
}

interface DispatchProps {
  getSessionAction: (callback: (data: any) => void) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {}

class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.fullScreenLoadingIndicator.visible !==
        nextProps.fullScreenLoadingIndicator.visible ||
      this.props.loggedIn != nextProps.loggedIn ||
      this.props.currentLocation !== nextProps.currentLocation ||
      this.props.session !== nextProps.session
    );
  }

  componentDidUpdate() {
    if (
      this.props.loggedIn &&
      this.props.currentLocation !== null &&
      this.props.session === null
    ) {
      const actionCallback = (data: any) => {
        if (data?.error) {
          showPopup({
            message: 'Failed to fetch session',
            positiveButton: {
              text: 'Retry',
              callback: () => {
                this.props.getSessionAction(actionCallback);
              },
            },
          });
        }
      };
      this.props.getSessionAction(actionCallback);
    }
  }

  render() {
    const {loggedIn} = this.props;
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}>
        <FullScreenLoadingIndicator
          visible={this.props.fullScreenLoadingIndicator.visible}
          message={this.props.fullScreenLoadingIndicator.message}
        />
        <NavigationContainer ref={NavigationService.navigationRef}>
          <Stack.Navigator
            initialRouteName={loggedIn ? 'Login' : 'ChooseCurrentLocation'}
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen
              name="ChooseCurrentLocation"
              component={ChooseCurrentLocation}
            />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="PickOrderItem" component={PickOrderItem} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Products" component={Products} />
            {/*<Stack.Screen name="Drawer" component={DrawerNavigator} />*/}
            {/*<Stack.Screen name="Drawer" component={DrawerNavigator} />*/}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.mainReducer.loggedIn,
  fullScreenLoadingIndicator: state.mainReducer.fullScreenLoadingIndicator,
  currentLocation: state.mainReducer.currentLocation,
  session: state.mainReducer.session,
});

const mapDispatchToProps: DispatchProps = {
  getSessionAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
