import { useState } from 'react';
import { useDispatch } from 'react-redux';

import showPopup from '../components/Popup';
import { searchBarcode } from '../redux/actions/products';
import { useScanListener } from './useScanListener';

const useBarcodeScanned = () => {
  const [state, setState] = useState<any>({
    error: null,
    searchProductCode: null
  });
  const dispatch = useDispatch();

  const onBarCodeScan = (query: string) => {
    onEmptyQuery(query);
    const actionCallback = (data: any) => {
      if (data?.error) {
        onError(data, query, () => {
          dispatch(searchBarcode(query, actionCallback));
        });
      } else if (data.length === 0) {
        onEmptyData(query);
      } else if (data && Object.keys(data).length !== 0) {
        onSuccess(data, query);
      }
    };
    dispatch(searchBarcode(query, actionCallback));
  };

  useScanListener((result) => {
    if (result.data) {
      onBarCodeScan(result.data);
    }
  });

  const onError = (data: any, query: any, callback: (data: any) => void) => {
    showPopup({
      title: data.errorMessage ?? `Failed to load search results with value = "${query}"`,
      message: data.errorMessage ?? `Failed to load search results with value = "${query}"`,
      positiveButton: {
        text: 'Retry',
        callback: callback
      },
      negativeButtonText: 'Cancel'
    });
  };

  const onEmptyQuery = (query: any) => {
    if (!query) {
      showPopup({
        message: 'Search query is empty',
        positiveButton: { text: 'Ok' }
      });
    }
  };

  const onEmptyData = (query: any) => {
    setState({
      ...state,
      searchProductCode: {
        query: query,
        results: null
      },
      error: `No search results found for barcode "${query}"`
    });
  };

  const onSuccess = (data: any, query: any) => {
    setState({
      ...state,
      searchProductCode: {
        query: query,
        results: data
      },
      error: null
    });
  };

  return state.searchProductCode;
};

export default useBarcodeScanned;
