import React from 'react';
import {Appbar} from 'react-native-paper';
import * as NavigationService from '../../NavigationService';

export interface Props {
  title: string;
  subtitle?: string | null;
  backButtonVisible: boolean;
  onBackButtonPress?: () => void;
  // rightIcon?: IconProps;
}

export default function Header(props: Props) {
  return (
    <Appbar.Header>
      {props.backButtonVisible && (
        // <Appbar.BackAction onPress={props.onBackButtonPress} />
        <Appbar.BackAction onPress={NavigationService.goBack} />
      )}
      <Appbar.Content title={props.title} subtitle={props.subtitle} />
      {/*{props.rightIcon && (*/}
      {/*  <Appbar.Action icon={() => <Icon {...props.rightIcon!} />} />*/}
      {/*)}*/}
    </Appbar.Header>
  );
}
