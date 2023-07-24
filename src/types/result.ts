export type Result<T = boolean> = {
  Ok: T | null;
  Err: Error | null;
};
