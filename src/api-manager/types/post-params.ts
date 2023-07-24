import type { AxiosHeaders, AxiosRequestConfig } from 'axios';

export type PostParams<T> = {
  endpoint: string;
  isProtected?: boolean;
  data?: AxiosRequestConfig['data'];
  invalidateTag?: string;
  additionalHeaders?: AxiosHeaders;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (data: any) => T;
};
