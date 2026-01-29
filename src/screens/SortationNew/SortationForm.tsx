import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';
import { ScannerInput } from '../../components/ScannerInput';
import { SortationTask } from '../../types/sortation';
import { StepInput } from './StepInput';
import styles from './styles';

type SortationFormProps = {
  currentStep: number;
  productBarcode: string;
  setProductBarcode: (v: string) => void;
  handleProductScan: (v: string) => void;
  quantity: string;
  setQuantity: (v: string) => void;
  setCurrentStep: (v: number) => void;
  containerBarcode: string;
  setContainerBarcode: (v: string) => void;
  storageLocationBarcode: string;
  handleSubmit: () => void;
  handleBack: () => void;
  handleNext: () => void;
  loading: boolean;
  error: string | null;
  task: SortationTask | null;
};

const SortationForm: React.FC<SortationFormProps> = ({
  currentStep,
  productBarcode,
  setProductBarcode,
  handleProductScan,
  quantity,
  setQuantity,
  containerBarcode,
  setContainerBarcode,
  storageLocationBarcode,
  handleBack,
  handleNext,
  loading,
  error,
  task
}) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.screen}>
      <StepInput
        label="Product Barcode"
        icon="package-variant"
        value={productBarcode}
        isActive={currentStep === 1}
        error={error}
        onChange={setProductBarcode}
        onSubmit={handleProductScan}
      />

      <StepInput
        label="Quantity"
        icon="layers-outline"
        value={quantity}
        placeholder={task?.quantity?.toString()}
        keyboardType="numeric"
        isActive={currentStep === 2}
        error={error}
        onChange={setQuantity}
        onSubmit={handleNext}
      />

      <StepInput
        label="Container Barcode"
        icon="package-variant-closed"
        value={containerBarcode}
        placeholder={task?.container?.locationNumber}
        isActive={currentStep === 3}
        error={error}
        onChange={setContainerBarcode}
        onSubmit={handleNext}
      />

      <View style={styles.formRow}>
        <ScannerInput
          label="Storage Location"
          // @ts-ignore
          leftIcon="map-marker"
          value={storageLocationBarcode}
          isEnabled={false}
          autoSubmitTimeout={0}
          onChange={() => {}}
          onSubmit={() => {}}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button mode="outlined" style={styles.buttonLeft} disabled={currentStep === 4 || loading} onPress={handleBack}>
          Back
        </Button>
        <Button mode="contained" loading={loading} style={styles.buttonRight} disabled={loading} onPress={handleNext}>
          {currentStep === 4 ? 'Confirm' : currentStep === 3 ? 'Review' : 'Next'}
        </Button>
      </View>
    </ScrollView>
  );
};

export default SortationForm;
