import React from 'react';
import { CommonActions, NavigationContainerRef, StackActions } from '@react-navigation/native';
import { DashboardEntry } from './screens/Dashboard/dashboardData';

type RootStackParamList = {
  Login: undefined;
  ChooseCurrentLocation: undefined;
  Orders: undefined;
  ProductDetails: undefined;
};

export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export function reset(routeName: string) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }]
    })
  );
}

export function resetToRoutes(routes: { name: string; params?: any }[]) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: routes.length - 1,
      routes
    })
  );
}

export function goBack() {
  navigationRef.current?.dispatch(CommonActions.goBack());
}

export function replace(name: string, params?: any) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export function navigateToDashboardEntry(item: DashboardEntry) {
  if (item.subroutes) {
    navigate('SubroutesEntries', {
      subroutes: item.subroutes,
      subroutesScreenName: item.subroutesScreenName ?? item.screenName
    });
  } else {
    navigate(item.navigationScreenName);
  }
}
