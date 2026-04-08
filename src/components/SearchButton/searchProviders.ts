import Location from '../../data/location/Location';
import Product from '../../data/product/Product';
import { searchInternalLocations } from '../../redux/actions/locations';
import { searchProductGloballyAction } from '../../redux/actions/products';

export type SearchResult = {
  id: string;
  label: string;
  subtitle: string;
  value: string;
};

type SearchCallback = (result: { results?: SearchResult[]; error?: string }) => void;

export type SearchProvider = {
  title: string;
  placeholder: string;
  inputLabel: string;
  createAction: (term: string, callback: SearchCallback) => { type: string; [key: string]: any };
};

type SearchResponse<T> = {
  error?: boolean;
  errorMessage?: string;
  data?: T[];
};

function createProductAction(term: string, callback: SearchCallback) {
  return searchProductGloballyAction(
    term,
    (response: SearchResponse<Product>) => {
      if (response?.error) {
        callback({ error: response.errorMessage || 'Failed to search products.' });
        return;
      }

      callback({
        results: (response?.data || []).map((item) => ({
          id: item.id,
          label: item.productCode || item.name,
          subtitle: item.name,
          value: item.productCode
        }))
      });
    },
    true
  );
}

function createLocationAction(term: string, callback: SearchCallback) {
  return searchInternalLocations(
    term,
    null,
    (response: SearchResponse<Location>) => {
      if (response?.error) {
        callback({ error: response.errorMessage || 'Failed to search locations.' });
        return;
      }

      callback({
        results: (response?.data || []).map((item) => ({
          id: item.id,
          label: item.locationNumber || item.name,
          subtitle: item.name,
          value: item.locationNumber
        }))
      });
    },
    true
  );
}

export const searchProviders = {
  product: {
    title: 'Search Product',
    placeholder: 'Search by name or code...',
    inputLabel: 'Product',
    createAction: createProductAction
  },
  location: {
    title: 'Search Location',
    placeholder: 'Search by name or number...',
    inputLabel: 'Location',
    createAction: createLocationAction
  },
  container: {
    title: 'Search Container',
    placeholder: 'Search by name or number...',
    inputLabel: 'Container ID',
    createAction: createLocationAction
  }
};

export type SearchType = keyof typeof searchProviders;
