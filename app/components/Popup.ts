import {Alert} from "react-native";

export default function showPopup(
  message: string,
  title: string = "",
  buttonText: string = "Ok",
  buttonCallback?: () => void
) {
  Alert.alert(
    title,
    message,
    [
      {
        text: buttonText,
        onPress: () => buttonCallback?.()
      }
    ],
    {cancelable: false}
  )
}
