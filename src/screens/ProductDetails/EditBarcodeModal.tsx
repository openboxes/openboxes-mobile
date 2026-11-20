import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, View } from 'react-native';
import { Headline, Paragraph, Subheading } from 'react-native-paper';

import Button from '../../components/Button';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING } from '../../constants';
import { useScanListener } from '../../hooks/useScanListener';
import Theme from '../../utils/Theme';
import styles from './styles';

type EditBarcodeModalProps = {
  visible: boolean;
  currentBarcode?: string;
  onSave: (barcode: string, resetInput: () => void) => void;
  onRemoveBarcode: () => void;
  onClose: () => void;
};

export default function EditBarcodeModal({
  visible,
  currentBarcode,
  onSave,
  onRemoveBarcode,
  onClose
}: EditBarcodeModalProps) {
  const [barcode, setBarcode] = useState(EMPTY_STRING);
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const isScreenFocused = useIsFocused();

  useEffect(() => {
    setIsConfirmingRemove(false);
    if (visible) {
      setBarcode(EMPTY_STRING);
    }
  }, [visible]);

  // A hardware scan calls onChange and onSubmit in the same tick, before `barcode` re-renders,
  // so save the value that was submitted, not the state.
  const handleSave = (submitted: string) => {
    const value = submitted.trim();
    if (!value) {
      return;
    }
    Keyboard.dismiss();
    onSave(value, () => setBarcode(EMPTY_STRING));
  };

  // The confirm step has no scanner field. A listener for the whole modal keeps DataWedge keystroke
  // output muted across the step switch and drops scans while confirming, so a scan cannot save or
  // remove anything behind the confirm.
  useScanListener(() => undefined, visible && isScreenFocused);

  const openRemoveConfirm = () => {
    Keyboard.dismiss();
    setIsConfirmingRemove(true);
  };

  if (isConfirmingRemove && currentBarcode) {
    return (
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onDismiss={onClose}
        onRequestClose={() => setIsConfirmingRemove(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Headline>Remove barcode?</Headline>
            <Paragraph style={{ marginTop: Theme.spacing.small }}>
              Barcode <Paragraph style={styles.subheading}>{currentBarcode}</Paragraph> will be removed from this
              product. Scanning it will no longer find the product.
            </Paragraph>
            <View style={styles.confirmButtonColumn}>
              <Button
                icon="delete"
                variant="danger"
                mode="contained"
                size="100%"
                title="Remove barcode"
                style={styles.confirmButtonSpacing}
                onPress={onRemoveBarcode}
              />
              <Button
                icon="close-circle"
                variant="secondary"
                mode="contained"
                size="100%"
                title="Cancel"
                onPress={() => setIsConfirmingRemove(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onDismiss={onClose} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Headline>Edit barcode</Headline>
          <Paragraph style={{ marginBottom: Theme.spacing.medium }}>
            You'll be able to find and scan the product using either its internal product code or its barcode depending
            on what your scanner provides.
          </Paragraph>

          {currentBarcode ? (
            <View style={styles.currentBarcodeRow}>
              <Subheading style={styles.currentBarcodeText}>
                Current Barcode: <Paragraph style={styles.subheading}>{currentBarcode}</Paragraph>
              </Subheading>
              <Button
                icon="close-circle-outline"
                mode="text"
                variant="danger"
                size="default"
                title="Remove"
                onPress={openRemoveConfirm}
              />
            </View>
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
              disabled={!barcode.trim()}
              style={styles.modalButton}
              onPress={() => handleSave(barcode)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
