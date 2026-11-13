import AsyncStorage from '@react-native-async-storage/async-storage';

import { Profile, ProfileStorageData } from '../types/profile';
import { createEventEmitter } from '../utils/EventEmitter';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const PROFILES_KEY = 'PROFILES';
const LEGACY_API_URL_KEY = 'API_URL';
const CURRENT_VERSION = 2;

const STAGING_SERVER = { label: 'Staging Server', serverUrl: 'https://vvg-stage.openboxes.cloud/api' };

// The first one in the list will be used as the default active profile if no activeProfileId is set
const DEFAULT_SERVERS = [
  { label: 'Test Server', serverUrl: 'https://vvg.openboxes.com/openboxes/api' },
  STAGING_SERVER
];

// The staging server moved; profiles still pointing at the old address are moved by upgradeStorage
const PREVIOUS_STAGING_URL = 'https://stag.vtc.openboxes.com/openboxes/api';
const STAGING_URLS = [STAGING_SERVER.serverUrl, 'https://vvg-stage.openboxes.cloud/openboxes/api'];

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
      // Storage written before versioning was acted on is treated as the oldest version
      version: parsed.version ?? 1,
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

// Scheme and host are case-insensitive, the path is not
function canonicalServerUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  const match = /^([a-z][a-z0-9+.-]*:\/\/[^/]*)(.*)$/i.exec(trimmed);
  return match ? match[1].toLowerCase() + match[2] : trimmed;
}

function isSameServerUrl(a: string, b: string): boolean {
  return canonicalServerUrl(a) === canonicalServerUrl(b);
}

/**
 * Upgrades stored profiles to the current version (2):
 * - profiles on the previous staging server are moved to the new staging server in place
 *   (id, label, settings and the active selection are kept)
 * - the staging server is added when no profile uses it yet
 * Profiles are never removed and the active profile never changes.
 */
export function upgradeStorage(data: ProfileStorageData): ProfileStorageData {
  const profiles = data.profiles.map((p) =>
    isSameServerUrl(p.serverUrl, PREVIOUS_STAGING_URL) ? { ...p, serverUrl: STAGING_SERVER.serverUrl } : p
  );

  const hasStaging = profiles.some((p) => STAGING_URLS.some((url) => isSameServerUrl(p.serverUrl, url)));
  if (!hasStaging) {
    profiles.push(createProfile(STAGING_SERVER.label, STAGING_SERVER.serverUrl));
  }

  return { ...data, version: CURRENT_VERSION, profiles };
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
    const current = data.version < CURRENT_VERSION ? upgradeStorage(data) : data;
    let active = current.profiles.find((p) => p.id === current.activeProfileId);

    if (!active) {
      active = current.profiles[0];
      await writeStorage(createStorage(current.profiles, active.id));
    } else if (current !== data) {
      await writeStorage(current);
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

    // The legacy URL may itself be the previous staging server
    const upgraded = upgradeStorage(createStorage(profiles, legacyProfile.id));
    await writeStorage(upgraded);
    await AsyncStorage.removeItem(LEGACY_API_URL_KEY);
    return upgraded.profiles.find((p) => p.id === legacyProfile.id)!.serverUrl;
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
