import { StorageDriver } from "./types";
import { LocalStorageDriver } from "./local-driver";
import { SupabaseStorageDriver } from "./supabase-driver";

export function getStorageDriver(): StorageDriver {
  const provider = (process.env.STORAGE_PROVIDER || "local").trim().toLowerCase();

  switch (provider) {
    case "supabase":
      return new SupabaseStorageDriver();
    case "local":
    default:
      return new LocalStorageDriver();
  }
}

export const storage: StorageDriver = {
  upload: async (options) => {
    const driver = getStorageDriver();
    return driver.upload(options);
  },
  delete: async (path) => {
    const driver = getStorageDriver();
    if (driver.delete) {
      return driver.delete(path);
    }
    return false;
  },
};

export * from "./types";
export { LocalStorageDriver } from "./local-driver";
export { SupabaseStorageDriver } from "./supabase-driver";
