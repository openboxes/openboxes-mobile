import Product from '../../data/product/Product';
import {getProductByIdAction} from "../../redux/actions/products";
import {hideScreenLoading, showScreenLoading} from "../../redux/actions/main";

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
  )=> void,
  showScreenLoading:()=> void,
  hideScreenLoading:()=> void

}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
  visible: boolean
  productDetails: any
}
