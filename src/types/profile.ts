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
  // Built-in server URLs already offered on this device (see syncBuiltInServers)
  seededServerUrls?: string[];
  // The built-in server list the last sync ran against
  builtInsSignature?: string;
};
