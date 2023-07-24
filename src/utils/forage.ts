import localforage from 'localforage';

export const forage = {
  get: async <T>(key: string): Promise<T | undefined | null> => {
    return await localforage.getItem<T>(key);
  },

  set: async <T>(key: string, item: T): Promise<void> => {
    await localforage.setItem<T>(key, item);
  },

  remove: async (key: string): Promise<void> => {
    await localforage.removeItem(key);
  },

  clear: async (): Promise<void> => {
    await localforage.clear();
  },
};
