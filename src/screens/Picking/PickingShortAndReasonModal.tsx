import React from 'react';
import { Modal, View } from 'react-native';
import { Button, Paragraph, Subheading } from 'react-native-paper';

import AsyncModalSelect from '../../components/AsyncModalSelect';
import { ReasonCode } from '../../types/picking';
import styles from './styles';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (reasonCode?: ReasonCode) => void;
  reasonCodes: ReasonCode[];
  selectedReasonCode: ReasonCode | undefined;
  setSelectedReasonCode: (reasonCode: ReasonCode | undefined) => void;
  quantityPicked?: string;
};

export default function PickingShortAndReasonModal({
  visible,
  onDismiss,
  onConfirm,
  reasonCodes,
  selectedReasonCode,
  setSelectedReasonCode,
  quantityPicked
}: Props) {
  const parsedQuantityPicked = quantityPicked ? Number(quantityPicked) : 0;

  // We need this because of the AsyncModalSelect implementation
  const onSelectedReason = (reason?: ReasonCode) =>
    !reason?.id || !reason?.name ? setSelectedReasonCode(undefined) : setSelectedReasonCode(reason);

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Subheading style={styles.modalTitleText}>Proceed With Short-Pick</Subheading>
          <Paragraph style={styles.modalDescription}>
            Select a reason for shortage to proceed with “Short” or press “Return” to enter a correct quantity.
          </Paragraph>

          <AsyncModalSelect
            placeholder="Select a Reason"
            label="Reason for Short-pick"
            initValue={selectedReasonCode?.name || ''}
            initialData={reasonCodes}
            searchAction={() => {}}
            serverSearchEnabled={false}
            onSelect={(reason: ReasonCode) => onSelectedReason(reason)}
          />

          <View style={styles.dialogActions}>
            <Button mode="text" onPress={onDismiss}>
              Return
            </Button>
            <Button
              mode="contained"
              // If quantity picked is zero, reason code selection is mandatory
              disabled={parsedQuantityPicked === 0 ? !selectedReasonCode : false}
              onPress={() => onConfirm(selectedReasonCode)}
            >
              Short
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
