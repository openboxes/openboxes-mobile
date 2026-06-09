import AsyncStorage from '@react-native-async-storage/async-storage';

import { Profile, ProfileStorageData } from '../types/profile';
import { createEventEmitter } from '../utils/EventEmitter';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const PROFILES_KEY = 'PROFILES';
const LEGACY_API_URL_KEY = 'API_URL';
const CURRENT_VERSION = 1;

// The first one in the list will be used as the default active profile if no activeProfileId is set
const DEFAULT_SERVERS = [
  { label: 'Test Server', serverUrl: 'https://vvg.openboxes.com/openboxes/api' },
  { label: 'Staging Server', serverUrl: 'https://stag.vtc.openboxes.com/openboxes/api' }
];

const emitter = createEventEmitter();
export const subscribe = emitter.subscribe;

export function createStorage(profiles: Profile[] = [], activeProfileId?: string): ProfileStorageData {
  return {
    version: CURRENT_VERSION,
    activeProfileId: activeProfileId ?? profiles[0]?.id ?? null,
    profiles
  };
}

function parseStorageData(raw: string | null): ProfileStorageData {
  if (!raw) {
    return createStorage();
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
    return createStorage();
  }
}

async function readStorage(): Promise<ProfileStorageData> {
  const raw = await AsyncStorage.getItem(PROFILES_KEY);
  return parseStorageData(raw);
}

async function writeStorage(data: ProfileStorageData): Promise<void> {
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(data));
  emitter.emit();
}

export function createProfile(label: string, serverUrl: string): Profile {
  return {
    id: generateId(),
    label,
    serverUrl: serverUrl.trim(),
    settings: {}
  };
}

function normalizeUrl(url: string): string {
  return url.trim().toLowerCase().replace(/\/+$/, '');
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
 * Initializes profiles and returns the active server URL.
 * 1. Profiles exist → use them as-is
 * 2. No profiles, legacy API_URL exists → create Default (from legacy) + default servers
 * 3. No profiles, no legacy → create default servers
 */
export async function migrate(): Promise<string | null> {
  const data = await readStorage();

  // Path 1: profiles already exist
  if (data.profiles.length > 0) {
    let active = data.profiles.find((p) => p.id === data.activeProfileId);

    if (!active) {
      active = data.profiles[0];
      await writeStorage(createStorage(data.profiles, active.id));
    }

    return active.serverUrl;
  }

  // Path 2: legacy API_URL migration
  const legacyUrl = await AsyncStorage.getItem(LEGACY_API_URL_KEY);

  if (legacyUrl) {
    const legacyProfile = createProfile('Default', legacyUrl);
    const normalizedLegacy = normalizeUrl(legacyUrl);
    const profiles = [legacyProfile];

    for (const server of DEFAULT_SERVERS) {
      if (normalizeUrl(server.serverUrl) !== normalizedLegacy) {
        profiles.push(createProfile(server.label, server.serverUrl));
      }
    }

    await writeStorage(createStorage(profiles, legacyProfile.id));
    await AsyncStorage.removeItem(LEGACY_API_URL_KEY);
    return legacyProfile.serverUrl;
  }

  // Path 3: fresh install
  const profiles = DEFAULT_SERVERS.map((s) => createProfile(s.label, s.serverUrl));
  await writeStorage(createStorage(profiles));

  return profiles[0].serverUrl;
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

  if (!data.activeProfileId) {
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
