import type { CacheStrategy } from '@/cache-manager/types';
import type { AxiosInstance } from 'axios';

export type NewManagerParams = {
  cacheStrategy: CacheStrategy;
  cacheTime: number;
  protectedInstance?: AxiosInstance;
};
