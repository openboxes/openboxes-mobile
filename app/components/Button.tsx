import {View} from "react-native";
import React from "react";
import {Button as PaperButton} from "react-native-paper"

export interface Props {
  title: string
  onPress?: () => void
}

export default function Button(props: Props) {
  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 8
    }}>
      <PaperButton
        onPress={props.onPress}
        mode="contained"
        style={{
          padding: 4
        }}
        compact={true}
      >
        {props.title}
      </PaperButton>
    </View>
  )
}
