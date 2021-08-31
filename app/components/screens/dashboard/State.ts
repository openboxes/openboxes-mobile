export enum NavigationState {
  Here,
  ProductsScreen,
  QuickBarCodeScannerScreen
}

export interface State {
  navigationState: NavigationState
}
