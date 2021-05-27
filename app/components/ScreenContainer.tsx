import React from "react";
import {View, ViewProps} from "react-native";

export interface Props extends ViewProps {
  children: React.ReactNode
}

export default function ScreenContainer(props: Props) {
  return (
    <View style={{
      ...(props.style as {}),
      display: "flex",
      flexDirection: "column",
      flex: 1,
    }}>
      {props.children}
    </View>
  )
}
