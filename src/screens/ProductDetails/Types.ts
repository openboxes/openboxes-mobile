import Product from '../../data/product/Product';

export interface OwnProps {
  exit: () => void;
  product: Product;
  route: any;
  navigation: any;
}

export interface StateProps {
  selectedProduct: any;
  productSummaryConfig: {
    [key: string]: boolean;
  };
}

export interface DispatchProps {
  getProductByIdAction: (id: any, callback?: (data: any) => void) => void;
  showScreenLoading: () => void;
  hideScreenLoading: () => void;
  updateProductIdentifierAction: (
    id: string,
    identifierType: string,
    identifierValue: string,
    callback?: (data: any) => void
  ) => void;
}
export interface State {
  visible: boolean;
  productDetails: Product | any;
  editBarcodeVisible: boolean;
}
export type Props = OwnProps & StateProps & DispatchProps & State;
