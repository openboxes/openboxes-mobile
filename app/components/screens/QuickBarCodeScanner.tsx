import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {DispatchProps, OwnProps, Props, StateProps} from "./products/Props";
import {VM} from "./products/VM";
import {PermissionType, requestPermission} from "../../utils/permissions/RequestPermission";
import {BarCodeScanningResult} from "expo-camera/build/Camera.types";
import {AppState} from "../../redux/Reducer";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../redux/Dispatchers";
import {connect} from "react-redux";
import vmMapper from "./products/VMMapper";
import {NavigationStateProductDetails, NavigationStateType} from "./products/State";

interface State {
  hasPermission: boolean | null;
  scanned: boolean | null;
  cameraPermissionGranted: boolean | null;
}

class  QuickBarCodeScanner  extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      hasPermission: false,
      scanned: false,
      cameraPermissionGranted: false
    }
    this.getCameraPermission = this.getCameraPermission.bind(this);
    this.setHasPermission = this.setHasPermission.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this)
    this.getCameraPermission()


  }

  setHasPermission(granted: boolean){
    console.debug("granted::"+granted)
    this.setState({
      cameraPermissionGranted: granted,
      hasPermission: granted
    })
  }
  setScanned(isScanned: boolean){
    this.setState({
      scanned: isScanned
    })
  }
  // const [hasPermission, setHasPermission] = useState(null);
  // const [scanned, setScanned] = useState(false);
  //
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);
  //
  handleBarCodeScanned(result: BarCodeScanningResult) {
    this.setState({
      scanned: true
    })
    console.debug(`Bar code with type ${result.type} and data ${result.data} has been scanned!`)
    return <Text>`Bar code with type ${result.type} and data ${result.data} has been scanned!`</Text>;
  }

  // if (hasPermission === null) {
  //   return <Text>Requesting for camera permission</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  getCameraPermission() {

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      console.debug("status::"+status)
      this.setHasPermission(status === 'granted' ? true : false);
    })();

    // (async () => {
    //   const granted = await requestPermission({
    //     type: PermissionType.CAMERA,
    //     reason: "Bar code scanner needs camera access",
    //     notGrantedErrorMessage: "Cannot read bar code without camera access"
    //   })
    //   this.setState({
    //     cameraPermissionGranted: granted,
    //     hasPermission: granted
    //   })
    // })();
  }

  // onBarCodeScanned(result: BarCodeScanningResult) {
  //   this.props.onBarCodeScanned(result.data)
  // }

  render() {
    // const vm = vmMapper(this.state)
    // switch (vm.navigationState.type) {
    //   case NavigationStateType.Here:
        return this.renderContent();
      // case NavigationStateType.ProductDetails:
      //   const navigationStateProductDetails = vm.navigationState as NavigationStateProductDetails
      //   return this.renderProductDetailsScreen(navigationStateProductDetails.product);
    }


  renderContent() {
  return(
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={this.handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {<Button title={'Tap to Scan Again'} onPress={() => this.setScanned(false)} />}
    </View>
  )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(QuickBarCodeScanner);

