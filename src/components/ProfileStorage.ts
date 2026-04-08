import AsyncStorage from '@react-native-async-storage/async-storage';

import { Profile, ProfileStorageData } from '../types/profile';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const PROFILES_KEY = 'PROFILES';
const LEGACY_API_URL_KEY = 'API_URL';
const CURRENT_VERSION = 1;

function createDefaultStorage(): ProfileStorageData {
  return {
    version: CURRENT_VERSION,
    activeProfileId: null,
    profiles: []
  };
}

function parseStorageData(raw: string | null): ProfileStorageData {
  if (!raw) {
    return createDefaultStorage();
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      version: parsed.version ?? CURRENT_VERSION,
      activeProfileId: parsed.activeProfileId ?? null,
      profiles: Array.isArray(parsed.profiles)
        ? parsed.profiles.map((p: any) => ({
            id: p.id ?? generateId(),
            label: p.label ?? 'Unknown',
            serverUrl: p.serverUrl ?? '',
            settings: p.settings ?? {}
          }))
        : []
    };
  } catch {
    return createDefaultStorage();
  }
}

async function readStorage(): Promise<ProfileStorageData> {
  const raw = await AsyncStorage.getItem(PROFILES_KEY);
  return parseStorageData(raw);
}

async function writeStorage(data: ProfileStorageData): Promise<void> {
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(data));
}

export function createProfile(label: string, serverUrl: string): Profile {
  return {
    id: generateId(),
    label,
    serverUrl: serverUrl.trim(),
    settings: {}
  };
}

export function validateUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return 'URL is required';
  }
  if (!/^https?:\/\/.+/i.test(trimmed)) {
    return 'URL must start with http:// or https://';
  }
  return null;
}

export function validateProfile(label: string, serverUrl: string): string | null {
  if (!label.trim()) {
    return 'Profile label is required';
  }
  return validateUrl(serverUrl);
}

/**
 * Migrates from the legacy single API_URL key to the profiles system.
 * If profiles already exist, this is a no-op.
 * Returns the active profile's server URL (or null if no profiles exist).
 */
export async function migrate(): Promise<string | null> {
  const data = await readStorage();

  if (data.profiles.length > 0) {
    let active = data.profiles.find((p) => p.id === data.activeProfileId);

    if (!active && data.profiles[0]) {
      active = data.profiles[0];
      await writeStorage({ ...data, activeProfileId: active.id });
    }

    return active?.serverUrl ?? null;
  }

  const legacyUrl = await AsyncStorage.getItem(LEGACY_API_URL_KEY);

  if (legacyUrl) {
    const profile = createProfile('Default', legacyUrl);
    const newData: ProfileStorageData = {
      version: CURRENT_VERSION,
      activeProfileId: profile.id,
      profiles: [profile]
    };
    await writeStorage(newData);
    await AsyncStorage.removeItem(LEGACY_API_URL_KEY);
    return profile.serverUrl;
  }

  return null;
}

export async function getProfiles(): Promise<ProfileStorageData> {
  return readStorage();
}

export async function getActiveProfile(): Promise<Profile | null> {
  const data = await readStorage();
  if (!data.activeProfileId) {
    return data.profiles[0] ?? null;
  }
  return data.profiles.find((p) => p.id === data.activeProfileId) ?? data.profiles[0] ?? null;
}

export async function setActiveProfileId(id: string): Promise<void> {
  const data = await readStorage();
  const exists = data.profiles.some((p) => p.id === id);
  if (exists) {
    data.activeProfileId = id;
    await writeStorage(data);
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  const data = await readStorage();
  const index = data.profiles.findIndex((p) => p.id === profile.id);

  if (index >= 0) {
    data.profiles[index] = profile;
  } else {
    data.profiles.push(profile);
  }

  if (!data.activeProfileId && data.profiles.length === 1) {
    data.activeProfileId = profile.id;
  }

  await writeStorage(data);
}

export async function deleteProfile(id: string): Promise<boolean> {
  const data = await readStorage();

  if (data.profiles.length <= 1) {
    return false;
  }

  data.profiles = data.profiles.filter((p) => p.id !== id);

  if (data.activeProfileId === id) {
    data.activeProfileId = data.profiles[0]?.id ?? null;
  }

  await writeStorage(data);
  return true;
}
