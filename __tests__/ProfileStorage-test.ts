import AsyncStorage from '@react-native-async-storage/async-storage';

import { getProfiles, migrate, upgradeStorage } from '../src/components/ProfileStorage';
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

function storage(profiles: Profile[], activeProfileId: string | null, version?: number): any {
  const data: any = { activeProfileId, profiles };
  if (version !== undefined) {
    data.version = version;
  }
  return data;
}

async function store(data: any) {
  await AsyncStorage.setItem('PROFILES', JSON.stringify(data));
}

async function stored(): Promise<ProfileStorageData> {
  return JSON.parse((await AsyncStorage.getItem('PROFILES')) as string);
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('migrate - fresh install', () => {
  it('seeds the test and staging servers at version 2 with test active', async () => {
    const url = await migrate();

    const data = await stored();
    expect(url).toBe(TEST_URL);
    expect(data.version).toBe(2);
    expect(data.profiles.map((p) => [p.label, p.serverUrl])).toEqual([
      ['Test Server', TEST_URL],
      ['Staging Server', STAGING_URL]
    ]);
    expect(data.activeProfileId).toBe(data.profiles[0].id);
  });
});

describe('migrate - existing version 1 storage', () => {
  it('rewrites the previous staging profile in place when it is active', async () => {
    await store(
      storage(
        [profile('t', 'Test Server', TEST_URL), profile('s', 'Old Staging', PREVIOUS_STAGING_URL, { a: 1 })],
        's',
        1
      )
    );

    const url = await migrate();

    const data = await stored();
    expect(url).toBe(STAGING_URL);
    expect(data.version).toBe(2);
    expect(data.activeProfileId).toBe('s');
    expect(data.profiles).toEqual([
      profile('t', 'Test Server', TEST_URL),
      profile('s', 'Old Staging', STAGING_URL, { a: 1 })
    ]);
  });

  it('rewrites the previous staging profile when it is not active and keeps the active server', async () => {
    await store(
      storage([profile('t', 'Test Server', TEST_URL), profile('s', 'Staging Server', PREVIOUS_STAGING_URL)], 't', 1)
    );

    const url = await migrate();

    const data = await stored();
    expect(url).toBe(TEST_URL);
    expect(data.activeProfileId).toBe('t');
    expect(data.profiles[1]).toEqual(profile('s', 'Staging Server', STAGING_URL));
    expect(data.profiles).toHaveLength(2);
  });

  it('keeps both profiles when a new staging profile already exists (no deletion)', async () => {
    await store(
      storage(
        [profile('old', 'Old Staging', PREVIOUS_STAGING_URL), profile('new', 'My Staging', STAGING_URL + '/')],
        'old',
        1
      )
    );

    const url = await migrate();

    const data = await stored();
    expect(url).toBe(STAGING_URL);
    expect(data.activeProfileId).toBe('old');
    expect(data.profiles).toEqual([
      profile('old', 'Old Staging', STAGING_URL),
      profile('new', 'My Staging', STAGING_URL + '/')
    ]);
  });

  it('appends the staging server when no staging profile exists and keeps the active profile', async () => {
    await store(storage([profile('u', 'My Server', 'https://example.org/openboxes/api')], 'u', 1));

    const url = await migrate();

    const data = await stored();
    expect(url).toBe('https://example.org/openboxes/api');
    expect(data.activeProfileId).toBe('u');
    expect(data.profiles).toHaveLength(2);
    expect(data.profiles[0]).toEqual(profile('u', 'My Server', 'https://example.org/openboxes/api'));
    expect(data.profiles[1]).toMatchObject({ label: 'Staging Server', serverUrl: STAGING_URL });
  });

  it('does not append staging when a profile already uses it under /openboxes/api', async () => {
    await store(storage([profile('s', 'Staging', 'https://vvg-stage.openboxes.cloud/openboxes/api')], 's', 1));

    await migrate();

    expect((await stored()).profiles).toHaveLength(1);
  });

  it('treats storage without a version as version 1', async () => {
    await store(storage([profile('s', 'Staging Server', PREVIOUS_STAGING_URL)], 's'));

    const url = await migrate();

    expect(url).toBe(STAGING_URL);
    expect((await stored()).version).toBe(2);
  });

  it('does not rewrite storage that is already at version 2', async () => {
    await store(storage([profile('s', 'Staging Server', PREVIOUS_STAGING_URL)], 's', 2));
    const setItem = jest.spyOn(AsyncStorage, 'setItem');
    setItem.mockClear();

    const url = await migrate();

    expect(url).toBe(PREVIOUS_STAGING_URL);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('runs once: a staging profile deleted after the upgrade is not added back', async () => {
    await store(storage([profile('t', 'Test Server', TEST_URL)], 't', 1));
    await migrate();
    const data = await stored();
    await store({ ...data, profiles: data.profiles.filter((p) => p.serverUrl !== STAGING_URL) });

    await migrate();

    expect((await stored()).profiles).toEqual([profile('t', 'Test Server', TEST_URL)]);
  });
});

describe('migrate - legacy API_URL key', () => {
  it('moves a legacy previous staging URL to the new staging server', async () => {
    await AsyncStorage.setItem('API_URL', PREVIOUS_STAGING_URL);

    const url = await migrate();

    const data = await stored();
    expect(url).toBe(STAGING_URL);
    expect(data.version).toBe(2);
    expect(data.profiles.find((p) => p.id === data.activeProfileId)).toMatchObject({
      label: 'Default',
      serverUrl: STAGING_URL
    });
    expect(await AsyncStorage.getItem('API_URL')).toBeNull();
  });

  it('keeps any other legacy URL as the active Default profile next to the built-ins', async () => {
    await AsyncStorage.setItem('API_URL', 'https://example.org/openboxes/api');

    const url = await migrate();

    const data = await stored();
    expect(url).toBe('https://example.org/openboxes/api');
    expect(data.profiles.map((p) => p.serverUrl)).toEqual(['https://example.org/openboxes/api', TEST_URL, STAGING_URL]);
  });
});

describe('upgradeStorage - URL matching', () => {
  it('matches the previous staging URL with a different host case and a trailing slash', () => {
    const result = upgradeStorage(
      storage([profile('s', 'S', 'https://STAG.vtc.openboxes.com/openboxes/api/')], 's', 1)
    );

    expect(result.profiles[0].serverUrl).toBe(STAGING_URL);
  });

  it('does not match when only the path case differs', () => {
    const odd = 'https://stag.vtc.openboxes.com/OpenBoxes/API';
    const result = upgradeStorage(storage([profile('s', 'S', odd)], 's', 1));

    expect(result.profiles[0].serverUrl).toBe(odd);
    expect(result.profiles).toHaveLength(2);
  });

  it('returns version 2 and does not change the active profile id', () => {
    const result = upgradeStorage(storage([profile('t', 'T', TEST_URL)], 't', 1));

    expect(result.version).toBe(2);
    expect(result.activeProfileId).toBe('t');
  });
});

describe('getProfiles', () => {
  it('reports a missing version as 1', async () => {
    await store(storage([profile('t', 'T', TEST_URL)], 't'));

    expect((await getProfiles()).version).toBe(1);
  });
});
