import type { AxiosHeaders } from 'axios';

export type GetParams<T> = {
  endpoint: string;
  isProtected?: boolean;
  cache?: number;
  tag?: string;
  additionalHeaders?: AxiosHeaders;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (data: any) => T;
};
