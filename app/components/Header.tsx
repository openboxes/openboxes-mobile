import React from "react";
import {Appbar} from "react-native-paper";
import Icon, {Props as IconProps} from "./Icon";

export interface Props {
  title: string
  subtitle?: string | null
  backButtonVisible: boolean
  onBackButtonPress?: () => void
  rightIcon?: IconProps
}

export default function Header(props: Props) {
  return (
    <Appbar.Header>
      {
        props.backButtonVisible && <Appbar.BackAction onPress={props.onBackButtonPress}/>
      }
      <Appbar.Content
        title={props.title}
        subtitle={props.subtitle}
      />
      {
        props.rightIcon
        &&
        <Appbar.Action icon={() => <Icon {...props.rightIcon!}/>}/>
      }
    </Appbar.Header>
  )
}
