import Product from "../../../data/product/Product";
import {NavigationState} from "./State";

export interface VM {
  subtitle: string
  searchBoxVisible: boolean
  categoryPickerPopupVisible: boolean
  list: Product[] | null
  floatingActionButtonVisible: boolean
  centralErrorMessage: string | null
  navigationState: NavigationState
}
