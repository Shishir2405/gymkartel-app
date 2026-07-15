import * as SecureStore from "expo-secure-store";

/**
 * Auth tokens live in the device keychain via expo-secure-store — never in
 * AsyncStorage, never in a Zustand store that could be serialized to disk.
 */
const ACCESS = "gk.accessToken";
const REFRESH = "gk.refreshToken";

export const tokenStore = {
  async getAccess(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS);
  },
  async getRefresh(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH);
  },
  async set(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS, accessToken);
    await SecureStore.setItemAsync(REFRESH, refreshToken);
  },
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS);
    await SecureStore.deleteItemAsync(REFRESH);
  },
};
