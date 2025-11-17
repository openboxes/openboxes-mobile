import apiClient from '../utils/ApiClient';

export function getProducts() {
  return apiClient.get('/generic/product');
}

export function searchProductsByName(name: string) {
  return apiClient.post('/mobile/products/search', {
    searchAttributes: [
      {
        property: 'name',
        operator: 'like',
        value: `${name}%`
      }
    ]
  });
}

export function searchProductByCode(productCode: string) {
  return apiClient.post('/generic/product/search', {
    searchAttributes: [
      {
        property: 'productCode',
        operator: 'like',
        value: `${productCode}%`
      }
    ]
  });
}

export function searchProductGlobally(value: string) {
  return apiClient.post('/mobile/products/search', { value: `${value}` });
}

export function searchProductsByCategory(category: any) {
  return apiClient.post('/generic/product/search', {
    searchAttributes: [
      {
        property: 'category.id',
        operator: 'eq',
        value: category.id
      }
    ]
  });
}

export function getProductById(id: any) {
  return apiClient.get(`/mobile/products/${id}/details`);
}

export function printLabel(data: any) {
  return apiClient.post(`/${data.type}/${data.productId}/labels/${data.barcodeId}`, {});
}

export function stockAdjustments(requestBody: any) {
  return apiClient.post('/stockAdjustments', requestBody);
}

export function searchBarcode(id: string) {
  return apiClient.get(`/globalSearch/${id}`, {});
}

export function getProductByBarcode(barcode: string) {
  return apiClient.get(`/barcodes?id=${encodeURIComponent(barcode)}`);
}

export function updateProductIdentifier(id: string, type: string, value: string) {
  return apiClient.put(`/mobile/products/${id}/identifiers`, {
    identifier: { type, value }
  });
}
