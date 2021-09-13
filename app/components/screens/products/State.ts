import Product from "../../../data/product/Product";
import {ProductCategory} from "../../../data/product/category/ProductCategory";

export enum NavigationStateType {
  Here,
  ProductDetails
}

export abstract class NavigationState {
  type: NavigationStateType

  protected constructor(type: NavigationStateType) {
    this.type = type
  }
}

export class NavigationStateHere extends NavigationState {
  constructor() {
    super(NavigationStateType.Here);
  }
}

export class NavigationStateProductDetails extends NavigationState {
  product: Product

  constructor(product: Product) {
    super(NavigationStateType.ProductDetails)
    this.product = product
  }
}

export interface State {
  error: string | null
  allProducts: Product[] | null
  searchBoxVisible: boolean
  searchBoxProductCodeVisible: boolean
  categoryPickerPopupVisible: boolean
  searchByName: {
    query: string
    results: Product[] | null
  } | null
  searchByProductCode: {
    query: string
    results: Product[] | null
  } | null
  searchByCategory: {
    category: ProductCategory,
    results: Product[] | null
  } | null
  searchGlobally: {
    query: string,
    results: Product[] | null
  } | null
  navigationState: NavigationState,
  barcodeNo: string | ''
}
