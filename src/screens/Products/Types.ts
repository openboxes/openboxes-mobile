import Product from '../../data/product/Product';
import {ProductCategory} from '../../data/product/category/ProductCategory';

export interface OwnProps {
  exit: () => void;
  navigation: any;
}

export interface StateProps {
  products: any;
}

export interface DispatchProps {
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
  getProductsAction: (callback: (products: any) => void) => void;
  searchProductsByNameAction: (
    name: string,
    callback: (searchedProducts: any) => void,
  ) => void;
  searchProductByCodeAction: (
    productCode: string,
    callback: (data: any) => void,
  ) => void;
  searchProductGloballyAction: (
    value: string,
    callback: (data: any) => void,
  ) => void;
  searchProductSByCategoryAction: (
    category: any,
    callback: (data: any) => void,
  ) => void;
}

export type Types = OwnProps & StateProps & DispatchProps;

export interface State {
  error: string | null;
  allProducts: Product[] | null;
  searchBoxVisible: boolean;
  searchBoxProductCodeVisible: boolean;
  categoryPickerPopupVisible: boolean;
  searchByName: {
    query: string;
    results: Product[] | null;
  } | null;
  searchByProductCode: {
    query: string;
    results: Product[] | null;
  } | null;
  searchByCategory: {
    category: ProductCategory;
    results: Product[] | null;
  } | null;
  searchGlobally: {
    query: string;
    results: Product[] | null;
  } | null;
  barcodeNo: string | '';
}
