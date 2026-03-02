import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScannerInput } from '../../components/ScannerInput';
import { ContainerIcon } from '../../components/Icons';
import { HYPHEN, EMPTY_STRING } from '../../constants';
import Button from '../../components/Button';
import styles from './styles';

type Props = {
  visible: boolean;
  scannedContainer: string;
  expectedContainer: string | null | undefined;
  onDismiss: () => void;
  onScan: (code: string) => void;
};

export function ContainerMismatchDialog({ visible, scannedContainer, expectedContainer, onDismiss, onScan }: Props) {
  const [dialogInput, setDialogInput] = useState<string>(EMPTY_STRING);

  function handleDismiss() {
    setDialogInput(EMPTY_STRING);
    onDismiss();
  }

  function handleOverride() {
    handleDismiss();
    onScan(scannedContainer);
  }

  function handleScanSubmit() {
    if (dialogInput && dialogInput.trim()) {
      handleDismiss();
      onScan(dialogInput.trim());
    }
  }

  const displayExpectedContainer = expectedContainer || HYPHEN;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogContent}>
          <Text style={styles.dialogTitle}>Wrong Container Number</Text>
          <Text style={styles.dialogText}>
            The scanned container ({scannedContainer}) didn't match the expected container ({displayExpectedContainer}).
            Scan again or use the button to confirm.
          </Text>
          <View style={styles.bottomSpace}>
            <ScannerInput
              leftIcon={<ContainerIcon size={24} />}
              label="Container"
              placeholder="Scan or type the container"
              value={dialogInput}
              autoSubmitTimeout={0}
              onChange={setDialogInput}
              onSubmit={handleScanSubmit}
            />
          </View>
          <View style={[styles.dialogActions, styles.topSpace]}>
            <Button style={styles.dialogButton} title="Cancel" mode="text" onPress={handleDismiss} />
            <Button style={styles.dialogButton} title="Override" mode="contained" onPress={handleOverride} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
