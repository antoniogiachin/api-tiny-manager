import type { Result } from '@/types';

export type Resolver<TExpected> = {
  Result: Result<TExpected>;
  onResolve: (callback: (ok: TExpected) => void) => void;
  onReject: (callback: (error: Error) => void) => void;
};
