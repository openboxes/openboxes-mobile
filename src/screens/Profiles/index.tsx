import React, { memo, useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Caption, Card, IconButton, Paragraph } from 'react-native-paper';

import { useDispatch } from 'react-redux';
import showPopup from '../../components/Popup';
import * as ProfileStorage from '../../components/ProfileStorage';
import { useProfiles } from '../../hooks/useProfiles';
import * as NavigationService from '../../NavigationService';
import { logout as logoutApi } from '../../apis/auth';
import { LOGOUT_REQUEST_SUCCESS } from '../../redux/actions/auth';
import { Profile } from '../../types/profile';
import ApiClient from '../../utils/ApiClient';
import Theme from '../../utils/Theme';
import ProfileFormDialog from './ProfileFormDialog';
import styles from './styles';

type ProfileRowProps = {
  profile: Profile;
  isActive: boolean;
  isLast: boolean;
  canDelete: boolean;
  onActivate: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
};

export default function ProfilesScreen() {
  const { profiles, activeProfileId, addProfile, updateProfile, removeProfile, setActive, loading } = useProfiles();
  const dispatch = useDispatch();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => a.label.localeCompare(b.label));
  }, [profiles]);

  const openCreateDialog = useCallback(() => {
    setEditingProfile(null);
    setDialogVisible(true);
  }, []);

  const openEditDialog = useCallback((profile: Profile) => {
    setEditingProfile(profile);
    setDialogVisible(true);
  }, []);

  const dismissDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const handleSave = useCallback(
    async (label: string, serverUrl: string) => {
      if (editingProfile) {
        const updated = { ...editingProfile, label, serverUrl };
        await updateProfile(updated);

        if (editingProfile.id === activeProfileId) {
          ApiClient.setBaseUrl(serverUrl);
        }
      } else {
        const isFirstProfile = profiles.length === 0;
        await addProfile(label, serverUrl);
        if (isFirstProfile) {
          ApiClient.setBaseUrl(serverUrl);
        }
      }

      setDialogVisible(false);
    },
    [editingProfile, activeProfileId, updateProfile, addProfile, profiles.length]
  );

  const handleDelete = useCallback(
    (profile: Profile) => {
      if (profiles.length <= 1) {
        showPopup({ message: 'Cannot delete the only profile.' });
        return;
      }

      showPopup({
        title: `Delete "${profile.label}"?`,
        message: 'This profile will be permanently removed. This action cannot be undone.',
        positiveButton: {
          text: 'Delete',
          callback: async () => {
            const wasActive = profile.id === activeProfileId;
            const success = await removeProfile(profile.id);
            if (success && wasActive) {
              await logoutApi(null).catch(() => {});
              const newActive = await ProfileStorage.getActiveProfile();
              if (newActive) {
                ApiClient.setBaseUrl(newActive.serverUrl);
              }
              dispatch({ type: LOGOUT_REQUEST_SUCCESS });
              NavigationService.reset('Login');
            }
          }
        },
        negativeButtonText: 'Cancel'
      });
    },
    [profiles.length, activeProfileId, removeProfile, dispatch]
  );

  const handleActivate = useCallback(
    (profile: Profile) => {
      showPopup({
        title: `Switch to "${profile.label}"?`,
        message: 'You will be connected to a different server and will need to log in again.',
        positiveButton: {
          text: 'Switch',
          callback: async () => {
            // Log out directly from the API to ensure the token is revoked, but ignore any errors since we want to switch regardless
            await logoutApi(null).catch(() => {});
            await setActive(profile.id);
            ApiClient.setBaseUrl(profile.serverUrl);
            dispatch({ type: LOGOUT_REQUEST_SUCCESS });
            NavigationService.reset('Login');
          }
        },
        negativeButtonText: 'Cancel'
      });
    },
    [setActive, dispatch]
  );

  if (loading) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Profiles"
          subtitle="Tap a profile to set it as active."
          right={() => (
            <IconButton
              icon="plus"
              color={Theme.colors.primary}
              size={24}
              style={styles.addIcon}
              accessibilityLabel="Add profile"
              onPress={openCreateDialog}
            />
          )}
        />
        <Card.Content>
          {sortedProfiles.length === 0 ? (
            <Paragraph>No profiles yet. Tap + to add one.</Paragraph>
          ) : (
            sortedProfiles.map((profile, index) => (
              <ProfileRow
                key={profile.id}
                profile={profile}
                isActive={profile.id === activeProfileId}
                isLast={index === sortedProfiles.length - 1}
                canDelete={profiles.length > 1}
                onActivate={handleActivate}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            ))
          )}
        </Card.Content>
      </Card>

      <ProfileFormDialog
        visible={dialogVisible}
        profile={editingProfile}
        onSave={handleSave}
        onDismiss={dismissDialog}
      />
    </ScrollView>
  );
}

const ProfileRow = memo(function ProfileRow({
  profile,
  isActive,
  isLast,
  canDelete,
  onActivate,
  onEdit,
  onDelete
}: ProfileRowProps) {
  return (
    <View style={[styles.profileRow, isLast && styles.profileRowLast, isActive && styles.profileRowActive]}>
      <View style={isActive ? styles.activeIndicator : styles.inactiveIndicator} />
      <TouchableOpacity
        style={styles.profileTextContainer}
        disabled={isActive}
        activeOpacity={0.6}
        onPress={() => onActivate(profile)}
      >
        <Paragraph style={styles.profileLabel}>{profile.label}</Paragraph>
        <Caption numberOfLines={1}>{profile.serverUrl}</Caption>
      </TouchableOpacity>
      <View style={styles.profileActions}>
        <IconButton
          icon="pencil-outline"
          color={Theme.colors.primary}
          size={20}
          style={styles.profileActionButton}
          accessibilityLabel="Edit profile"
          onPress={() => onEdit(profile)}
        />
        {canDelete && (
          <IconButton
            icon="delete-outline"
            color={Theme.colors.danger}
            size={20}
            style={styles.profileActionButton}
            accessibilityLabel="Delete profile"
            onPress={() => onDelete(profile)}
          />
        )}
      </View>
    </View>
  );
});
