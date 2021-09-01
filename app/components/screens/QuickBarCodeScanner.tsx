import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Button, FlatList} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {DispatchProps, OwnProps, Props, StateProps} from "./products/Props";
import {BarCodeScanningResult} from "expo-camera/build/Camera.types";
import {AppState} from "../../redux/Reducer";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../redux/Dispatchers";
import {connect} from "react-redux";
import {Input} from "react-native-elements";

interface State {
  hasPermission: boolean | null;
  scanned: boolean | null;
  cameraPermissionGranted: boolean | null;
  barcodeNo: string | '';
  barCodes: string[] | []
}

class  QuickBarCodeScanner  extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      hasPermission: false,
      scanned: false,
      cameraPermissionGranted: false,
      barcodeNo: '',
      barCodes: []
    }
    this.getCameraPermission = this.getCameraPermission.bind(this);
    this.setHasPermission = this.setHasPermission.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.changeBarcode = this.changeBarcode.bind(this)
    this.submitBarcode = this.submitBarcode.bind(this)
    this.setBarcodeNo = this.setBarcodeNo.bind(this)
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

  changeBarcode(barcode:string){
    // some validations
    this.setBarcodeNo(barcode);
  }

  submitBarcode() {
    // handleBarcodeScan(barcodeNo);
    const bCodes = this.state.barCodes
    bCodes.push({'key': this.state.barcodeNo})
    console.debug("bCodes::"+bCodes)
    console.debug(bCodes)
    this.setState({
      barCodes: bCodes
    })
    this.setBarcodeNo('');
  }

  setBarcodeNo(barcode:string){
    this.setState({
      barcodeNo: barcode
    })
  }



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
      <Input
        value={this.state.barcodeNo}
        onChangeText={this.changeBarcode}
        onSubmitEditing={this.submitBarcode}
      />

      <FlatList
        data={this.state.barCodes}
        renderItem={({item}) =>
          <View><Text >{item.key}</Text></View>
        }

        style={styles.list}
      />

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
  list: {
    width: "100%"
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

