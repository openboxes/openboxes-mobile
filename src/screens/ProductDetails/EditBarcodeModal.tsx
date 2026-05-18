import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, View } from 'react-native';
import { Headline, Paragraph, Subheading } from 'react-native-paper';

import Button from '../../components/Button';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import Theme from '../../utils/Theme';
import styles from './styles';

type EditBarcodeModalProps = {
  visible: boolean;
  currentBarcode?: string;
  onSave: (barcode: string, clear: () => void) => void;
  onClose: () => void;
};

export default function EditBarcodeModal({ visible, currentBarcode, onSave, onClose }: EditBarcodeModalProps) {
  const [barcode, setBarcode] = useState(EMPTY_STRING);

  useEffect(() => {
    if (visible) {
      setBarcode(EMPTY_STRING);
    }
  }, [visible]);

  const handleSave = () => {
    Keyboard.dismiss();
    onSave(barcode, () => setBarcode(EMPTY_STRING));
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onDismiss={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Headline>Edit barcode</Headline>
          <Paragraph style={{ marginBottom: Theme.spacing.medium }}>
            You'll be able to find and scan the product using either its internal product code or its barcode depending
            on what your scanner provides.
          </Paragraph>

          {currentBarcode ? (
            <Subheading style={{ marginBottom: Theme.spacing.medium }}>
              Current Barcode: <Paragraph style={styles.subheading}>{currentBarcode}</Paragraph>
            </Subheading>
          ) : null}

          <ScannerInput
            isEnabled={visible}
            label="Barcode (UPC)"
            placeholder="Scan or type the product's barcode"
            value={barcode}
            autoSubmitTimeout={0}
            style={styles.bottomSeparator}
            onChange={setBarcode}
            onSubmit={handleSave}
          />

          <View style={styles.modalButtonRow}>
            <Button
              icon="close-circle"
              variant="secondary"
              mode="contained"
              title="Cancel"
              style={[styles.modalButton, styles.modalButtonSpacing]}
              onPress={onClose}
            />
            <Button
              icon="arrow-right-circle"
              mode="contained"
              title="Save"
              style={styles.modalButton}
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
