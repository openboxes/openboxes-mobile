/* eslint-disable react-native/no-inline-styles */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { Providers } from './components/Providers';
import FullScreenLoadingIndicator from './components/FullScreenLoadingIndicator';
import showPopup from './components/Popup';
import { appConfig } from './constants';
import { Session } from './data/auth/Session';
import Location from './data/location/Location';
import * as NavigationService from './NavigationService';
import { migrate } from './components/ProfileStorage';
import { getSessionAction } from './redux/actions/main';
import { RootState } from './redux/reducers';
import AdjustStock from './screens/AdjustStock';
import AppInfoScreen from './screens/AppInfo/AppInfoScreen';
import Dashboard from './screens/Dashboard';
import SubroutesEntries from './screens/Dashboard/SubroutesEntries';
import DrawerNavigator from './screens/DrawerNavigator';
import InboundDetails from './screens/InboundDetails';
import InboundOrderList from './screens/InboundOrderList';
import InboundReceiveDetail from './screens/InboundReceiveDetail';
import InternalLocationDetails from './screens/InternalLocationDetails';
import Login from './screens/Login';
import CreateLpn from './screens/Lpn/Create';
import LpnDetail from './screens/LpnDetail/Index';
import OrderDetails from './screens/OrderDetails';
import Orders from './screens/Orders';
import OutboundLoadingContainer from './screens/OutboundLoadingContainer';
import OutboundLoadingDetails from './screens/OutboundLoadingDetails';
import OutboundLoadingList from './screens/OutboundLoadingList/OutboundLoadingList';
import OutboundStockDetails from './screens/OutboundStockDetails';
import OutboundStockList from './screens/OutboundStockList';
import PackingLocationPage from './screens/PackingLocationPage';
import PickOrderItem from './screens/PickList';
import { PickUpEntryScreen } from './screens/PickUpAllocation/PickUpEntryScreen';
import { PickUpOrderScreen } from './screens/PickUpAllocation/PickUpOrderScreen';
import Placeholder from './screens/Placeholder';
import ProductDetails from './screens/ProductDetails';
import Products from './screens/Products';
import ProductSummary from './screens/ProductSummary';
import PutawayCandidates from './screens/PutawayCandidates';
import PutawayDetails from './screens/PutawayDetails';
import PutawayItem from './screens/PutawayItem';
import PutawayItemDetail from './screens/PutawayItemDetail';
import PutawayList from './screens/PutawayList';
import ProfilesScreen from './screens/Profiles';
import Scan from './screens/Scan';
import Settings from './screens/Settings';
import ShipItemDetails from './screens/ShipItemDetails';
import SortationContainerScreen from './screens/Sortation/SortationContainerScreen';
import SortationEntryScreen from './screens/Sortation/SortationEntryScreen';
import SortationQuantityScreen from './screens/Sortation/SortationQuantityScreen';
import SortationTaskSelectionListScreen from './screens/Sortation/SortationTaskSelectionListScreen';
import PutawayEntryScreen from './screens/SortationPutaway/PutawayEntryScreen';
import PutawayModeScreen from './screens/SortationPutaway/PutawayModeScreen';
import PutawayTaskListScreen from './screens/SortationPutaway/PutawayTaskListScreen';
import PutawayLocationScanScreen from './screens/SortationPutaway/PutawayLocationScanScreen';
import PutawayProductScanScreen from './screens/SortationPutaway/PutawayProductScanScreen';
import PutawayQuantityScreen from './screens/SortationPutaway/PutawayQuantityScreen';
import HeaderRight from './screens/TopBar/RightHeader';
import CycleCountCompleted from './screens/CycleCount/CycleCountCompleted';
import CycleCountCountConfirmation from './screens/CycleCount/CycleCountCountConfirmation';
import CycleCountListEntry from './screens/CycleCount/CycleCountListEntry';
import CycleCountLocation from './screens/CycleCount/CycleCountLocation';
import CycleCountProduct from './screens/CycleCount/CycleCountProduct';
import CycleCountQuantityAvailable from './screens/CycleCount/CycleCountQuantityAvailable';
import DiscretePickingListScreen from './screens/Picking/DiscretePickingListScreen';
import PickingPickTypeScreen from './screens/Picking/PickingPickTypeScreen';
import PickingPickLocationScreen from './screens/Picking/PickingPickLocationScreen';
import PickingPickProductScreen from './screens/Picking/PickingPickProductScreen';
import PickingPickQuantityScreen from './screens/Picking/PickingPickQuantityScreen';
import PickingPickOutboundContainerScreen from './screens/Picking/PickingPickOutboundContainerScreen';
import PickingPickStagingLocationScreen from './screens/Picking/PickingPickStagingLocationScreen';
import PickingMoveToStagingScreen from './screens/Picking/PickingMoveToStaging';
import PickingStagingDropScreen from './screens/Picking/PickingStagingDrop';
import { ReplenishmentLocationScreen } from './screens/Replenishment/ReplenishmentLocationScreen';
import { ReplenishmentProductScreen } from './screens/Replenishment/ReplenishmentProductScreen';
import ReplenishmentOutboundContainerScreen from './screens/Replenishment/ReplenishmentOutboundContainerScreen';
import ReplenishmentPickQuantityScreen from './screens/Replenishment/ReplenishmentPickQuantityScreen';
import { ReplenishmentStagingLocationScreen } from './screens/Replenishment/ReplenishmentStagingLocationScreen';
import Transfer from './screens/Transfer';
import Transfers from './screens/Transfers';
import TransferDetails from './screens/TransfersDetails';
import ViewAvailableItem from './screens/ViewAvailableItem';
import ApiClient from './utils/ApiClient';
import Theme from './utils/Theme';

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
  getSessionAction: (callback: (data: any) => void, suppressLoading?: boolean) => void;
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
                this.props.getSessionAction(actionCallback, true);
              }
            }
          });
        }
      };
      this.props.getSessionAction(actionCallback, true);
    }
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  onNavigatorReady = () => {
    migrate()
      .then((serverUrl) => {
        if (serverUrl) {
          ApiClient.setBaseUrl(serverUrl);
        } else {
          NavigationService.navigate('Profiles');
        }
      })
      .catch(() => {
        NavigationService.navigate('Profiles');
      });
  };

  render() {
    const { loggedIn } = this.props;
    const initialRouteName = !loggedIn ? 'Login' : 'Choose Location';
    return (
      <Providers>
        <SafeAreaView style={{ flex: 1 }}>
          <FullScreenLoadingIndicator
            visible={this.props.fullScreenLoadingIndicator.visible}
            message={this.props.fullScreenLoadingIndicator.message}
          />
          <NavigationContainer ref={NavigationService.navigationRef} onReady={this.onNavigatorReady}>
            <Stack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={({ route, navigation }) => ({
                headerRight: () => <HeaderRight route={route} navigation={navigation} />,
                headerTintColor: Theme.colors.surface,
                headerStyle: {
                  backgroundColor: Theme.colors.primary,
                  height: appConfig.APP_HEADER_HEIGHT
                }
              })}
            >
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  headerShown: false,
                  title: 'Login'
                }}
              />
              <Stack.Screen
                name="Drawer"
                component={DrawerNavigator}
                options={{
                  headerShown: false,
                  title: 'Home'
                }}
              />
              <Stack.Screen name="Orders" component={Orders} options={{ title: 'Orders' }} />
              <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ title: 'Order Details' }} />
              <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details' }} />
              <Stack.Screen name="PickOrderItem" component={PickOrderItem} options={{ title: 'Pick Order Item' }} />
              <Stack.Screen name="Transfers" component={Transfers} options={{ title: 'Transfers' }} />
              <Stack.Screen
                name="TransferDetails"
                component={TransferDetails}
                options={{ title: 'Transfer Details' }}
              />
              <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard' }} />
              <Stack.Screen
                name="SubroutesEntries"
                // @ts-ignore
                component={SubroutesEntries}
                // @ts-ignore
                options={({ route }) => ({ title: route.params?.subroutesScreenName })}
              />
              <Stack.Screen name="Scan" component={Scan} options={{ title: 'Scan' }} />
              <Stack.Screen name="Products" component={Products} options={{ title: 'Products' }} />
              <Stack.Screen name="PutawayList" component={PutawayList} options={{ title: 'Putaway List' }} />
              <Stack.Screen
                name="PutawayCandidates"
                component={PutawayCandidates}
                options={{ title: 'Putaway Candidates' }}
              />
              <Stack.Screen name="PutawayItem" component={PutawayItem} options={{ title: 'Putaway Item' }} />
              <Stack.Screen
                name="PutawayItemDetail"
                component={PutawayItemDetail}
                options={{ title: 'Putaway Item Detail' }}
              />
              <Stack.Screen name="PutawayDetails" component={PutawayDetails} options={{ title: 'Putaway Details' }} />
              <Stack.Screen name="InboundOrderList" component={InboundOrderList} options={{ title: 'Receiving' }} />
              <Stack.Screen name="InboundDetails" component={InboundDetails} options={{ title: 'Inbound Details' }} />
              <Stack.Screen name="Product Summary" component={ProductSummary} options={{ title: 'Product Summary' }} />
              <Stack.Screen name="CreateLpn" component={CreateLpn} options={{ title: 'Create LPN' }} />
              <Stack.Screen name="LpnDetail" component={LpnDetail} options={{ title: 'LPN Details' }} />
              <Stack.Screen
                name="InboundReceiveDetail"
                component={InboundReceiveDetail}
                options={{ title: 'Receive Detail' }}
              />
              <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
              <Stack.Screen name="Profiles" component={ProfilesScreen} options={{ title: 'Server Profiles' }} />
              <Stack.Screen name="OutboundStockList" component={OutboundStockList} options={{ title: 'Packing' }} />
              <Stack.Screen
                name="OutboundStockDetails"
                component={OutboundStockDetails}
                options={{ title: 'Packing Details' }}
              />
              <Stack.Screen name="OutboundLoadingList" component={OutboundLoadingList} options={{ title: 'Loading' }} />
              <Stack.Screen
                name="OutboundLoadingDetails"
                component={OutboundLoadingDetails}
                options={{ title: 'Loading Details' }}
              />
              <Stack.Screen
                name="OutboundLoadingContainer"
                component={OutboundLoadingContainer}
                options={{ title: 'Load LPN' }}
              />
              <Stack.Screen name="AdjustStock" component={AdjustStock} options={{ title: 'Adjust Stock' }} />
              <Stack.Screen name="Transfer" component={Transfer} options={{ title: 'Transfer' }} />
              <Stack.Screen
                name="ShipmentDetails"
                component={ShipItemDetails}
                options={{ title: 'Shipment Details' }}
              />
              <Stack.Screen
                name="InternalLocationDetail"
                component={InternalLocationDetails}
                options={{ title: 'Location Details' }}
              />
              <Stack.Screen
                name="ViewAvailableItem"
                component={ViewAvailableItem}
                options={{ title: 'Available Item' }}
              />
              <Stack.Screen name="Placeholder" component={Placeholder} options={{ title: 'Work in Progress' }} />
              <Stack.Screen
                name="PackingLocationPage"
                component={PackingLocationPage}
                options={{ title: 'Packing Location' }}
              />
              <Stack.Screen name="AppInfo" component={AppInfoScreen} options={{ title: 'App Info' }} />
              <Stack.Screen
                name="Sortation"
                component={SortationEntryScreen}
                options={{ title: 'Inbound Sortation' }}
              />
              <Stack.Screen
                name="SortationQuantity"
                component={SortationQuantityScreen}
                options={{ title: 'Inbound Sortation' }}
              />
              <Stack.Screen
                name="SortationContainer"
                component={SortationContainerScreen}
                options={{ title: 'Inbound Sortation' }}
              />
              <Stack.Screen
                name="SortationTaskList"
                component={SortationTaskSelectionListScreen}
                options={{ title: 'Inbound Sortation' }}
              />
              <Stack.Screen name="SortationPutaway" component={PutawayEntryScreen} options={{ title: 'Putaway' }} />
              <Stack.Screen
                name="SortationPutawayMode"
                component={PutawayModeScreen}
                options={{ title: 'Putaway Mode' }}
              />
              <Stack.Screen
                name="SortationPutawayTaskList"
                component={PutawayTaskListScreen}
                options={{ title: 'Putaway Tasks' }}
              />
              <Stack.Screen
                name="SortationPutawayLocationScan"
                component={PutawayLocationScanScreen}
                options={{ title: 'Putaway Details' }}
              />
              <Stack.Screen
                name="SortationPutawayProductScan"
                component={PutawayProductScanScreen}
                options={{ title: 'Putaway Details' }}
              />
              <Stack.Screen
                name="SortationPutawayQuantity"
                component={PutawayQuantityScreen}
                options={{ title: 'Putaway Details' }}
              />
              <Stack.Screen
                name="DiscretePickingList"
                component={DiscretePickingListScreen}
                options={{ title: 'Discrete Picking' }}
              />
              <Stack.Screen
                name="PickingPickType"
                component={PickingPickTypeScreen}
                options={{ title: 'Pick Type & Grouping' }}
              />
              <Stack.Screen
                name="PickingPickLocation"
                component={PickingPickLocationScreen}
                options={{ title: 'Pick Location' }}
              />
              <Stack.Screen
                name="PickingPickProduct"
                component={PickingPickProductScreen}
                options={{ title: 'Pick Product' }}
              />
              <Stack.Screen
                name="PickingPickQuantity"
                component={PickingPickQuantityScreen}
                options={{ title: 'Pick Quantity' }}
              />
              <Stack.Screen
                name="PickingPickOutboundContainer"
                component={PickingPickOutboundContainerScreen}
                options={{ title: 'Pick Outbound Container' }}
              />
              <Stack.Screen
                name="PickingPickStagingLocation"
                component={PickingPickStagingLocationScreen}
                options={{ title: 'Pick Staging Location' }}
              />
              <Stack.Screen
                name="PickingMoveToStaging"
                component={PickingMoveToStagingScreen}
                options={{ title: 'Move To Staging' }}
              />
              <Stack.Screen
                name="PickingStagingDrop"
                component={PickingStagingDropScreen}
                options={{ title: 'Staging Location Drop' }}
              />
              <Stack.Screen
                name="ReplenishmentPickingLocation"
                component={ReplenishmentLocationScreen}
                options={{ title: 'Replenishment Location' }}
              />
              <Stack.Screen
                name="ReplenishmentProduct"
                component={ReplenishmentProductScreen}
                options={{ title: 'Replenishment Product' }}
              />
              <Stack.Screen
                name="ReplenishmentPickQuantity"
                component={ReplenishmentPickQuantityScreen}
                options={{ title: 'Replenishment Quantity' }}
              />
              <Stack.Screen
                name="ReplenishmentOutboundContainer"
                component={ReplenishmentOutboundContainerScreen}
                options={{ title: 'Replenishment Outbound Container' }}
              />
              <Stack.Screen
                name="ReplenishmentStagingLocation"
                component={ReplenishmentStagingLocationScreen}
                options={{ title: 'Replenishment Staging Location' }}
              />
              <Stack.Screen
                name="PickUpEntryScreen"
                component={PickUpEntryScreen}
                options={{ title: 'Pick Up Allocation' }}
              />
              <Stack.Screen
                name="PickUpOrderScreen"
                component={PickUpOrderScreen}
                options={{ title: 'Pick Up Allocation' }}
              />
              <Stack.Screen
                name="CycleCountListEntry"
                component={CycleCountListEntry}
                options={{ title: 'Cycle Count List Entry' }}
              />
              <Stack.Screen
                name="CycleCountLocation"
                component={CycleCountLocation}
                options={{ title: 'Cycle Count Location' }}
              />
              <Stack.Screen
                name="CycleCountProduct"
                component={CycleCountProduct}
                options={{ title: 'Cycle Count Product' }}
              />
              <Stack.Screen
                name="CycleCountQuantityAvailable"
                component={CycleCountQuantityAvailable}
                options={{ title: 'Cycle Count Quantity Available' }}
              />
              <Stack.Screen
                name="CycleCountCountConfirmation"
                component={CycleCountCountConfirmation}
                options={{ title: 'Cycle Count Count Confirmation' }}
              />
              <Stack.Screen
                name="CycleCountCompleted"
                component={CycleCountCompleted}
                options={{ title: 'Cycle Count Completed' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </Providers>
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
