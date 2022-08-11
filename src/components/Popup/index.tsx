import { Alert, AlertButton } from 'react-native';
import { PopupParams } from './types';

export default function showPopup(params: PopupParams) {
  let buttons: AlertButton[] = [];
  if (params.negativeButtonText) {
    buttons.push({
      text: params.negativeButtonText,
      onPress: () => {}
    });
  }
  buttons.push({
    text: params.positiveButton?.text ?? 'Ok',
    onPress: () => {
      if (params.positiveButton?.callback) {
        params.positiveButton.callback();
      }
    }
  });
  Alert.alert(params.title ?? '', params.message, buttons, {
    cancelable: false
  });
}
