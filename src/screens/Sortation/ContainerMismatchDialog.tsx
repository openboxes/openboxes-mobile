import React, { useState } from 'react';
import { Alert, Modal, View } from 'react-native';
import { Text } from 'react-native-paper';

import Button from '../../components/Button';
import { ContainerIcon } from '../../components/Icons';
import { ScannerInput } from '../../components/ScannerInput';
import { EMPTY_STRING, HYPHEN } from '../../constants';
import Theme from '../../utils/Theme';
import styles from './styles';

type ContainerMismatchDialogProps = {
  visible: boolean;
  scannedContainer: string;
  expectedContainer: string | null | undefined;
  onDismiss: () => void;
  onScan: (code: string) => void;
};

export function ContainerMismatchDialog({
  visible,
  scannedContainer,
  expectedContainer,
  onDismiss,
  onScan
}: ContainerMismatchDialogProps) {
  const [dialogInput, setDialogInput] = useState<string>(EMPTY_STRING);

  const handleDismiss = () => {
    setDialogInput(EMPTY_STRING);
    onDismiss();
  };

  const handleOverride = () => {
    setDialogInput(EMPTY_STRING);
    onScan(scannedContainer);
  };

  const handleScanSubmit = () => {
    const trimmedInput = dialogInput?.trim();
    if (!trimmedInput) {
      return;
    }

    if (trimmedInput !== scannedContainer) {
      Alert.alert(
        'Container Mismatch',
        'The scanned container does not match. Please scan the same container to confirm the override.'
      );
      setDialogInput(EMPTY_STRING);
      return;
    }

    onScan(trimmedInput);
  };

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
              danger
              leftIcon={<ContainerIcon size={24} color={Theme.colors.danger} />}
              label="Container"
              placeholder="Scan or type the container"
              value={dialogInput}
              autoSubmitTimeout={0}
              onChange={setDialogInput}
              onSubmit={handleScanSubmit}
            />
          </View>
          <View style={[styles.dialogActions, styles.topSpace]}>
            <Button
              icon="close"
              variant="secondary"
              style={[styles.dialogButton, styles.rightSpace]}
              title="Cancel"
              mode="contained"
              onPress={handleDismiss}
            />
            <Button
              icon="check"
              variant="danger"
              style={styles.dialogButton}
              title="Override"
              mode="contained"
              onPress={handleOverride}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
