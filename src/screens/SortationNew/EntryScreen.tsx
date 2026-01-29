import { useNavigation } from '@react-navigation/native';
import React from 'react';

import SortationForm from './SortationForm';
import SortationSummary from './SortationSummary';
import { useSortation } from './useSortation';

export default function EntryScreen() {
  const navigation = useNavigation();
  const { state, actions } = useSortation();

  if (state.isSorted) {
    return (
      <SortationSummary
        productBarcode={state.productBarcode}
        quantity={state.quantity}
        containerBarcode={state.containerBarcode}
        storageLocationBarcode={state.storageLocationBarcode}
        onReset={actions.onReset}
        onToDashboard={() => navigation.navigate('Dashboard' as never)}
      />
    );
  }

  return (
    <SortationForm
      currentStep={state.currentStep}
      productBarcode={state.productBarcode}
      setProductBarcode={actions.setProductBarcode}
      handleProductScan={actions.handleProductScan}
      quantity={state.quantity}
      setQuantity={actions.setQuantity}
      setCurrentStep={actions.setCurrentStep}
      containerBarcode={state.containerBarcode}
      setContainerBarcode={actions.setContainerBarcode}
      storageLocationBarcode={state.storageLocationBarcode}
      handleSubmit={actions.handleSubmit}
      handleBack={actions.handleBack}
      handleNext={actions.handleNext}
      loading={state.loading}
      error={state.error}
      task={state.task}
    />
  );
}
