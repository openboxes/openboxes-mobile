/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import * as NavigationService from './NavigationService';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Orders from './screens/Orders';
import OrderDetails from './screens/OrderDetails';
import ProductDetails from './screens/ProductDetails';
import Dashboard from './screens/Dashboard';
import Transfers from './screens/Transfers';
import InboundReceiveDetail from './screens/InboundReceiveDetail';
import Products from './screens/Products';
import PutawayItem from './screens/PutawayItem';
import DrawerNavigator from './screens/DrawerNavigator';
import PickOrderItem from './screens/PickList';
import FullScreenLoadingIndicator from './components/FullScreenLoadingIndicator';
import { RootState } from './redux/reducers';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaView } from 'react-native';
import Location from './data/location/Location';
import { Session } from './data/auth/Session';
import { getSessionAction } from './redux/actions/main';
import showPopup from './components/Popup';
import { appHeaderHeight } from './constants';
import { colors } from './assets/styles';
import Scan from './screens/Scan';
import PutawayList from './screens/PutawayList';
import Settings from './screens/Settings';
import PutawayItemDetail from './screens/PutawayItemDetail';
import InboundOrderList from './screens/InboundOrderList';
import InboundDetails from './screens/InboundDetails';
import CreateLpn from './screens/Lpn/Create';
import LpnDetail from './screens/LpnDetail';
import PutawayCandidates from './screens/PutawayCandidates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InternalLocationDetails from './screens/InternalLocationDetails';
import OutboundStockList from './screens/OutboundStockList';
import OutboundStockDetails from './screens/OutboundStockDetails';
import ProductSummary from './screens/ProductSummary';
import TransferDetails from './screens/TransfersDetails';
import AdjustStock from './screens/AdjustStock';
import Transfer from './screens/Transfer';
import ShipItemDetails from './screens/ShipItemDetails';
import ApiClient from './utils/ApiClient';
import OptionMenu from './components/OptionMenu';
import ViewAvailableItem from './screens/ViewAvailableItem';
import PutawayDetails from './screens/PutawayDetails';
import Placeholder from './screens/Placeholder';
import { Provider } from 'react-native-paper';
import AppInfoScreen from './screens/AppInfo/AppInfoScreen';
import PackingLocationPage from './screens/PackingLocationPage';
import OutboundLoadingList from './screens/OutboundLoadingList/OutboundLoadingList';
import OutboundLoadingDetails from './screens/OutboundLoadingDetails';
import OutboundLoadingContainer from './screens/OutboundLoadingContainer';

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

interface State {
  launched: boolean;
}

class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      launched: false
    };
  }

  UNSAFE_componentWillMount() {
    AsyncStorage.getItem('API_URL').then((value) => {
      if (!value) {
        NavigationService.navigate('Settings');
      } else {
        ApiClient.setBaseUrl(value);
      }
    });
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.fullScreenLoadingIndicator.visible !== nextProps.fullScreenLoadingIndicator.visible ||
      this.props.loggedIn !== nextProps.loggedIn ||
      this.props.currentLocation !== nextProps.currentLocation ||
      this.props.session !== nextProps.session
    );
  }

  componentDidUpdate() {
    if (this.props.loggedIn && this.props.currentLocation !== null && this.props.session === null) {
      const actionCallback = (data: any) => {
        if (data?.error) {
          showPopup({
            message: 'Failed to fetch session',
            positiveButton: {
              text: 'Retry',
              callback: () => {
                this.props.getSessionAction(actionCallback);
              }
            }
          });
        }
      };
      this.props.getSessionAction(actionCallback);
    }
  }

  componentDidMount() {
    SplashScreen.hide();
    AsyncStorage.setItem('launched', 'true');
  }

  render() {
    const { loggedIn } = this.props;
    const initialRouteName = !loggedIn ? 'Login' : 'Drawer';
    return (
      <Provider>
        <SafeAreaView style={{ flex: 1 }}>
          <FullScreenLoadingIndicator
            visible={this.props.fullScreenLoadingIndicator.visible}
            message={this.props.fullScreenLoadingIndicator.message}
          />
          <NavigationContainer ref={NavigationService.navigationRef}>
            <Stack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={({ route, navigation }) => ({
                headerRight: () => <OptionMenu route={route} navigation={navigation} />,
                headerTitleContainerStyle: {
                  width: '50%'
                },
                headerTintColor: colors.white,
                headerStyle: {
                  backgroundColor: colors.accent,
                  height: appHeaderHeight
                }
              })}
            >
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen
                name="Drawer"
                component={DrawerNavigator}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen name="Orders" component={Orders} />
              <Stack.Screen name="OrderDetails" component={OrderDetails} />
              <Stack.Screen name="ProductDetails" component={ProductDetails} />
              <Stack.Screen name="PickOrderItem" component={PickOrderItem} />
              <Stack.Screen name="Transfers" component={Transfers} />
              <Stack.Screen name="TransferDetails" component={TransferDetails} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Scan" component={Scan} />
              <Stack.Screen name="Products" component={Products} />
              <Stack.Screen name="PutawayList" component={PutawayList} />
              <Stack.Screen name="PutawayCandidates" component={PutawayCandidates} />
              <Stack.Screen name="PutawayItem" component={PutawayItem} />
              <Stack.Screen name="PutawayItemDetail" component={PutawayItemDetail} />
              <Stack.Screen name="PutawayDetails" component={PutawayDetails} />
              <Stack.Screen name="InboundOrderList" component={InboundOrderList} />
              <Stack.Screen name="InboundDetails" component={InboundDetails} />
              <Stack.Screen name="Product Summary" component={ProductSummary} />
              <Stack.Screen name="CreateLpn" component={CreateLpn} />
              <Stack.Screen name="LpnDetail" component={LpnDetail} />
              <Stack.Screen name="InboundReceiveDetail" component={InboundReceiveDetail} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="OutboundStockList" component={OutboundStockList} options={{ title: 'Packing' }} />
              <Stack.Screen
                name="OutboundStockDetails"
                component={OutboundStockDetails}
                options={{ title: 'Packing' }}
              />
              <Stack.Screen name="OutboundLoadingList" component={OutboundLoadingList} options={{ title: 'Loading' }} />
              <Stack.Screen
                name="OutboundLoadingDetails"
                component={OutboundLoadingDetails}
                options={{ title: 'Loading' }}
              />
              <Stack.Screen
                name="OutboundLoadingContainer"
                component={OutboundLoadingContainer}
                options={{ title: 'Load LPN' }}
              />
              <Stack.Screen name="AdjustStock" component={AdjustStock} />
              <Stack.Screen name="Transfer" component={Transfer} />
              <Stack.Screen name="ShipmentDetails" component={ShipItemDetails} options={{ title: 'Packing' }} />
              <Stack.Screen name="InternalLocationDetail" component={InternalLocationDetails} />
              <Stack.Screen name="ViewAvailableItem" component={ViewAvailableItem} />
              <Stack.Screen name="Placeholder" options={{ title: 'Work in progress' }} component={Placeholder} />
              <Stack.Screen
                name="PackingLocationPage"
                options={{ title: 'Packing Location' }}
                component={PackingLocationPage}
              />
              <Stack.Screen name="AppInfo" component={AppInfoScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.mainReducer.loggedIn,
  fullScreenLoadingIndicator: state.mainReducer.fullScreenLoadingIndicator,
  currentLocation: state.mainReducer.currentLocation,
  session: state.mainReducer.session
});

const mapDispatchToProps: DispatchProps = {
  getSessionAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
