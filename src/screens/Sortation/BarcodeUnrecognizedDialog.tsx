import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../../components/Button';
import Theme from '../../utils/Theme';
import styles from './styles';

type BarcodeUnrecognizedDialogProps = {
  visible: boolean;
  barcode: string;
  onFindProduct: () => void;
  onClose: () => void;
};

export function BarcodeUnrecognizedDialog({
  visible,
  barcode,
  onFindProduct,
  onClose
}: BarcodeUnrecognizedDialogProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogContent}>
          <Text style={styles.dialogTitle}>Barcode unrecognized</Text>
          <Text style={styles.dialogText}>{`Product ${barcode} not found`}</Text>

          <Divider style={styles.dialogDivider} />

          <TouchableOpacity style={styles.dialogLinkRow} onPress={onFindProduct}>
            <Text style={styles.dialogLink}>Find a product for this barcode</Text>
            <MaterialCommunityIcons name="arrow-top-right" size={18} color={Theme.colors.primary} />
          </TouchableOpacity>

          <Divider style={styles.dialogDivider} />

          <Button
            icon="close-circle"
            variant="secondary"
            mode="contained"
            title="Close"
            size="100%"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}
