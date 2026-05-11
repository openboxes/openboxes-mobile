import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { ScanIcon } from '../../components/Icons';
import { ScannerInput } from '../../components/ScannerInput';
import { SearchButton } from '../../components/SearchButton';
import { useSearchButton } from '../../components/SearchButton/useSearchButton';
import { EMPTY_STRING } from '../../constants';
import { navigate } from '../../NavigationService';
import { lookupTransferBarcodeAction } from '../../redux/actions/createTransfer';
import styles from './styles';

export default function CreateTransferEntryScreen() {
  const dispatch = useDispatch();
  const [code, setCode] = useState<string>(EMPTY_STRING);
  const [error, setError] = useState<string | null>(null);

  const { isSearchOpen, searchButtonProps } = useSearchButton({ onSelect: setCode });

  const handleSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }
      setError(null);
      dispatch(
        lookupTransferBarcodeAction(trimmed, (result: any) => {
          if (result?.kind === 'product') {
            setCode(EMPTY_STRING);
            navigate('CreateTransferItemList', {
              productId: result.product.id,
              productCode: result.product.productCode || trimmed
            });
          } else if (result?.kind === 'location') {
            setCode(EMPTY_STRING);
            navigate('CreateTransferItemList', {
              binId: result.location.id,
              binName: result.location.locationNumber || result.location.name || trimmed
            });
          } else if (result?.kind === 'none') {
            setCode(EMPTY_STRING);
            navigate('CreateTransferItemList', { searchTerm: trimmed });
          } else {
            setError(result?.errorMessage || 'Lookup failed. Please try again.');
          }
        })
      );
    },
    [dispatch]
  );

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={styles.screen}>
      <Title style={styles.title}>Scan product or bin barcode</Title>

      <View style={styles.scannerRow}>
        <ScannerInput
          style={styles.scannerInput}
          label="Product or Bin"
          placeholder="Scan or type a product / bin code"
          leftIcon={<ScanIcon size={24} />}
          autoSubmitTimeout={400}
          value={code}
          isEnabled={!isSearchOpen}
          danger={!!error}
          onChange={(text) => {
            setCode(text);
            if (error) {
              setError(null);
            }
          }}
          onSubmit={handleSubmit}
        />
        <SearchButton searchType="productOrLocation" {...searchButtonProps} />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
}
