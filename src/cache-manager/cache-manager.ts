import {
  type Cached,
  cacheKey,
  type CacheModel,
  CacheStrategies,
  type CacheStrategy,
} from './types';

import type { Result } from '@/types';
import { forage, local, session } from '@/utils';

interface StorageManager {
  get(key: string): Promise<Result<Cached>>;
  set<T>(key: string, data: T): Promise<Result>;
  remove(key: string): Promise<Result>;
}

export class CacheManager implements StorageManager {
  private getBaseCacheModel(): CacheModel {
    return {
      timestamp: new Date().getTime(),
      [cacheKey]: {},
    };
  }

  private createCached<T>(data: T): Cached {
    const cached = {
      timestamp: new Date().getTime(),
      data: JSON.stringify(data),
    };
    return cached;
  }

  private strategy: CacheStrategy = CacheStrategies.Singleton;
  private singleton: CacheModel = this.getBaseCacheModel();
  // cache valid for 24 hours
  private cacheValidTime: number = 1000 * 60 * 60 * 24;

  private checkExpireAndReturn(cached?: CacheModel | null): CacheModel {
    // se non ho cache restituisco modello base
    if (!cached) {
      return this.getBaseCacheModel();
    }

    // se cache scaduta pulisco la cache presente e restituisco modello base
    if (
      cached.timestamp &&
      cached.timestamp + this.cacheValidTime < new Date().getTime()
    ) {
      // pulisce cache
      this.clearBaseCache();
      // restituisce cache modello base
      return this.getBaseCacheModel();
    }

    // se cache valida restituisco cache
    return cached;
  }

  private async clearBaseCache(): Promise<void> {
    switch (this.strategy) {
      case CacheStrategies.Singleton:
        this.singleton = this.getBaseCacheModel();
        break;
      case CacheStrategies.IndexedDB:
        forage.remove(cacheKey);
        break;
      case CacheStrategies.Local:
        local.remove(cacheKey);
        break;
      case CacheStrategies.Session:
        session.remove(cacheKey);
        break;
    }

    await this.set(cacheKey, this.getBaseCacheModel()[cacheKey]);
  }

  private async getCache(): Promise<Result<CacheModel>> {
    const res: Result<CacheModel> = {
      Ok: null,
      Err: null,
    };

    try {
      switch (this.strategy) {
        case CacheStrategies.IndexedDB: {
          try {
            const fromIndexedDB = await forage.get<CacheModel>(cacheKey);

            res.Ok = this.checkExpireAndReturn(fromIndexedDB);
            return Promise.resolve(res);
          } catch (e) {
            if (e instanceof Error) {
              res.Err = e;
            }
          }
          break;
        }
        case CacheStrategies.Singleton: {
          const cache = this.singleton;
          res.Ok = this.checkExpireAndReturn(cache);
          break;
        }

        case CacheStrategies.Session:
        case CacheStrategies.Local: {
          try {
            const fromLocal =
              this.strategy === CacheStrategies.Session
                ? session.get<CacheModel>(cacheKey)
                : local.get<CacheModel>(cacheKey);

            res.Ok = this.checkExpireAndReturn(fromLocal);
          } catch (e) {
            if (e instanceof Error) {
              res.Err = e;
            }
          }
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        res.Err = e;
      }
    }

    return Promise.resolve(res);
  }

  constructor(strategy: CacheStrategy, cacheTime?: number) {
    this.strategy = strategy;
    this.cacheValidTime = cacheTime || this.cacheValidTime;

    // Init cache
    switch (this.strategy) {
      case CacheStrategies.IndexedDB:
        forage.set(cacheKey, this.getBaseCacheModel());
        break;
      case CacheStrategies.Local:
      case CacheStrategies.Session:
        this.strategy === CacheStrategies.Local
          ? local.set(cacheKey, this.getBaseCacheModel())
          : session.set(cacheKey, this.getBaseCacheModel());
        break;
      default:
        this.singleton = this.getBaseCacheModel();
    }
  }

  public async get(key: string): Promise<Result<Cached>> {
    const res: Result<Cached> = {
      Ok: null,
      Err: null,
    };

    const cache = await this.getCache();
    console.log('cache', cache);
    const { Ok, Err } = cache;

    if (Err) {
      res.Err = Err;
      return res;
    }

    if (Ok) {
      const cached = Ok[cacheKey][key];

      if (cached) {
        res.Ok = cached as Cached;
      }

      res.Err = new Error('Cache not found');
    }

    return res;
  }

  public async set<T>(key: string, data: T): Promise<Result> {
    const res: Result = {
      Ok: null,
      Err: null,
    };

    const { Ok: cache, Err } = await this.getCache();

    if (Err) {
      res.Err = Err;
      return res;
    }

    if (cache) {
      const cached = this.createCached<T>(data);
      cache[cacheKey][key] = cached;
      console.log('cached', cache, cached);

      try {
        switch (this.strategy) {
          case CacheStrategies.Singleton:
            this.singleton = cache;
            break;
          case CacheStrategies.Session:
          case CacheStrategies.Local:
            this.strategy === CacheStrategies.Session
              ? session.set(cacheKey, cache)
              : local.set(cacheKey, cache);
            break;
          case CacheStrategies.IndexedDB:
            await forage.set(cacheKey, cache);
        }

        res.Ok = true;
      } catch (e) {
        if (e instanceof Error) {
          res.Err = e;
        }
      }
    }

    return res;
  }

  public async remove(key: string): Promise<Result> {
    const res: Result = {
      Ok: null,
      Err: null,
    };

    const { Ok: cache, Err } = await this.getCache();

    if (Err) {
      res.Err = Err;
      return res;
    }

    if (cache) {
      delete cache[cacheKey][key];

      try {
        this.set(cacheKey, cache);
        res.Ok = true;
      } catch (e) {
        if (e instanceof Error) {
          res.Err = e;
        }
      }
    }

    return res;
  }
}
