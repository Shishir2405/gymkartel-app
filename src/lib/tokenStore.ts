import * as SecureStore from "expo-secure-store";

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
