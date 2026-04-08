import { useCallback, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { Profile, ProfileStorageData } from '../types/profile';
import * as ProfileStorage from '../components/ProfileStorage';

type UseProfilesResult = {
  profiles: Profile[];
  activeProfileId: string | null;
  activeProfile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  addProfile: (label: string, serverUrl: string) => Promise<Profile>;
  updateProfile: (profile: Profile) => Promise<void>;
  removeProfile: (id: string) => Promise<boolean>;
  setActive: (id: string) => Promise<void>;
};

export function useProfiles(): UseProfilesResult {
  const [data, setData] = useState<ProfileStorageData>(() => ProfileStorage.createStorage());
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const refresh = useCallback(async () => {
    try {
      const stored = await ProfileStorage.getProfiles();
      setData(stored);
    } catch {
      setData(ProfileStorage.createStorage());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      refresh();
    }
  }, [isFocused, refresh]);

  useEffect(() => {
    return ProfileStorage.subscribe(refresh);
  }, [refresh]);

  const activeProfile = data.profiles.find((p) => p.id === data.activeProfileId) ?? data.profiles[0] ?? null;

  const addProfile = useCallback(async (label: string, serverUrl: string): Promise<Profile> => {
    const profile = ProfileStorage.createProfile(label, serverUrl);
    await ProfileStorage.saveProfile(profile);
    return profile;
  }, []);

  const updateProfile = useCallback(async (profile: Profile) => {
    await ProfileStorage.saveProfile(profile);
  }, []);

  const removeProfile = useCallback(async (id: string): Promise<boolean> => {
    return ProfileStorage.deleteProfile(id);
  }, []);

  const setActive = useCallback(async (id: string) => {
    await ProfileStorage.setActiveProfileId(id);
  }, []);

  return {
    profiles: data.profiles,
    activeProfileId: data.activeProfileId,
    activeProfile,
    loading,
    refresh,
    addProfile,
    updateProfile,
    removeProfile,
    setActive
  };
}
