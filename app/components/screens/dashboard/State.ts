export enum NavigationState {
  Here,
  ProductsScreen,
  OrdersScreen,
  PutAwayListScreen
}

export interface State {
  navigationState: NavigationState
}
