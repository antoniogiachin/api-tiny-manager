import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

import type { GetParams, PostParams } from './types';

import { CacheManager } from '@/cache-manager';
import { type CacheStrategy, unwrap } from '@/cache-manager/types';
import { promiseResolver } from '@/promise-resolver';
import type { Resolver } from '@/promise-resolver/types';

const baseQuery = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// singleton
export class ApiManager {
  private protectedInstance?: AxiosInstance;
  private cacheInstance?: CacheManager;

  constructor(
    cacheStrategy: CacheStrategy,
    cacheTime: number,
    protectedInstance?: AxiosInstance,
  ) {
    this.cacheInstance = new CacheManager(cacheStrategy, cacheTime);
    this.protectedInstance = protectedInstance;
  }

  public async get<T = unknown>({
    endpoint,
    isProtected,
    cache,
    tag,
    additionalHeaders,
    transform,
  }: GetParams<T>): Promise<Resolver<AxiosResponse<T>>> {
    // Region gestione cache
    if (cache && tag) {
      const cached = await this.cacheInstance?.get(tag);
      if (cached) {
        const { Ok: cachedVal } = cached;
        if (cachedVal) {
          // controllo se valido
          const { timestamp, data } = cachedVal;
          if (timestamp + cache > new Date().getTime()) {
            // faccio unwrap
            const { Ok: toReturn } = unwrap<AxiosResponse<T>>(data);
            // se unwrap ok ritorno
            if (toReturn) {
              console.log('from cache', endpoint);
              return promiseResolver<AxiosResponse<T>>(() =>
                Promise.resolve(toReturn),
              );
            }
          }
        }
      }
    }

    // se non valido faccio chiamata
    const toCall = isProtected
      ? baseQuery
      : this.protectedInstance || baseQuery;

    // Torno il resolver, ma sotto lo uso per gestire la cache
    const axiosCall = await promiseResolver<AxiosResponse<T>>(() =>
      toCall.get<T>(endpoint, { headers: additionalHeaders }),
    );

    const {
      Result: { Ok },
    } = axiosCall;

    if (Ok) {
      const { data } = Ok;
      Ok.data = transform ? transform(data) : data;

      if (cache && tag) {
        this.cacheInstance?.set(tag, Ok);
      }

      return await promiseResolver<AxiosResponse<T>>(() => Promise.resolve(Ok));
    }

    return axiosCall;
  }

  public async post<T = unknown>({
    endpoint,
    isProtected,
    data,
    invalidateTag,
    additionalHeaders,
    transform,
  }: PostParams<T>): Promise<Resolver<AxiosResponse<T>>> {
    const toCall = isProtected
      ? baseQuery
      : this.protectedInstance || baseQuery;

    const axiosCall = await promiseResolver<AxiosResponse<T>>(() =>
      toCall.post<T>(endpoint, data, {
        headers: additionalHeaders,
      }),
    );

    const {
      Result: { Ok },
    } = axiosCall;

    if (Ok) {
      const { data } = Ok;
      Ok.data = transform ? transform(data) : data;

      if (invalidateTag) {
        this.cacheInstance?.remove(invalidateTag);
      }

      return await promiseResolver<AxiosResponse<T>>(() => Promise.resolve(Ok));
    }

    return axiosCall;
  }
}
