# API Tiny Manager

API Tiny Manager is a compact and secure manager with cache support designed to handle your favorite APIs.

This tool requires Axios and localforage as peer dependencies.

## Constructor

The constructor accepts three parameters.

### Strategy

(cacheStrategy)

This parameter describes the cache strategy to be adopted. The options are:

- Singleton
- Local (local storage)
- Session (session storage)
- IndexedDB

### Cache Time

(cacheTime)

This parameter determines the time until the cache is destroyed (default is set to 24 hours).

### Protected Instance (Optional)

(protectedInstance)

This is an Axios instance for managing protected or special APIs.

## Provided Functions

### Get

#### Parameters

```typescript
export type GetParams<T> = {
  endpoint: string;
  isProtected?: boolean;
  cache?: number;
  tag?: string;
  additionalHeaders?: AxiosHeaders;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (data: any) => T;
};
```


#### Returns
This function returns a Resolver, a special type which offers:

- Two callbacks to handle API success or failure
A Result type, which consists of Ok (the AxiosResult containing the desired type) and Err (AxiosError)

```typescript
export type Resolver<TExpected> = {
  Result: Result<TExpected>;
  onResolve: (callback: (ok: TExpected) => void) => void;
  onReject: (callback: (error: Error) => void) => void;
};
```

### Post

#### Parameters
```typescript
export type PostParams<T> = {
  endpoint: string;
  isProtected?: boolean;
  data?: AxiosRequestConfig['data'];
  invalidateTag?: string;
  additionalHeaders?: AxiosHeaders;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (data: any) => T;
};
```

#### Returns
This function returns a Resolver, a special type which offers:

- Two callbacks to handle API success or failure
A Result type, which consists of Ok (the AxiosResult containing the desired type) and Err (AxiosError)

```typescript
export type Resolver<TExpected> = {
  Result: Result<TExpected>;
  onResolve: (callback: (ok: TExpected) => void) => void;
  onReject: (callback: (error: Error) => void) => void;
};
```

### Upcoming Features
- PUT, PATCH, DELETE requests
- Automatic refetch after cache invalidation
- React integration (hooks)
- And more...
