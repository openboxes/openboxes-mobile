import React from "react";
import {Appbar} from "react-native-paper";

export interface Props {
  title: string
}

export default function Header(props: Props) {
  return (
    <Appbar.Header>
      <Appbar.Content title={props.title}/>
    </Appbar.Header>
  )
}
