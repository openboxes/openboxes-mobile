import AsyncStorage from '@react-native-async-storage/async-storage';

import { Profile, ProfileStorageData } from '../types/profile';
import { createEventEmitter } from '../utils/EventEmitter';
import { validateServerUrl } from '../utils/serverUrl';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const PROFILES_KEY = 'PROFILES';
const LEGACY_API_URL_KEY = 'API_URL';
const CURRENT_VERSION = 1;

// TODO: remove these hard-coded servers before launch and supply the list at build time instead.
// Changing this list needs no migration code: syncBuiltInServers offers new entries to installed apps.
// The first one in the list will be used as the default active profile on a fresh install.
// `previousLabels` lists the labels this server had in earlier versions of the list, so profiles that
// still carry one get the current label. `aliases` are other URLs that reach the same server.
// `replacedBy` is the URL of the built-in server that takes over from this one: an active profile that
// gets the current label is switched to that server's profile.
type BuiltInServer = {
  label: string;
  serverUrl: string;
  previousLabels?: string[];
  aliases?: string[];
  replacedBy?: string;
};

const BUILT_IN_SERVERS: BuiltInServer[] = [
  { label: 'Test Server', serverUrl: 'https://vvg.openboxes.com/openboxes/api' },
  {
    label: 'Staging Server',
    serverUrl: 'https://vvg-stage.openboxes.cloud/api',
    aliases: ['https://vvg-stage.openboxes.cloud/openboxes/api']
  },
  {
    label: 'Previous Staging Server',
    serverUrl: 'https://stag.vtc.openboxes.com/openboxes/api',
    previousLabels: ['Staging Server'],
    replacedBy: 'https://vvg-stage.openboxes.cloud/api'
  }
];

// The built-in servers apps shipped with before the sync existed. Storage written by those versions has
// no record of what it was offered, but it was seeded with exactly these, so only newer ones are added.
const PRE_SYNC_BUILT_IN_URLS = [
  'https://vvg.openboxes.com/openboxes/api',
  'https://stag.vtc.openboxes.com/openboxes/api'
];

const emitter = createEventEmitter();
export const subscribe = emitter.subscribe;

export function createStorage(profiles: Profile[] = [], activeProfileId?: string): ProfileStorageData {
  return {
    version: CURRENT_VERSION,
    activeProfileId: activeProfileId ?? profiles[0]?.id ?? null,
    profiles,
    seededServerUrls: []
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
      seededServerUrls: Array.isArray(parsed.seededServerUrls)
        ? parsed.seededServerUrls.filter((u: unknown) => typeof u === 'string')
        : PRE_SYNC_BUILT_IN_URLS,
      builtInsSignature: typeof parsed.builtInsSignature === 'string' ? parsed.builtInsSignature : undefined,
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

// Scheme and host are case-insensitive and a default port is the same as none; the path is case-sensitive
function canonicalServerUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  const match = /^([a-z][a-z0-9+.-]*:\/\/[^/]*)(.*)$/i.exec(trimmed);
  if (!match) {
    return trimmed;
  }
  const origin = match[1].toLowerCase().replace(/^(https:\/\/[^/]*?):0*443$|^(http:\/\/[^/]*?):0*80$/, '$1$2');
  return origin + match[2];
}

function matchesBuiltIn(server: { serverUrl: string; aliases?: string[] }, url: string): boolean {
  return [server.serverUrl, ...(server.aliases ?? [])].some((u) => isSameServerUrl(u, url));
}

function isSameServerUrl(a: string, b: string): boolean {
  return canonicalServerUrl(a) === canonicalServerUrl(b);
}

function builtInsSignature(): string {
  return JSON.stringify(
    BUILT_IN_SERVERS.map((s) => [
      s.label,
      canonicalServerUrl(s.serverUrl),
      s.previousLabels ?? [],
      s.replacedBy ? canonicalServerUrl(s.replacedBy) : null
    ])
  );
}

/**
 * Brings stored profiles in line with the built-in server list, when that list has changed since the
 * last sync:
 * - a built-in server not offered on this device before is added, unless a profile already uses its URL
 *   (a built-in the user deleted is not added again)
 * - a profile on a built-in URL that still carries one of that server's earlier labels gets the current
 *   label, so environments stay distinguishable; labels the user chose are kept
 * - when that relabeled profile is the active one and its server has a `replacedBy`, the replacing
 *   server's profile becomes active
 * Profiles are never removed, and the active profile changes only in that last case.
 */
export function syncBuiltInServers(data: ProfileStorageData): ProfileStorageData {
  const signature = builtInsSignature();
  if (data.builtInsSignature === signature) {
    return data;
  }

  const seeded = new Set((data.seededServerUrls ?? []).map(canonicalServerUrl));

  // The profile the app runs on: the stored active one, or the first profile when that id is missing
  const activeId = data.profiles.some((p) => p.id === data.activeProfileId)
    ? data.activeProfileId
    : data.profiles[0]?.id;
  let replacedActiveBy: string | undefined;
  const profiles = data.profiles.map((p) => {
    const builtIn = BUILT_IN_SERVERS.find((s) => matchesBuiltIn(s, p.serverUrl));
    if (!builtIn?.previousLabels?.includes(p.label)) {
      return p;
    }
    if (p.id === activeId) {
      replacedActiveBy = builtIn.replacedBy;
    }
    return { ...p, label: builtIn.label };
  });

  for (const server of BUILT_IN_SERVERS) {
    const url = canonicalServerUrl(server.serverUrl);
    if (!seeded.has(url) && !profiles.some((p) => matchesBuiltIn(server, p.serverUrl))) {
      profiles.push(createProfile(server.label, server.serverUrl));
    }
    seeded.add(url);
  }

  let activeProfileId = data.activeProfileId;
  if (replacedActiveBy) {
    const replacement = BUILT_IN_SERVERS.find((s) => isSameServerUrl(s.serverUrl, replacedActiveBy!));
    const target = replacement && profiles.find((p) => matchesBuiltIn(replacement, p.serverUrl));
    if (target) {
      activeProfileId = target.id;
    }
  }

  return { ...data, profiles, activeProfileId, seededServerUrls: [...seeded], builtInsSignature: signature };
}

export function validateUrl(url: string): string | null {
  return validateServerUrl(url);
}

/**
 * Validates the profile form. `storedUrl` is the URL of the profile being edited: when the URL is left
 * as it is, only the label is checked, so a profile saved before the current address rules can still
 * be renamed.
 */
export function validateProfile(label: string, serverUrl: string, storedUrl?: string): string | null {
  if (!label.trim()) {
    return 'Profile label is required';
  }
  if (storedUrl !== undefined && serverUrl.trim() === storedUrl.trim()) {
    return null;
  }
  return validateUrl(serverUrl);
}

/**
 * Initializes profiles and returns the active server URL.
 * 1. Profiles exist → keep them, and sync the built-in servers if the list changed
 * 2. No profiles, legacy API_URL exists → create Default (from legacy) + built-in servers
 * 3. No profiles, no legacy → create built-in servers
 */
export async function migrate(): Promise<string | null> {
  const data = await readStorage();

  // Path 1: profiles already exist
  if (data.profiles.length > 0) {
    const current = syncBuiltInServers(data);
    let active = current.profiles.find((p) => p.id === current.activeProfileId);

    if (!active) {
      active = current.profiles[0];
      await writeStorage({ ...current, activeProfileId: active.id });
    } else if (current !== data) {
      await writeStorage(current);
    }

    return active.serverUrl;
  }

  // Path 2: legacy API_URL migration
  const legacyUrl = await AsyncStorage.getItem(LEGACY_API_URL_KEY);

  if (legacyUrl) {
    const legacyProfile = createProfile('Default', legacyUrl);
    await writeStorage(syncBuiltInServers(createStorage([legacyProfile], legacyProfile.id)));
    await AsyncStorage.removeItem(LEGACY_API_URL_KEY);
    return legacyProfile.serverUrl;
  }

  // Path 3: fresh install
  const fresh = syncBuiltInServers(createStorage());
  await writeStorage({ ...fresh, activeProfileId: fresh.profiles[0].id });

  return fresh.profiles[0].serverUrl;
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
