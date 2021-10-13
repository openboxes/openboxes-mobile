import Product from '../../data/product/Product';
import {getProductByIdAction} from "../../redux/actions/products";

export interface OwnProps {
  exit: () => void;
  product: Product;
  route: any;
  navigation: any;
}

export interface StateProps {
  //no-op
}

export interface DispatchProps {
  getProductByIdAction: (
      id: any,
      callback: (data: any) => void,
  )=> void
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  visible: boolean
}
