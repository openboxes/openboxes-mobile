import { Alert } from "react-native";

export default function showPopup(message, buttonText, buttonCallback) {
  if(!message) {
    throw Error("message not provided");
  }
  if(!buttonText) {
    buttonText = "Ok";
  }
  Alert.alert(
    null,
    message,
    [
      {
        text: buttonText,
        onPress: () => {
          if(buttonCallback) buttonCallback()
        }
      }
    ],
    { cancelable: false }
  )
}
