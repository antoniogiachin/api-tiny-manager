import type { Result } from '@/types';
import type { Resolver } from './types';

export async function promiseResolver<TExpected>(
  promise: (...args: unknown[]) => Promise<TExpected>,
): Promise<Resolver<TExpected>> {
  const result: Result<TExpected> = {
    Ok: null,
    Err: null,
  };

  try {
    result.Ok = await promise();
  } catch (error) {
    if (error instanceof Error) {
      result.Err = error;
    }
  }

  const { Ok, Err } = result;

  function onResolve(callback: (ok: TExpected) => unknown): void {
    if (Ok) {
      callback(Ok);
    }
  }

  function onReject(callback: (error: Error) => unknown): void {
    if (Err) {
      callback(Err);
    }
  }

  return {
    Result: result,
    onResolve,
    onReject,
  };
}
