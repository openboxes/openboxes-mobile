export type Profile = {
  id: string;
  label: string;
  serverUrl: string;
  settings: Record<string, unknown>;
};

export type ProfileStorageData = {
  version: number;
  activeProfileId: string | null;
  profiles: Profile[];
};
