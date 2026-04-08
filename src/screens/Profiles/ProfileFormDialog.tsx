import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import { Paragraph, Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../../components/Button';
import { validateProfile } from '../../components/ProfileStorage';
import { Profile } from '../../types/profile';
import styles from './styles';

type ProfileFormDialogProps = {
  visible: boolean;
  profile: Profile | null;
  onSave: (label: string, serverUrl: string) => Promise<void>;
  onDismiss: () => void;
};

export default function ProfileFormDialog({ visible, profile, onSave, onDismiss }: ProfileFormDialogProps) {
  const [formLabel, setFormLabel] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setFormLabel(profile?.label ?? '');
      setFormUrl(profile?.serverUrl ?? '');
      setFormError(null);
    }
  }, [visible, profile]);

  const handleSave = useCallback(async () => {
    const error = validateProfile(formLabel, formUrl);
    if (error) {
      setFormError(error);
      return;
    }
    try {
      await onSave(formLabel.trim(), formUrl.trim());
    } catch (e: any) {
      setFormError(e?.message || 'Failed to save profile.');
    }
  }, [formLabel, formUrl, onSave]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{profile ? 'Edit Profile' : 'New Profile'}</Text>
          <Paragraph style={styles.modalDescription}>
            {profile ? 'Update the profile name and server URL.' : 'Enter a name and server URL for the new profile.'}
          </Paragraph>

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Label"
            placeholder="e.g., Production"
            value={formLabel}
            autoCompleteType="off"
            onChangeText={(t) => {
              setFormLabel(t);
              setFormError(null);
            }}
          />
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Server URL"
            placeholder="https://openboxes.example.com"
            value={formUrl}
            autoCompleteType="off"
            autoCapitalize="none"
            keyboardType="url"
            onChangeText={(t) => {
              setFormUrl(t);
              setFormError(null);
            }}
          />
          {formError && (
            <View style={styles.errorBox}>
              <Icon name="alert-circle-outline" size={16} color="#d32f2f" style={styles.errorIcon} />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          )}

          <View style={styles.dialogActions}>
            <Button title="Cancel" mode="outlined" size="100%" style={styles.dialogButtonLeft} onPress={onDismiss} />
            <Button title="Save" mode="contained" size="100%" style={styles.dialogButtonRight} onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
