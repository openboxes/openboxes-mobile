import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import { HelperText, Paragraph, Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../../components/Button';
import { validateProfile } from '../../components/ProfileStorage';
import { Profile } from '../../types/profile';
import { fallbackApiUrl, ResolveResult } from '../../utils/serverUrl';
import styles from './styles';
import { useServerCheck } from './useServerCheck';

type ProfileFormDialogProps = {
  visible: boolean;
  profile: Profile | null;
  onSave: (label: string, serverUrl: string) => Promise<void>;
  onDismiss: () => void;
};

function checkErrorMessage(result: ResolveResult): string | null {
  switch (result.kind) {
    case 'not-openboxes':
      return `No OpenBoxes server found at ${result.tried.join(' or ')}.`;
    case 'unreachable':
      return 'Could not reach the server. Check the address and your connection.';
    default:
      return null;
  }
}

export default function ProfileFormDialog({ visible, profile, onSave, onDismiss }: ProfileFormDialogProps) {
  const [formLabel, setFormLabel] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { checking, result, check, invalidate } = useServerCheck();

  const busy = checking || saving;
  const canSaveAnyway = !busy && result !== null && result.kind !== 'ok';

  useEffect(() => {
    if (visible) {
      setFormLabel(profile?.label ?? '');
      setFormUrl(profile?.serverUrl ?? '');
      setFormError(null);
      invalidate();
    }
  }, [visible, profile, invalidate]);

  const commit = useCallback(
    async (label: string, serverUrl: string) => {
      setSaving(true);
      try {
        await onSave(label, serverUrl);
      } catch (e: any) {
        setFormError(e?.message || 'Failed to save profile.');
      } finally {
        setSaving(false);
      }
    },
    [onSave]
  );

  const handleSave = useCallback(async () => {
    const error = validateProfile(formLabel, formUrl);
    if (error) {
      setFormError(error);
      return;
    }
    const label = formLabel.trim();
    const url = formUrl.trim();

    // A label-only edit keeps the stored URL and needs no server check
    if (profile && url === profile.serverUrl) {
      await commit(label, url);
      return;
    }

    setFormError(null);
    const outcome = await check(url);
    if (!outcome) {
      return;
    }
    if (outcome.kind === 'ok') {
      await commit(label, outcome.url);
    } else {
      setFormError(checkErrorMessage(outcome));
    }
  }, [formLabel, formUrl, profile, check, commit]);

  const handleSaveAnyway = useCallback(async () => {
    await commit(formLabel.trim(), fallbackApiUrl(formUrl));
  }, [formLabel, formUrl, commit]);

  const handleDismiss = useCallback(() => {
    if (saving) {
      return;
    }
    invalidate();
    onDismiss();
  }, [saving, invalidate, onDismiss]);

  const handleEdit = useCallback(
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setFormError(null);
      invalidate();
    },
    [invalidate]
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleDismiss}>
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
            editable={!busy}
            autoCompleteType="off"
            onChangeText={handleEdit(setFormLabel)}
          />
          <TextInput
            style={styles.urlInput}
            mode="outlined"
            label="Server URL"
            placeholder="https://openboxes.example.com"
            value={formUrl}
            editable={!busy}
            autoCompleteType="off"
            autoCapitalize="none"
            keyboardType="url"
            onChangeText={handleEdit(setFormUrl)}
          />
          <HelperText type="info" style={styles.urlHelper}>
            {checking ? 'Checking server...' : 'Enter the server address, e.g. https://openboxes.example.com'}
          </HelperText>
          {formError && (
            <View style={styles.errorBox}>
              <Icon name="alert-circle-outline" size={16} color="#d32f2f" style={styles.errorIcon} />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          )}
          {canSaveAnyway && (
            <Button title="Save anyway" mode="text" size="100%" disabled={busy} onPress={handleSaveAnyway} />
          )}

          <View style={styles.dialogActions}>
            <Button
              title="Cancel"
              mode="outlined"
              size="100%"
              style={styles.dialogButtonLeft}
              disabled={saving}
              onPress={handleDismiss}
            />
            <Button
              title={checking ? 'Checking...' : 'Save'}
              mode="contained"
              size="100%"
              style={styles.dialogButtonRight}
              disabled={busy}
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
