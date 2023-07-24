import type { cacheKey } from './cache-key';
import type { Cached } from './cached';

export type CacheModel = {
  timestamp: number;
  [cacheKey]: Record<string, Cached>;
};
