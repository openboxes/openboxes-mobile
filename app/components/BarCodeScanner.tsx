import React from "react";
// @ts-ignore
import {Block, Button, Text} from "galio-framework";
import {StyleSheet} from "react-native";
import {AppState} from "../redux/Reducer";
import {connect} from "react-redux";
import {PermissionType, requestPermission} from "../utils/permissions/RequestPermission";
import {Camera} from "expo-camera";
import {BarCodeScanningResult} from "expo-camera/build/Camera.types";

export interface OwnProps {
  onBarCodeScanned: (data: string) => void
}

interface StateProps {

}

interface DispatchProps {

}

type Props = OwnProps & StateProps & DispatchProps;


interface State {
  cameraPermissionGranted: boolean | null;
}

class BarCodeScanner extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      cameraPermissionGranted: null
    }
    this.getCameraPermission = this.getCameraPermission.bind(this);
    this.onBarCodeScanned = this.onBarCodeScanned.bind(this)
  }

  componentDidMount() {
    this.getCameraPermission()
  }

  getCameraPermission() {
    (async () => {
      const granted = await requestPermission({
        type: PermissionType.CAMERA,
        reason: "Bar code scanner needs camera access",
        notGrantedErrorMessage: "Cannot read bar code without camera access"
      })
      this.setState({
        cameraPermissionGranted: granted
      })
    })();
  }

  onBarCodeScanned(result: BarCodeScanningResult) {
    this.props.onBarCodeScanned(result.data)
  }

  render() {
    let content;
    switch (this.state.cameraPermissionGranted) {
      case null:
      case false:
        content =
          <Block flex middle>
            <Text>Can't scan bar code without camera permission</Text>
            <Button onPress={this.getCameraPermission}>Give permission</Button>
          </Block>
        break;
      case true:
        content =
          <Camera
            onBarCodeScanned={this.onBarCodeScanned}
            ratio="16:9"
            style={StyleSheet.absoluteFillObject}
          />;
        break;
    }
    return (content)
  }
}

const mapStateToProps = (state: AppState): StateProps => ({});

const mapDispatchToProps: DispatchProps = {};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(BarCodeScanner);
