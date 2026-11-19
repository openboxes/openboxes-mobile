import React from 'react';
import { Modal, View } from 'react-native';
import { Button, Divider, Paragraph, Subheading } from 'react-native-paper';

import styles from '../PickingShortAndReasonModal/styles';
import Theme from '../../utils/Theme';

type Props = {
  visible: boolean;
  message?: string;
  onScanAnother: () => void;
  onStageAnyway: () => void;
  // Some callers don't scan a location at all (e.g. the "Move to Staging" flow drops a whole
  // container at its single suggested location), so the first button isn't always "scan again".
  cancelLabel?: string;
};

export default function StagingLocationZoneMismatchModal({
  visible,
  message,
  onScanAnother,
  onStageAnyway,
  cancelLabel = 'Scan Another Location'
}: Props) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onScanAnother}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Subheading style={styles.modalTitleText}>Different staging zone</Subheading>
          <Paragraph style={styles.modalDescription}>{message}</Paragraph>

          <Button mode="contained" onPress={onScanAnother}>
            {cancelLabel}
          </Button>
          <Divider style={{ marginVertical: Theme.spacing.small }} />
          <Button mode="outlined" onPress={onStageAnyway}>
            Stage Here Anyway
          </Button>
        </View>
      </View>
    </Modal>
  );
}
