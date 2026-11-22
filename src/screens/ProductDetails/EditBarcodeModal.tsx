import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
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
  /** onFailed: call it when the save failed; it empties the field and re-enables the buttons. */
  onSave: (barcode: string, onFailed: () => void) => void;
  /** onFailed: call it when the removal failed; it re-enables the buttons. */
  onRemoveBarcode: (onFailed: () => void) => void;
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
  // One save or removal at a time: a second tap or scan before the loading overlay shows would send
  // another request. The ref guards taps in the same frame; the state disables the buttons.
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const isScreenFocused = useIsFocused();

  const setSaving = (saving: boolean) => {
    savingRef.current = saving;
    setIsSaving(saving);
  };

  useEffect(() => {
    setIsConfirmingRemove(false);
    savingRef.current = false;
    setIsSaving(false);
    if (visible) {
      setBarcode(EMPTY_STRING);
    }
  }, [visible]);

  // A hardware scan calls onChange and onSubmit in the same tick, before `barcode` re-renders,
  // so save the value that was submitted, not the state.
  const handleSave = (submitted: string) => {
    const value = submitted.trim();
    if (!value || savingRef.current) {
      return;
    }
    Keyboard.dismiss();
    setSaving(true);
    onSave(value, () => {
      setBarcode(EMPTY_STRING);
      setSaving(false);
    });
  };

  const handleRemove = () => {
    if (savingRef.current) {
      return;
    }
    setSaving(true);
    onRemoveBarcode(() => setSaving(false));
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
                disabled={isSaving}
                style={styles.confirmButtonSpacing}
                onPress={handleRemove}
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
                disabled={isSaving}
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
              disabled={!barcode.trim() || isSaving}
              style={styles.modalButton}
              onPress={() => handleSave(barcode)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
