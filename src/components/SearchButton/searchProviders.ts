import Location from '../../data/location/Location';
import Product from '../../data/product/Product';
import { searchDestinationBinsAction, searchProductOrLocationAction } from '../../redux/actions/createTransfer';
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

function locationToSearchResult(item: Location): SearchResult {
  return {
    id: item.id,
    label: item.locationNumber || item.name,
    subtitle: item.name,
    value: item.locationNumber
  };
}

function handleLocationSearchResponse(
  response: SearchResponse<Location>,
  callback: SearchCallback,
  failureMessage: string
) {
  if (response?.error) {
    callback({ error: response.errorMessage || failureMessage });
    return;
  }
  callback({ results: (response?.data || []).map(locationToSearchResult) });
}

function createLocationAction(term: string, callback: SearchCallback) {
  return searchInternalLocations(
    term,
    null,
    (response: SearchResponse<Location>) =>
      handleLocationSearchResponse(response, callback, 'Failed to search locations.'),
    true
  );
}

function createProductOrLocationAction(term: string, callback: SearchCallback) {
  return searchProductOrLocationAction(
    term,
    (response: { products?: Product[]; locations?: Location[]; error?: boolean; errorMessage?: string }) => {
      if (response?.error) {
        callback({ error: response.errorMessage || 'Failed to search.' });
        return;
      }

      const productResults: SearchResult[] = (response?.products || []).map((item) => ({
        id: `product:${item.id}`,
        label: item.productCode || item.name,
        subtitle: `Product · ${item.name}`,
        value: item.productCode
      }));

      const locationResults: SearchResult[] = (response?.locations || []).map((item) => ({
        id: `location:${item.id}`,
        label: item.locationNumber || item.name,
        subtitle: `Bin · ${item.name}`,
        value: item.locationNumber
      }));

      callback({ results: [...productResults, ...locationResults] });
    },
    true
  );
}

function createDestinationBinAction(term: string, callback: SearchCallback) {
  return searchDestinationBinsAction(
    term,
    (response: SearchResponse<Location>) =>
      handleLocationSearchResponse(response, callback, 'Failed to search destination bins.'),
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
  },
  destinationBin: {
    title: 'Search Destination Bin',
    placeholder: 'Search by name or number...',
    inputLabel: 'Destination Bin',
    createAction: createDestinationBinAction
  },
  productOrLocation: {
    title: 'Search Product or Bin',
    placeholder: 'Product or bin code...',
    inputLabel: 'Product or Bin',
    createAction: createProductOrLocationAction
  }
};

export type SearchType = keyof typeof searchProviders;
