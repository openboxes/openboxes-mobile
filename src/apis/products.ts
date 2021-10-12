import apiClient from '../utils/ApiClient';

export function getProducts() {
  return apiClient.get('/generic/product');
}

export function searchProductsByName(name: string) {
  return apiClient.post('/generic/product/search', {
    searchAttributes: [
      {
        property: 'name',
        operator: 'like',
        value: `${name}%`,
      },
    ],
  });
}

export function searchProductByCode(productCode: string) {
  return apiClient.post('/generic/product/search', {
    searchAttributes: [
      {
        property: 'productCode',
        operator: 'like',
        value: `${productCode}%`,
      },
    ],
  });
}

export function searchProductGlobally(value: string) {
  return apiClient.post('/products/search', {value: `${value}`});
}

export function searchProductsByCategory(category: any) {
  return apiClient.post('/generic/product/search', {
    searchAttributes: [
      {
        property: 'category.id',
        operator: 'eq',
        value: category.id,
      },
    ],
  });
}
