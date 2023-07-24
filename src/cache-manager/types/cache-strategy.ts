export const CacheStrategies = {
  Singleton: 'singleton',
  Local: 'local',
  Session: 'session',
  IndexedDB: 'indexedDB',
} as const;
export type CacheStrategy =
  (typeof CacheStrategies)[keyof typeof CacheStrategies];
