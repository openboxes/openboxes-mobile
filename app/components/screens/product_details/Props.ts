import Product from "../../../data/product/Product";

export interface OwnProps {
  exit: () => void
  product: Product
}

export interface StateProps {
  //no-op
}

export interface DispatchProps {
  showProgressBar: (message?: string) => void
  hideProgressBar: () => void
}

export type Props = OwnProps & StateProps & DispatchProps
