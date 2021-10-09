import React from "react";
import {Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, TouchableHighlight, Alert} from "react-native";
import {CheckBox, Button} from 'react-native-elements'
import Header from "../../Header";
import {AppState} from "../../../redux/Reducer";
import {connect} from "react-redux";
import Icon, {Name} from "../../Icon";
import Theme from "../../../utils/Theme";
import Products from "../products/Products";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {NavigationState, State} from "./State";
import ScreenContainer from "../../ScreenContainer";
import Orders from "../orders/Orders";
import { DeviceEventEmitter } from 'react-native';
import DataWedgeIntents from 'react-native-datawedge-intents'

class Dashboard extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    console.log("constructor");
    this.state = {
      navigationState: NavigationState.Here,
      ean8checked: true,
      ean13checked: true,
      code39checked: true,
      code128checked: true,
      lastApiVisible: false,
      lastApiText: "Messages from DataWedge will go here",
      checkBoxesDisabled: true,
      scanButtonVisible: false,
      dwVersionText: "Pre 6.3.  Please create and configure profile manually.  See the ReadMe for more details",
      dwVersionTextStyle: styles.itemTextAttention,
      activeProfileText: "Requires DataWedge 6.3+",
      enumeratedScannersText: "Requires DataWedge 6.3+",
      scans: [],
    }
    this.renderContent = this.renderContent.bind(this)
    this.goToProductsScreen = this.goToProductsScreen.bind(this)
    this.goToOrdersScreen = this.goToOrdersScreen.bind(this)
    this.renderProductsScreen = this.renderProductsScreen.bind(this)
    this.renderOrdersScreen = this.renderOrdersScreen.bind(this)
    this.showDashboardContent = this.showDashboardContent.bind(this)
    this.sendCommandResult = "false";
  }

  componentDidMount() {
    console.log("componentDidMount");
      this.state.deviceEmitterSubscription = DeviceEventEmitter.addListener('datawedge_broadcast_intent', (intent) => {this.broadcastReceiver(intent)});
      this.registerBroadcastReceiver();
      this.determineVersion();
  }

  componentWillUnmount() {
    //this.state.deviceEmitterSubscription.remove();
  }

  _onPressScanButton() {
    this.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", 'TOGGLE_SCANNING');
  }

  determineVersion() {
    this.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");
  }

  setDecoders() {
    //  Set the new configuration
    var profileConfig = {
        "PROFILE_NAME": "ZebraReactNativeDemo",
        "PROFILE_ENABLED": "true",
        "CONFIG_MODE": "UPDATE",
        "PLUGIN_CONFIG": {
            "PLUGIN_NAME": "BARCODE",
            "PARAM_LIST": {
                //"current-device-id": this.selectedScannerId,
                "scanner_selection": "auto",
                "decoder_ean8": "" + this.state.ean8checked,
                "decoder_ean13": "" + this.state.ean13checked,
                "decoder_code128": "" + this.state.code128checked,
                "decoder_code39": "" + this.state.code39checked
            }
        }
    };
    this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);
  }

  sendCommand(extraName, extraValue) {
    console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
    var broadcastExtras = {};
    broadcastExtras[extraName] = extraValue;
    broadcastExtras["SEND_RESULT"] = this.sendCommandResult;
    DataWedgeIntents.sendBroadcastWithExtras({
        action: "com.symbol.datawedge.api.ACTION",
        extras: broadcastExtras});
  }

  registerBroadcastReceiver() {
    console.log("registerBroadcastReceiver");
    DataWedgeIntents.registerBroadcastReceiver({
      filterActions: [
          'com.zebra.reactnativedemo.ACTION',
          'com.symbol.datawedge.api.RESULT_ACTION'
      ],
      filterCategories: [
          'android.intent.category.DEFAULT'
      ]
    });
  }

  broadcastReceiver(intent)
  {
    alert("test");
    //  Broadcast received
    console.log('Received Intent: ' + JSON.stringify(intent));
    if (intent.hasOwnProperty('RESULT_INFO')) {
        var commandResult = intent.RESULT + " (" +
            intent.COMMAND.substring(intent.COMMAND.lastIndexOf('.') + 1, intent.COMMAND.length) + ")";// + JSON.stringify(intent.RESULT_INFO);
        this.commandReceived(commandResult.toLowerCase());
    }

    if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_VERSION_INFO')) {
        //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX
        var versionInfo = intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
        console.log('Version Info: ' + JSON.stringify(versionInfo));
        var datawedgeVersion = versionInfo['DATAWEDGE'];
        console.log("Datawedge version: " + datawedgeVersion);

        //  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
//         if (datawedgeVersion >= "06.3")
//             this.datawedge63();
//         if (datawedgeVersion >= "06.4")
//             this.datawedge64();
//         if (datawedgeVersion >= "06.5")
//             this.datawedge65();

        this.setState(this.state);
    }
    else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS')) {
        //  Return from our request to enumerate the available scanners
        var enumeratedScannersObj = intent['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
        this.enumerateScanners(enumeratedScannersObj);
    }
    else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
        //  Return from our request to obtain the active profile
        var activeProfileObj = intent['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
        this.activeProfile(activeProfileObj);
    }
    else if (!intent.hasOwnProperty('RESULT_INFO')) {
        //  A barcode has been scanned
        this.barcodeScanned(intent, new Date().toLocaleString());
    }
  }

  commandReceived(commandText) {
    this.state.lastApiText = commandText;
    this.setState(this.state);
  }

  enumerateScanners(enumeratedScanners) {
    var humanReadableScannerList = "";
    for (var i = 0; i < enumeratedScanners.length; i++)
    {
        console.log("Scanner found: name= " + enumeratedScanners[i].SCANNER_NAME + ", id=" + enumeratedScanners[i].SCANNER_INDEX + ", connected=" + enumeratedScanners[i].SCANNER_CONNECTION_STATE);
        humanReadableScannerList += enumeratedScanners[i].SCANNER_NAME;
        if (i < enumeratedScanners.length - 1)
            humanReadableScannerList += ", ";
    }
    this.state.enumeratedScannersText = humanReadableScannerList;
  }

  activeProfile(theActiveProfile) {
    this.state.activeProfileText = theActiveProfile;
    this.setState(this.state);
  }

  barcodeScanned(scanData, timeOfScan) {
    var scannedData = scanData["com.symbol.datawedge.data_string"];
    var scannedType = scanData["com.symbol.datawedge.label_type"];
    console.log("Scan: " + scannedData);
    this.state.scans.unshift({ data: scannedData, decoder: scannedType, timeAtDecode: timeOfScan });
    console.log(this.state.scans);
    this.setState(this.state);
  }



  render() {
    switch (this.state.navigationState) {
      case NavigationState.Here:
        return this.renderContent()
      case NavigationState.ProductsScreen:
        return this.renderProductsScreen()
      case NavigationState.OrdersScreen:
        return this.renderOrdersScreen()
    }
  }

  renderContent() {
    return (
      <ScreenContainer>
        <Header
          title="Dashboard"
          backButtonVisible={false}
        />
        <TouchableOpacity
          style={styles.countContainer}
          onPress={this.goToProductsScreen}
        >
          <View style={styles.countLabelAndIconContainer}>
            <Icon name={Name.Boxes} size={14}/>
            <Text style={styles.countLabel}>Products</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.countContainer}
          onPress={this.goToOrdersScreen}
        >
          <View style={styles.countLabelAndIconContainer}>
            <Icon name={Name.Boxes} size={14}/>
            <Text style={styles.countLabel}>Orders</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.itemHeading}>Scanned barcodes will be displayed here:</Text>

          <FlatList
            data={this.state.scans}
            extraData={this.state}
            keyExtractor={item => item.timeAtDecode}
            renderItem={({item, separators}) => (
              <TouchableHighlight
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{
                backgroundColor: '#0077A0',
                margin:10,
                borderRadius: 5,
              }}>
              <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={styles.scanDataHead}>{item.decoder}</Text>
              <View style={{flex: 1}}>
                <Text style={styles.scanDataHeadRight}>{item.timeAtDecode}</Text>
              </View>
              </View>
              <Text style={styles.scanData}>{item.data}</Text>
              </View>
            </TouchableHighlight>
            )}
          />
        </View>
      </ScreenContainer>
    )
  }

  goToProductsScreen() {
    this.setState({
      navigationState: NavigationState.ProductsScreen
    })
  }
  goToOrdersScreen() {
    this.setState({
      navigationState: NavigationState.OrdersScreen
    })
  }

  renderProductsScreen() {
    return (<Products exit={this.showDashboardContent}/>)
  }

  renderOrdersScreen() {
    return (<Orders exit={this.showDashboardContent}/>)
  }

  showDashboardContent() {
    this.setState({
      navigationState: NavigationState.Here
    })
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  countContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    borderRadius: 4,
    padding: 8
  },
  countLabelAndIconContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 0,
    alignItems: "center"
  },
  countLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginStart: 4
  }
});

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  //no-op
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Dashboard);
