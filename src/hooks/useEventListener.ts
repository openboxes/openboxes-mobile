import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import DataWedgeIntents from 'react-native-datawedge-intents';
import {
  ACTION,
  FILTER_ACTIONS,
  FILTER_CATEGORY,
  LISTENER,
  PROFILE,
  PROFILE_CONFIG,
  PROFILE_CONFIG2,
  PROPERTY,
  VERSION
} from './constant';
import { useDispatch } from 'react-redux';

const useEventListener = () => {
  const [event, setEvent] = React.useState('');
  const dispatch = useDispatch();
  const [state, setState] = React.useState<any>({
    ean8checked: true,
    ean13checked: true,
    code39checked: true,
    code128checked: true,
    lastApiVisible: false,
    lastApiText: 'Messages from DataWedge will go here',
    checkBoxesDisabled: true,
    scanButtonVisible: false,
    dwVersionText:
      'Pre 6.3.  Please create and configure profile manually.  See the ReadMe for more details',
    activeProfileText: 'Requires DataWedge 6.3+',
    enumeratedScannersText: 'Requires DataWedge 6.3+',
    scans: [],
    data: {},
    sendCommandResult: 'false'
  });
  const broadcastReceiver = (intent: any) => {
    //  Broadcast received
    if (intent.hasOwnProperty(PROPERTY.RESULT_INFO)) {
      var commandResult =
        intent.RESULT +
        ' (' +
        intent.COMMAND.substring(
          intent.COMMAND.lastIndexOf('.') + 1,
          intent.COMMAND.length
        ) +
        ')'; // + JSON.stringify(intent.RESULT_INFO);
      commandReceived(commandResult.toLowerCase());
    }

    if (intent.hasOwnProperty(PROPERTY.VERSION_INFO)) {
      //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX
      var versionInfo = intent[PROPERTY.VERSION_INFO];
      var datawedgeVersion = versionInfo[PROPERTY.DATAWEDGE];
      //  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
      if (datawedgeVersion >= VERSION.V06_3) {
        datawedge63();
      }
      if (datawedgeVersion >= VERSION.V06_4) {
        datawedge64();
      }
      if (datawedgeVersion >= VERSION.V06_5) {
        datawedge65();
      }
    } else if (intent.hasOwnProperty(PROPERTY.RESULT_ENUMERATED_SCANNER)) {
      //  Return from our request to enumerate the available scanners
      var enumeratedScannersObj = intent[PROPERTY.RESULT_ENUMERATED_SCANNER];
      enumerateScanners(enumeratedScannersObj);
    } else if (intent.hasOwnProperty(PROPERTY.ACTIVE_PROFILE)) {
      //  Return from our request to obtain the active profile
      var activeProfileObj = intent[PROPERTY.ACTIVE_PROFILE];
      activeProfile(activeProfileObj);
    } else if (!intent.hasOwnProperty(PROPERTY.RESULT_INFO)) {
      //  A barcode has been scanned
      barcodeScanned(intent, new Date().toLocaleString());
    }
  };

  React.useEffect(() => {
    const callback = (intent: any) => {
      setEvent(intent);
      broadcastReceiver(intent);
    };

    DeviceEventEmitter.addListener(LISTENER.BROADCAST_INTENT, callback);
    DeviceEventEmitter.addListener(LISTENER.BARCODE_SCAN, callback);
    DeviceEventEmitter.addListener(LISTENER.ENUMERATED_SCANNER, callback);
    registerBroadcastReceiver();
    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, [broadcastReceiver, event]);

  const registerBroadcastReceiver = () => {
    DataWedgeIntents.registerBroadcastReceiver({
      filterActions: FILTER_ACTIONS,
      filterCategories: FILTER_CATEGORY
    });
  };

  const datawedge63 = () => {
    //  Create a profile for our application
    sendCommand(PROFILE.CREATE_PROFILE, PROFILE.NAME);

    state.dwVersionText =
      '6.3.  Please configure profile manually.  See ReadMe for more details.';

    //  Although we created the profile we can only configure it with DW 6.4.
    sendCommand(PROFILE.ACTIVE_PROFILE, '');

    //  Enumerate the available scanners on the device
    sendCommand(PROFILE.ENUMERATE_PROFILE, '');

    //  Functionality of the scan button is available
    state.scanButtonVisible = true;
  };

  const datawedge64 = () => {
    //  Documentation states the ability to set a profile config is only available from DW 6.4.
    //  For our purposes, this includes setting the decoders and configuring the associated app / output params of the profile.
    state.dwVersionText = '6.4.';
    //document.getElementById('info_datawedgeVersion').classList.remove("attention");
    //  Decoders are now available
    state.checkBoxesDisabled = false;
    //  Configure the created profile (associated app and keyboard plugin)
    sendCommand(PROFILE.SET_CONFIG_PROFILE, PROFILE_CONFIG);
    //  Configure the created profile (intent plugin)
    sendCommand(PROFILE.SET_CONFIG_PROFILE, PROFILE_CONFIG2);
    //  Give some time for the profile to settle then query its value
    setTimeout(() => {
      sendCommand(PROFILE.ACTIVE_PROFILE, '');
    }, 1000);
  };

  const sendCommand = (extraName: string, extraValue: any) => {
    var broadcastExtras: any = {};
    broadcastExtras[extraName] = extraValue;
    broadcastExtras.SEND_RESULT = state.sendCommandResult;
    DataWedgeIntents.sendBroadcastWithExtras({
      action: ACTION.API_ACTION,
      extras: broadcastExtras
    });
  };

  const datawedge65 = () => {
    state.dwVersionText = '6.5 or higher.';
    //  Instruct the API to send
    state.sendCommandResult = 'true';
    state.lastApiVisible = true;
    setState({ ...state });
  };

  const commandReceived = (commandText: string) => {
    state.lastApiText = commandText;
    setState({ ...state });
  };

  const enumerateScanners = (enumeratedScanners: any) => {
    var humanReadableScannerList = '';
    for (var i = 0; i < enumeratedScanners.length; i++) {
      humanReadableScannerList += enumeratedScanners[i].SCANNER_NAME;
      if (i < enumeratedScanners.length - 1) {
        humanReadableScannerList += ', ';
      }
    }
    state.enumeratedScannersText = humanReadableScannerList;
  };

  const activeProfile = (theActiveProfile: string) => {
    state.activeProfileText = theActiveProfile;
    setState({ ...state });
  };

  const barcodeScanned = (scanData: any, timeOfScan: string) => {
    var scannedData = scanData[ACTION.DATA_STRING] ?? scanData.data;
    var scannedType = scanData[ACTION.LABEL_TYPE] ?? scanData.labelType;
    if (scannedData && scannedType) {
      let dataScanned = {
        data: scannedData,
        decoder: scannedType,
        timeAtDecode: timeOfScan
      };
      state.data = dataScanned;
      state.scans.unshift(dataScanned);
      setState({ ...state });
    }
  };
  return state.data;
};
export default useEventListener;
