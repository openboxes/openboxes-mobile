import React from 'react';
import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  ChooseCurrentLocation: undefined;
  Orders: undefined;
  ProductDetails: undefined;
};

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export function reset(routeName: string) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: routeName}],
    }),
  );
}
export function goBack() {
  navigationRef.current?.dispatch(CommonActions.goBack());
}
