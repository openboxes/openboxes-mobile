import Product from '../../data/product/Product';

export interface VM {
  barcodeNo: string;
  subtitle: string;
  searchBoxVisible: boolean;
  searchBoxProductCodeVisible: boolean;
  categoryPickerPopupVisible: boolean;
  list: Product[] | null;
  floatingActionButtonVisible: boolean;
  centralErrorMessage: string | null;
}
