import {Props, State} from './Types';
import {DetailsItemVM, VM} from './VM';
import {ProductCategory} from '../../data/product/category/ProductCategory';

export function vmMapper(props: Props, state: State): VM {
  console.log(444444444, props)
  return {
    header: 'Product Details',
    name: props?.product?.name,
    productCode: props.product.productCode,
    description: props.product.description ?? 'No description provided',
    pricePerUnit: props.product.pricePerUnit ?? 0.0,
    details: getDetails(props),
    category: props.product.category,
    availability: props.product.availability ?? {
      quantityAvailableToPromise: {
        value: 0,
        unitOfMeasure: {code: '', name: ''},
      },
      quantityOnHand: {value: 0, unitOfMeasure: {code: '', name: ''}},
      quantityAllocated: {value: 0, unitOfMeasure: {code: '', name: ''}},
      quantityOnOrder: {value: 0, unitOfMeasure: {code: '', name: ''}},
    },
    attributes: props.product.attributes ?? [
      {code: 'Sample_1', value: 'Sample value 1', name: 'Attribute 1'},
      {code: 'Sample_2', value: 'Sample value 2', name: 'Attribute 2'},
    ],
    productType: props.product.productType ?? {name: 'Sample Name'},
    images: props.product.images ?? [
      {
        id: '',
        name: 'Sample Image',
        url: 'https://off.com.ph/en-ph/product/off-overtime/off-overtime-insect-repellent-lotion',
      },
    ],
  };
}

function getDetails(props: Props): DetailsItemVM[] {
  const detailsArray: DetailsItemVM[] = [];
  detailsArray.push(getDetailsCodeItem(props));
  detailsArray.push(getDetailsCategoryItem(props));
  return detailsArray;
}

function getDetailsCodeItem(props: Props): DetailsItemVM {
  return {
    key: 'code',
    name: 'Code',
    value: props.product.productCode,
  };
}

function getDetailsCategoryItem(props: Props): DetailsItemVM {
  return {
    key: 'category',
    name: 'Category',
    value: getCategoryText(props.product.category),
  };
}

function getCategoryText(category: ProductCategory): string {
  const prefix = category.parentCategory
    ? `${getCategoryText(category.parentCategory)} > `
    : '';
  return `${prefix}${category.name}`;
}
