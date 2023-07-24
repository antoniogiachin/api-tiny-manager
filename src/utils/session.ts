export const session = {
  set: <T>(key: string, value: T): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  get: <T>(key: string): T | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return JSON.parse(sessionStorage.getItem(key)!);
    } catch (e) {}
  },

  remove: (key: string): void => {
    sessionStorage.removeItem(key);
  },
};
