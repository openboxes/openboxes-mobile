import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Keyboard } from 'react-native';
import { Button, Headline, Paragraph, TextInput } from 'react-native-paper';
import Theme from '../../utils/Theme';
import styles from './styles';

type EditBarcodeModalProps = {
  visible: boolean;
  currentBarcode?: string;
  onSave: (barcode: string) => void;
  onClose: () => void;
};

export default function EditBarcodeModal({ visible, currentBarcode, onSave, onClose }: EditBarcodeModalProps) {
  const [barcode, setBarcode] = useState(currentBarcode || '');
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setBarcode(currentBarcode || '');
  }, [currentBarcode]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent animationType="slide" visible={visible} onDismiss={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Headline>Edit Barcode</Headline>
          <Paragraph style={{ marginBottom: Theme.spacing.large }}>
            You'll be able to find and scan the product using either its internal product code or its barcode, depending
            on what your scanner provides.
          </Paragraph>

          <TextInput
            blurOnSubmit
            ref={inputRef}
            autoCompleteType="off"
            label="Barcode (UPC)"
            mode="outlined"
            value={barcode}
            style={styles.bottomSeparator}
            returnKeyType="done"
            onChangeText={setBarcode}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              onSave(barcode);
            }}
          />

          <View style={styles.actionButtons}>
            <Button onPress={onClose}>Cancel</Button>
            <Button
              style={styles.topSeparator}
              mode="contained"
              onPress={() => {
                Keyboard.dismiss();
                onSave(barcode);
              }}
            >
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
