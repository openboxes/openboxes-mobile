import {Props, State} from './types';
import {DetailsItemVM, VM} from './VM';
import {ProductCategory} from '../../data/product/category/ProductCategory';
import Product from "../../data/product/Product";

export function vmMapper(product: Product, state: State): VM {
  return {
    header: 'Product Details',
    name: product?.name??"",
    productCode: product.productCode??"",
    description: product.description ?? 'No description provided',
    pricePerUnit: product.pricePerUnit ?? 0.0,
    details: getDetails(product),
    category: product?.category??  { id: '', name: '', parentCategory: null },
    status: product?.status ?? 'Not Available',
    quantityAllocated: product.quantityAllocated ?? 0,
    quantityAvailable: product.quantityAvailableToPromise ?? 0,
    quantityOnHand: product.quantityOnHand ?? 0,
    quantityOnOrder: product.quantityOnOrder ?? 0,
    unitOfMeasure: product.unitOfMeasure ?? 'EA',
    attributes: product.attributes ?? [
      {code: '', value: '', name: ''},
      {code: '', value: '', name: ''},
    ],
    productType: product?.productType ?? {name: ''},
    image: product?.image ?? { id: '', name: '', uri: 'https://reactnative.dev/img/tiny_logo.png' },
    images: product?.images ?? [
      {
        id: '',
        name: '',
        url: '',
      },
    ],
    availableItems: product.availableItems
  };
}

function getDetails(product: Product): DetailsItemVM[] {
  const detailsArray: DetailsItemVM[] = [];
  detailsArray.push(getDetailsCodeItem(product));
  detailsArray.push(getDetailsCategoryItem(product));
  return detailsArray;
}

function getDetailsCodeItem(product: Product): DetailsItemVM {
  return {
    key: 'productCode',
    name: 'Product Code',
    value: product.productCode,
  };
}

function getDetailsCategoryItem(product: Product): DetailsItemVM {
  return {
    key: 'category',
    name: 'Category',
    value: getCategoryText(product.category),
  };
}

function getCategoryText(category: ProductCategory): string {
  const prefix = category?.parentCategory
    ? `${getCategoryText(category?.parentCategory)} > `
    : '';
  return `${prefix}${category?.name}`;
}
