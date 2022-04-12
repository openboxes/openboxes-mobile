import React from "react";
import {Text} from "react-native";

export interface Props {
  message: string | null
}

export default function CentralMessage(props: Props) {
  return (
    props.message
      ?
      <Text>{props.message}</Text>
      :
      null
  )
}
