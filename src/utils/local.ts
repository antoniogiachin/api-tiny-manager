export const local = {
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get: <T>(key: string): T | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return JSON.parse(localStorage.getItem(key)!);
    } catch (e) {}
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};
