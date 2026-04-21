import Product from '../../data/product/Product';
import { ProductCategory } from '../../data/product/category/ProductCategory';

export interface OwnProps {
  exit: () => void;
  navigation: any;
}

export interface StateProps {
  products: any;
}

export interface DispatchProps {
  getProductsAction: (callback: (products: any) => void, suppressLoading?: boolean) => void;
  searchProductsByNameAction: (
    name: string,
    callback: (searchedProducts: any) => void,
    suppressLoading?: boolean
  ) => void;
  searchProductByCodeAction: (
    productCode: string,
    callback: (data: any) => void,
    suppressLoading?: boolean
  ) => void;
  searchProductGloballyAction: (
    value: string,
    callback: (data: any) => void,
    suppressLoading?: boolean
  ) => void;
  searchProductSByCategoryAction: (
    category: any,
    callback: (data: any) => void,
    suppressLoading?: boolean
  ) => void;
}

export type Props = OwnProps & StateProps & DispatchProps;

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
  loading: boolean;
  searchTerm: string;
}
