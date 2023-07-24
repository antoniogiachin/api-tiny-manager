import type { Result } from '@/types';

export type Cached = {
  timestamp: number;
  data: string;
};

export function unwrap<Unwrapped>(data: Cached['data']): Result<Unwrapped> {
  const res: Result<Unwrapped> = {
    Ok: null,
    Err: null,
  };

  try {
    res.Ok = JSON.parse(data) as Unwrapped;
  } catch (e) {
    if (e instanceof Error) {
      res.Err = e;
    }
  }

  return res;
}
