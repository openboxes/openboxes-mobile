import AsyncStorage from '@react-native-async-storage/async-storage';

import { migrate, syncBuiltInServers, validateProfile } from '../src/components/ProfileStorage';
import { Profile, ProfileStorageData } from '../src/types/profile';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const TEST_URL = 'https://vvg.openboxes.com/openboxes/api';
const STAGING_URL = 'https://vvg-stage.openboxes.cloud/api';
const PREVIOUS_STAGING_URL = 'https://stag.vtc.openboxes.com/openboxes/api';

function profile(id: string, label: string, serverUrl: string, settings: Record<string, unknown> = {}): Profile {
  return { id, label, serverUrl, settings };
}

// Storage as written by the app before built-in sync existed
function oldStorage(profiles: Profile[], activeProfileId: string | null): ProfileStorageData {
  return { version: 1, activeProfileId, profiles };
}

async function store(data: any) {
  await AsyncStorage.setItem('PROFILES', JSON.stringify(data));
}

async function stored(): Promise<ProfileStorageData> {
  return JSON.parse((await AsyncStorage.getItem('PROFILES')) as string);
}

function labelsAndUrls(data: ProfileStorageData) {
  return data.profiles.map((p) => [p.label, p.serverUrl]);
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('migrate - fresh install', () => {
  it('seeds every built-in server with the first one active', async () => {
    const url = await migrate();

    const data = await stored();
    expect(url).toBe(TEST_URL);
    expect(labelsAndUrls(data)).toEqual([
      ['Test Server', TEST_URL],
      ['Staging Server', STAGING_URL],
      ['Previous Staging Server', PREVIOUS_STAGING_URL]
    ]);
    expect(data.activeProfileId).toBe(data.profiles[0].id);
  });
});

describe('migrate - an installed app from before the sync', () => {
  it('adds the new staging server, relabels the previous one and moves the active selection to the new one', async () => {
    await store(
      oldStorage(
        [profile('t', 'Test Server', TEST_URL), profile('s', 'Staging Server', PREVIOUS_STAGING_URL, { a: 1 })],
        's'
      )
    );

    const url = await migrate();

    const data = await stored();
    expect(url).toBe(STAGING_URL);
    expect(data.profiles[0]).toEqual(profile('t', 'Test Server', TEST_URL));
    expect(data.profiles[1]).toEqual(profile('s', 'Previous Staging Server', PREVIOUS_STAGING_URL, { a: 1 }));
    expect(data.profiles[2]).toMatchObject({ label: 'Staging Server', serverUrl: STAGING_URL });
    expect(data.profiles).toHaveLength(3);
    expect(data.activeProfileId).toBe(data.profiles[2].id);
  });

  it('keeps the active selection when the previous staging profile is not active', async () => {
    await store(
      oldStorage([profile('t', 'Test Server', TEST_URL), profile('s', 'Staging Server', PREVIOUS_STAGING_URL)], 't')
    );

    const url = await migrate();

    expect(url).toBe(TEST_URL);
    expect((await stored()).activeProfileId).toBe('t');
  });

  it('moves the active selection to a new staging profile the user already had', async () => {
    await store(
      oldStorage(
        [
          profile('s', 'Staging Server', PREVIOUS_STAGING_URL),
          profile('n', 'Mine', 'https://VVG-STAGE.openboxes.cloud/openboxes/api/')
        ],
        's'
      )
    );

    await migrate();

    const data = await stored();
    expect(data.activeProfileId).toBe('n');
    expect(data.profiles).toHaveLength(2);
  });

  it('keeps an active previous staging profile the user renamed', async () => {
    await store(oldStorage([profile('s', 'Old box', PREVIOUS_STAGING_URL)], 's'));

    const url = await migrate();

    expect(url).toBe(PREVIOUS_STAGING_URL);
    expect((await stored()).activeProfileId).toBe('s');
  });

  it('keeps the previous staging profile active when the user deleted the new one', async () => {
    await store({
      ...oldStorage([profile('s', 'Staging Server', PREVIOUS_STAGING_URL)], 's'),
      seededServerUrls: [TEST_URL, STAGING_URL, PREVIOUS_STAGING_URL]
    });

    const url = await migrate();

    const data = await stored();
    expect(url).toBe(PREVIOUS_STAGING_URL);
    expect(data.activeProfileId).toBe('s');
    expect(data.profiles).toHaveLength(1);
  });

  it('moves the active selection when the stored active id is missing and the previous staging profile is first', async () => {
    await store(
      oldStorage([profile('s', 'Staging Server', PREVIOUS_STAGING_URL), profile('t', 'Test Server', TEST_URL)], 'gone')
    );

    const url = await migrate();

    const data = await stored();
    expect(url).toBe(STAGING_URL);
    expect(data.activeProfileId).toBe(data.profiles[2].id);
  });

  it('moves the active selection only once, so switching back to the previous staging server sticks', async () => {
    await store(
      oldStorage([profile('t', 'Test Server', TEST_URL), profile('s', 'Staging Server', PREVIOUS_STAGING_URL)], 's')
    );
    await migrate();
    await store({ ...(await stored()), activeProfileId: 's' });

    const url = await migrate();

    expect(url).toBe(PREVIOUS_STAGING_URL);
    expect((await stored()).activeProfileId).toBe('s');
  });

  it('keeps labels the user chose', async () => {
    await store(oldStorage([profile('s', 'Old box', PREVIOUS_STAGING_URL)], 's'));

    await migrate();

    expect((await stored()).profiles[0].label).toBe('Old box');
  });

  it('does not add a built-in a profile already uses, ignoring host case and a trailing slash', async () => {
    await store(oldStorage([profile('n', 'Mine', 'https://VVG-STAGE.openboxes.cloud/api/')], 'n'));

    await migrate();

    const urls = (await stored()).profiles.map((p) => p.serverUrl);
    expect(urls.filter((u) => u.toLowerCase().includes('vvg-stage'))).toHaveLength(1);
  });

  it.each(['https://vvg-stage.openboxes.cloud/openboxes/api', 'https://vvg-stage.openboxes.cloud:443/api'])(
    'does not add the staging server when a profile already reaches it as %s',
    async (url) => {
      await store(oldStorage([profile('n', 'Mine', url)], 'n'));

      await migrate();

      const urls = (await stored()).profiles.map((p) => p.serverUrl);
      expect(urls.filter((u) => u.includes('vvg-stage'))).toEqual([url]);
    }
  );

  it('treats a different path case as a different server', async () => {
    await store(oldStorage([profile('n', 'Mine', 'https://vvg-stage.openboxes.cloud/API')], 'n'));

    await migrate();

    expect((await stored()).profiles.map((p) => p.serverUrl)).toContain(STAGING_URL);
  });

  it('keeps user profiles and the active one untouched, and does not restore built-ins the user deleted', async () => {
    await store(oldStorage([profile('u', 'My Server', 'https://example.org/openboxes/api')], 'u'));

    const url = await migrate();

    const data = await stored();
    expect(url).toBe('https://example.org/openboxes/api');
    expect(data.activeProfileId).toBe('u');
    expect(labelsAndUrls(data)).toEqual([
      ['My Server', 'https://example.org/openboxes/api'],
      ['Staging Server', STAGING_URL]
    ]);
  });

  it('picks the first profile when the stored active id is missing', async () => {
    await store(oldStorage([profile('t', 'Test Server', TEST_URL)], 'gone'));

    const url = await migrate();

    expect(url).toBe(TEST_URL);
    expect((await stored()).activeProfileId).toBe('t');
  });
});

describe('migrate - after a sync', () => {
  it('does not write anything when the built-in list has not changed', async () => {
    await migrate();
    const setItem = jest.spyOn(AsyncStorage, 'setItem');
    setItem.mockClear();

    await migrate();

    expect(setItem).not.toHaveBeenCalled();
  });

  it('runs again when a previous label is added to the list', async () => {
    await migrate();
    const data = await stored();
    await store({ ...data, builtInsSignature: data.builtInsSignature!.replace(/\["Staging Server"\]/, '[]') });
    const setItem = jest.spyOn(AsyncStorage, 'setItem');
    setItem.mockClear();

    await migrate();

    expect(setItem).toHaveBeenCalled();
  });

  it('does not add back a built-in the user deleted', async () => {
    await migrate();
    const data = await stored();
    await store({ ...data, profiles: data.profiles.filter((p) => p.serverUrl !== STAGING_URL) });

    await migrate();

    expect((await stored()).profiles.map((p) => p.serverUrl)).not.toContain(STAGING_URL);
  });

  it('does not add back a deleted built-in when the list changes later', async () => {
    await migrate();
    const data = await stored();
    await store({
      ...data,
      profiles: data.profiles.filter((p) => p.serverUrl !== STAGING_URL),
      builtInsSignature: 'an older list'
    });

    await migrate();

    expect((await stored()).profiles.map((p) => p.serverUrl)).not.toContain(STAGING_URL);
  });

  it('keeps a built-in label the user gave to another built-in server when the list changes', async () => {
    await migrate();
    const data = await stored();
    const renamed = data.profiles.map((p) => (p.serverUrl === STAGING_URL ? { ...p, label: 'Test Server' } : p));
    await store({ ...data, profiles: renamed, builtInsSignature: 'an older list' });

    await migrate();

    expect((await stored()).profiles.find((p) => p.serverUrl === STAGING_URL)!.label).toBe('Test Server');
  });

  it('does not override a user who renamed a profile to a built-in label', async () => {
    await migrate();
    const data = await stored();
    const renamed = data.profiles.map((p) => (p.serverUrl === STAGING_URL ? { ...p, label: 'Test Server' } : p));
    await store({ ...data, profiles: renamed });

    await migrate();

    expect((await stored()).profiles.find((p) => p.serverUrl === STAGING_URL)!.label).toBe('Test Server');
  });
});

describe('migrate - legacy API_URL key', () => {
  it('keeps the legacy URL as the active Default profile next to the built-ins', async () => {
    await AsyncStorage.setItem('API_URL', 'https://example.org/openboxes/api');

    const url = await migrate();

    const data = await stored();
    expect(url).toBe('https://example.org/openboxes/api');
    expect(labelsAndUrls(data)).toEqual([
      ['Default', 'https://example.org/openboxes/api'],
      ['Test Server', TEST_URL],
      ['Staging Server', STAGING_URL],
      ['Previous Staging Server', PREVIOUS_STAGING_URL]
    ]);
    expect(data.activeProfileId).toBe(data.profiles[0].id);
    expect(await AsyncStorage.getItem('API_URL')).toBeNull();
  });

  it('does not duplicate a built-in that is the legacy URL', async () => {
    await AsyncStorage.setItem('API_URL', TEST_URL);

    await migrate();

    const data = await stored();
    expect(data.profiles.filter((p) => p.serverUrl === TEST_URL)).toHaveLength(1);
    expect(data.profiles[0].label).toBe('Default');
  });
});

describe('syncBuiltInServers', () => {
  it('never removes a profile, and keeps the active one when it is not being replaced', () => {
    const before = oldStorage(
      [profile('a', 'A', 'https://a.example.org/api'), profile('s', 'Staging Server', PREVIOUS_STAGING_URL)],
      'a'
    );

    const after = syncBuiltInServers(before);

    expect(after.activeProfileId).toBe('a');
    expect(after.profiles.map((p) => p.id).slice(0, 2)).toEqual(['a', 's']);
  });

  it('returns the same object when the list is unchanged', () => {
    const synced = syncBuiltInServers(oldStorage([], null));

    expect(syncBuiltInServers(synced)).toBe(synced);
  });
});

describe('validateProfile', () => {
  it('checks the address of a new profile', () => {
    expect(validateProfile('New', 'ftp://example.org')).toBe('URL must start with http:// or https://');
  });

  it('lets a profile be renamed when its stored address no longer passes validation', () => {
    expect(validateProfile('Renamed', 'https://exa mple.org', 'https://exa mple.org')).toBeNull();
  });

  it('treats a stored address with surrounding spaces as unchanged', () => {
    expect(validateProfile('Renamed', 'https://exa mple.org', ' https://exa mple.org ')).toBeNull();
  });

  it('checks the address again once it is changed', () => {
    expect(validateProfile('Renamed', 'https://exa mple.org/api', 'https://exa mple.org')).toBe(
      'Enter a valid server address'
    );
  });

  it('still requires a label when the address is unchanged', () => {
    expect(validateProfile('  ', 'https://example.org', 'https://example.org')).toBe('Profile label is required');
  });
});
