import {Props} from "./Props";
import {State} from "./State";
import {DetailsItemVM, VM} from "./VM";
import {ProductCategory} from "../../../data/product/category/ProductCategory";

export function vmMapper(props: Props, state: State): VM {
  return {
    header: "Product Details",
    name: props.product.name,
    description: props.product.description ?? "No description provided",
    details: getDetails(props)
  }
}

function getDetails(props: Props): DetailsItemVM[] {
  const detailsArray: DetailsItemVM[] = []
  detailsArray.push(getDetailsCodeItem(props))
  detailsArray.push(getDetailsCategoryItem(props))
  return detailsArray
}

function getDetailsCodeItem(props: Props): DetailsItemVM {
  return {
    key: "code",
    name: "Code",
    value: props.product.productCode
  }
}

function getDetailsCategoryItem(props: Props): DetailsItemVM {
  return {
    key: "category",
    name: "Category",
    value: getCategoryText(props.product.category)
  }
}

function getCategoryText(category: ProductCategory): string {
  const prefix =
    category.parentCategory
      ?
      `${getCategoryText(category.parentCategory)} > `
      : ""
  return `${prefix}${category.name}`
}
