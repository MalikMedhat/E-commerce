
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  AuthCredentials,
  AuthResponse,
  Cart,
  CartItemInput,
  CartItemUpdate,
  Category,
  CheckoutInput,
  ErrorResponse,
  HealthStatus,
  ListProductsParams,
  Order,
  PaymentConfirmInput,
  PaymentIntentInput,
  PaymentIntentResponse,
  Product,
  ProductsPage,
  StoreSummary,
  User
} from './api.schemas';

import { customFetch } from '../custom-fetch';
import type { ErrorType , BodyType } from '../custom-fetch';

type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



const withQueryKey = <T extends object, K>(query: T, queryKey: K): T & { queryKey: K } => {
  const result = { queryKey } as T & { queryKey: K };
  for (const key of Object.keys(query)) {
    // The explicit queryKey always wins, matching the previous
    // `{ ...query, queryKey }` spread where it was set last.
    if (key === 'queryKey') continue;
    Object.defineProperty(result, key, {
      enumerable: true,
      configurable: true,
      get: () => (query as Record<string, unknown>)[key],
    });
  }
  return result;
};

export const getHealthCheckUrl = () => {




  return `/api/healthz`
}

/**
 * Returns server health status
 * @summary Health check
 */
export const healthCheck = async ( options?: RequestInit): Promise<HealthStatus> => {

  return customFetch<HealthStatus>(getHealthCheckUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getHealthCheckQueryKey = () => {
    return [
    `/api/healthz`
    ] as const;
    }


export const getHealthCheckQueryOptions = <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getHealthCheckQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) => healthCheck({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & { queryKey: QueryKey }
}

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>
export type HealthCheckQueryError = ErrorType<unknown>


/**
 * @summary Health check
 */

export function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getHealthCheckQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getRegisterUrl = () => {




  return `/api/auth/register`
}

/**
 * @summary Register a new user
 */
export const register = async (authCredentials: AuthCredentials, options?: RequestInit): Promise<AuthResponse> => {

  return customFetch<AuthResponse>(getRegisterUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(authCredentials)
  }
);}





export const getRegisterMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<AuthCredentials>}, TContext> => {

const mutationKey = ['register'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof register>>, {data: BodyType<AuthCredentials>}> = (props) => {
          const {data} = props ?? {};

          return  register(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>
    export type RegisterMutationBody = BodyType<AuthCredentials>
    export type RegisterMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Register a new user
 */
export const useRegister = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof register>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof register>>,
        TError,
        {data: BodyType<AuthCredentials>},
        TContext
      > => {
      return useMutation(getRegisterMutationOptions(options));
    }

export const getLoginUrl = () => {




  return `/api/auth/login`
}

/**
 * @summary Login
 */
export const login = async (authCredentials: AuthCredentials, options?: RequestInit): Promise<AuthResponse> => {

  return customFetch<AuthResponse>(getLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(authCredentials)
  }
);}





export const getLoginMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<AuthCredentials>}, TContext> => {

const mutationKey = ['login'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof login>>, {data: BodyType<AuthCredentials>}> = (props) => {
          const {data} = props ?? {};

          return  login(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>
    export type LoginMutationBody = BodyType<AuthCredentials>
    export type LoginMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Login
 */
export const useLogin = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof login>>, TError,{data: BodyType<AuthCredentials>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof login>>,
        TError,
        {data: BodyType<AuthCredentials>},
        TContext
      > => {
      return useMutation(getLoginMutationOptions(options));
    }

export const getGetMeUrl = () => {




  return `/api/auth/me`
}

/**
 * @summary Get current user
 */
export const getMe = async ( options?: RequestInit): Promise<User> => {

  return customFetch<User>(getGetMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetMeQueryKey = () => {
    return [
    `/api/auth/me`
    ] as const;
    }


export const getGetMeQueryOptions = <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getMe>>> = ({ signal }) => getMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & { queryKey: QueryKey }
}

export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>
export type GetMeQueryError = ErrorType<ErrorResponse>


/**
 * @summary Get current user
 */

export function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>, request?: SecondParameter<typeof custom>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetMeQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getListCategoriesUrl = () => {




  return `/api/categories`
}

/**
 * @summary List all categories
 */
export const listCategories = async ( options?: RequestInit): Promise<Category[]> => {

  return customFetch<Category[]>(getListCategoriesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListCategoriesQueryKey = () => {
    return [
    `/api/categories`
    ] as const;
    }


export const getListCategoriesQueryOptions = <TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListCategoriesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listCategories>>> = ({ signal }) => listCategories({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData> & { queryKey: QueryKey }
}

export type ListCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listCategories>>>
export type ListCategoriesQueryError = ErrorType<unknown>


/**
 * @summary List all categories
 */

export function useListCategories<TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListCategoriesQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getListProductsUrl = (params?: ListProductsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/products?${stringifiedParams}` : `/api/products`
}

/**
 * @summary List all products
 */
export const listProducts = async (params?: ListProductsParams, options?: RequestInit): Promise<ProductsPage> => {

  return customFetch<ProductsPage>(getListProductsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListProductsQueryKey = (params?: ListProductsParams,) => {
    return [
    `/api/products`, ...(params ? [params] : [])
    ] as const;
    }


export const getListProductsQueryOptions = <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListProductsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listProducts>>> = ({ signal }) => listProducts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & { queryKey: QueryKey }
}

export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>
export type ListProductsQueryError = ErrorType<unknown>


/**
 * @summary List all products
 */

export function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(
 params?: ListProductsParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListProductsQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getGetProductUrl = (id: number,) => {




  return `/api/products/${id}`
}

/**
 * @summary Get a product by ID
 */
export const getProduct = async (id: number, options?: RequestInit): Promise<Product> => {

  return customFetch<Product>(getGetProductUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetProductQueryKey = (id: number,) => {
    return [
    `/api/products/${id}`
    ] as const;
    }


export const getGetProductQueryOptions = <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<ErrorResponse>>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetProductQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getProduct>>> = ({ signal }) => getProduct(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & { queryKey: QueryKey }
}

export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>
export type GetProductQueryError = ErrorType<ErrorResponse>


/**
 * @summary Get a product by ID
 */

export function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<ErrorResponse>>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetProductQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getGetRelatedProductsUrl = (id: number,) => {




  return `/api/products/${id}/related`
}

/**
 * @summary Get related products
 */
export const getRelatedProducts = async (id: number, options?: RequestInit): Promise<Product[]> => {

  return customFetch<Product[]>(getGetRelatedProductsUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetRelatedProductsQueryKey = (id: number,) => {
    return [
    `/api/products/${id}/related`
    ] as const;
    }


export const getGetRelatedProductsQueryOptions = <TData = Awaited<ReturnType<typeof getRelatedProducts>>, TError = ErrorType<unknown>>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getRelatedProducts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetRelatedProductsQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getRelatedProducts>>> = ({ signal }) => getRelatedProducts(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getRelatedProducts>>, TError, TData> & { queryKey: QueryKey }
}

export type GetRelatedProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getRelatedProducts>>>
export type GetRelatedProductsQueryError = ErrorType<unknown>


/**
 * @summary Get related products
 */

export function useGetRelatedProducts<TData = Awaited<ReturnType<typeof getRelatedProducts>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getRelatedProducts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetRelatedProductsQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getGetFeaturedProductsUrl = () => {




  return `/api/products/featured`
}

/**
 * @summary Get featured products for homepage
 */
export const getFeaturedProducts = async ( options?: RequestInit): Promise<Product[]> => {

  return customFetch<Product[]>(getGetFeaturedProductsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetFeaturedProductsQueryKey = () => {
    return [
    `/api/products/featured`
    ] as const;
    }


export const getGetFeaturedProductsQueryOptions = <TData = Awaited<ReturnType<typeof getFeaturedProducts>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetFeaturedProductsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getFeaturedProducts>>> = ({ signal }) => getFeaturedProducts({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData> & { queryKey: QueryKey }
}

export type GetFeaturedProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedProducts>>>
export type GetFeaturedProductsQueryError = ErrorType<unknown>


/**
 * @summary Get featured products for homepage
 */

export function useGetFeaturedProducts<TData = Awaited<ReturnType<typeof getFeaturedProducts>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProducts>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetFeaturedProductsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getGetCartUrl = () => {




  return `/api/cart`
}

/**
 * @summary Get the current user's cart
 */
export const getCart = async ( options?: RequestInit): Promise<Cart> => {

  return customFetch<Cart>(getGetCartUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetCartQueryKey = () => {
    return [
    `/api/cart`
    ] as const;
    }


export const getGetCartQueryOptions = <TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<ErrorResponse>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCartQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCart>>> = ({ signal }) => getCart({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData> & { queryKey: QueryKey }
}

export type GetCartQueryResult = NonNullable<Awaited<ReturnType<typeof getCart>>>
export type GetCartQueryError = ErrorType<ErrorResponse>


/**
 * @summary Get the current user's cart
 */

export function useGetCart<TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<ErrorResponse>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetCartQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getClearCartUrl = () => {




  return `/api/cart`
}

/**
 * @summary Clear the cart
 */
export const clearCart = async ( options?: RequestInit): Promise<Cart> => {

  return customFetch<Cart>(getClearCartUrl(),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getClearCartMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError,void, TContext> => {

const mutationKey = ['clearCart'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof clearCart>>, void> = () => {


          return  clearCart(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ClearCartMutationResult = NonNullable<Awaited<ReturnType<typeof clearCart>>>

    export type ClearCartMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Clear the cart
 */
export const useClearCart = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof clearCart>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getClearCartMutationOptions(options));
    }

export const getAddCartItemUrl = () => {




  return `/api/cart/items`
}

/**
 * @summary Add item to cart
 */
export const addCartItem = async (cartItemInput: CartItemInput, options?: RequestInit): Promise<Cart> => {

  return customFetch<Cart>(getAddCartItemUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(cartItemInput)
  }
);}





export const getAddCartItemMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addCartItem>>, TError,{data: BodyType<CartItemInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof addCartItem>>, TError,{data: BodyType<CartItemInput>}, TContext> => {

const mutationKey = ['addCartItem'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addCartItem>>, {data: BodyType<CartItemInput>}> = (props) => {
          const {data} = props ?? {};

          return  addCartItem(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AddCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof addCartItem>>>
    export type AddCartItemMutationBody = BodyType<CartItemInput>
    export type AddCartItemMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Add item to cart
 */
export const useAddCartItem = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addCartItem>>, TError,{data: BodyType<CartItemInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof addCartItem>>,
        TError,
        {data: BodyType<CartItemInput>},
        TContext
      > => {
      return useMutation(getAddCartItemMutationOptions(options));
    }

export const getUpdateCartItemUrl = (id: number,) => {




  return `/api/cart/items/${id}`
}

/**
 * @summary Update cart item quantity
 */
export const updateCartItem = async (id: number,
    cartItemUpdate: CartItemUpdate, options?: RequestInit): Promise<Cart> => {

  return customFetch<Cart>(getUpdateCartItemUrl(id),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(cartItemUpdate)
  }
);}





export const getUpdateCartItemMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError,{id: number;data: BodyType<CartItemUpdate>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError,{id: number;data: BodyType<CartItemUpdate>}, TContext> => {

const mutationKey = ['updateCartItem'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateCartItem>>, {id: number;data: BodyType<CartItemUpdate>}> = (props) => {
          const {id,data} = props ?? {};

          return  updateCartItem(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UpdateCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof updateCartItem>>>
    export type UpdateCartItemMutationBody = BodyType<CartItemUpdate>
    export type UpdateCartItemMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Update cart item quantity
 */
export const useUpdateCartItem = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError,{id: number;data: BodyType<CartItemUpdate>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof updateCartItem>>,
        TError,
        {id: number;data: BodyType<CartItemUpdate>},
        TContext
      > => {
      return useMutation(getUpdateCartItemMutationOptions(options));
    }

export const getRemoveCartItemUrl = (id: number,) => {




  return `/api/cart/items/${id}`
}

/**
 * @summary Remove item from cart
 */
export const removeCartItem = async (id: number, options?: RequestInit): Promise<Cart> => {

  return customFetch<Cart>(getRemoveCartItemUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}





export const getRemoveCartItemMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError,{id: number}, TContext> => {

const mutationKey = ['removeCartItem'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof removeCartItem>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  removeCartItem(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RemoveCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof removeCartItem>>>

    export type RemoveCartItemMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Remove item from cart
 */
export const useRemoveCartItem = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof removeCartItem>>,
        TError,
        {id: number},
        TContext
      > => {
      return useMutation(getRemoveCartItemMutationOptions(options));
    }

export const getListOrdersUrl = () => {




  return `/api/orders`
}

/**
 * @summary Get order history
 */
export const listOrders = async ( options?: RequestInit): Promise<Order[]> => {

  return customFetch<Order[]>(getListOrdersUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getListOrdersQueryKey = () => {
    return [
    `/api/orders`
    ] as const;
    }


export const getListOrdersQueryOptions = <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<ErrorResponse>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListOrdersQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof listOrders>>> = ({ signal }) => listOrders({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & { queryKey: QueryKey }
}

export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>
export type ListOrdersQueryError = ErrorType<ErrorResponse>


/**
 * @summary Get order history
 */

export function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<ErrorResponse>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getListOrdersQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getCheckoutUrl = () => {




  return `/api/orders/checkout`
}

/**
 * @summary Create order from cart
 */
export const checkout = async (checkoutInput: CheckoutInput, options?: RequestInit): Promise<Order> => {

  return customFetch<Order>(getCheckoutUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(checkoutInput)
  }
);}





export const getCheckoutMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof checkout>>, TError,{data: BodyType<CheckoutInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof checkout>>, TError,{data: BodyType<CheckoutInput>}, TContext> => {

const mutationKey = ['checkout'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof checkout>>, {data: BodyType<CheckoutInput>}> = (props) => {
          const {data} = props ?? {};

          return  checkout(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CheckoutMutationResult = NonNullable<Awaited<ReturnType<typeof checkout>>>
    export type CheckoutMutationBody = BodyType<CheckoutInput>
    export type CheckoutMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Create order from cart
 */
export const useCheckout = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof checkout>>, TError,{data: BodyType<CheckoutInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof checkout>>,
        TError,
        {data: BodyType<CheckoutInput>},
        TContext
      > => {
      return useMutation(getCheckoutMutationOptions(options));
    }

export const getGetOrderUrl = (id: number,) => {




  return `/api/orders/${id}`
}

/**
 * @summary Get order by ID
 */
export const getOrder = async (id: number, options?: RequestInit): Promise<Order> => {

  return customFetch<Order>(getGetOrderUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetOrderQueryKey = (id: number,) => {
    return [
    `/api/orders/${id}`
    ] as const;
    }


export const getGetOrderQueryOptions = <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<ErrorResponse>>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetOrderQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getOrder>>> = ({ signal }) => getOrder(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & { queryKey: QueryKey }
}

export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>
export type GetOrderQueryError = ErrorType<ErrorResponse>


/**
 * @summary Get order by ID
 */

export function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<ErrorResponse>>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetOrderQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







export const getCancelOrderUrl = (id: number,) => {




  return `/api/orders/${id}/cancel`
}

/**
 * @summary Cancel an order
 */
export const cancelOrder = async (id: number, options?: RequestInit): Promise<Order> => {

  return customFetch<Order>(getCancelOrderUrl(id),
  {
    ...options,
    method: 'PUT'


  }
);}





export const getCancelOrderMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof cancelOrder>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof cancelOrder>>, TError,{id: number}, TContext> => {

const mutationKey = ['cancelOrder'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof cancelOrder>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  cancelOrder(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CancelOrderMutationResult = NonNullable<Awaited<ReturnType<typeof cancelOrder>>>

    export type CancelOrderMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Cancel an order
 */
export const useCancelOrder = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof cancelOrder>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof cancelOrder>>,
        TError,
        {id: number},
        TContext
      > => {
      return useMutation(getCancelOrderMutationOptions(options));
    }

export const getCreatePaymentIntentUrl = () => {




  return `/api/payments/create-intent`
}

/**
 * @summary Create a Stripe payment intent
 */
export const createPaymentIntent = async (paymentIntentInput: PaymentIntentInput, options?: RequestInit): Promise<PaymentIntentResponse> => {

  return customFetch<PaymentIntentResponse>(getCreatePaymentIntentUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(paymentIntentInput)
  }
);}





export const getCreatePaymentIntentMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPaymentIntent>>, TError,{data: BodyType<PaymentIntentInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createPaymentIntent>>, TError,{data: BodyType<PaymentIntentInput>}, TContext> => {

const mutationKey = ['createPaymentIntent'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createPaymentIntent>>, {data: BodyType<PaymentIntentInput>}> = (props) => {
          const {data} = props ?? {};

          return  createPaymentIntent(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreatePaymentIntentMutationResult = NonNullable<Awaited<ReturnType<typeof createPaymentIntent>>>
    export type CreatePaymentIntentMutationBody = BodyType<PaymentIntentInput>
    export type CreatePaymentIntentMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Create a Stripe payment intent
 */
export const useCreatePaymentIntent = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createPaymentIntent>>, TError,{data: BodyType<PaymentIntentInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof createPaymentIntent>>,
        TError,
        {data: BodyType<PaymentIntentInput>},
        TContext
      > => {
      return useMutation(getCreatePaymentIntentMutationOptions(options));
    }

export const getConfirmPaymentUrl = () => {




  return `/api/payments/confirm`
}

/**
 * @summary Confirm payment and update order status
 */
export const confirmPayment = async (paymentConfirmInput: PaymentConfirmInput, options?: RequestInit): Promise<Order> => {

  return customFetch<Order>(getConfirmPaymentUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(paymentConfirmInput)
  }
);}





export const getConfirmPaymentMutationOptions = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof confirmPayment>>, TError,{data: BodyType<PaymentConfirmInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof confirmPayment>>, TError,{data: BodyType<PaymentConfirmInput>}, TContext> => {

const mutationKey = ['confirmPayment'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof confirmPayment>>, {data: BodyType<PaymentConfirmInput>}> = (props) => {
          const {data} = props ?? {};

          return  confirmPayment(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ConfirmPaymentMutationResult = NonNullable<Awaited<ReturnType<typeof confirmPayment>>>
    export type ConfirmPaymentMutationBody = BodyType<PaymentConfirmInput>
    export type ConfirmPaymentMutationError = ErrorType<ErrorResponse>

    /**
 * @summary Confirm payment and update order status
 */
export const useConfirmPayment = <TError = ErrorType<ErrorResponse>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof confirmPayment>>, TError,{data: BodyType<PaymentConfirmInput>}, TContext>, request?: SecondParameter<typeof customFetch>}
 ): UseMutationResult<
        Awaited<ReturnType<typeof confirmPayment>>,
        TError,
        {data: BodyType<PaymentConfirmInput>},
        TContext
      > => {
      return useMutation(getConfirmPaymentMutationOptions(options));
    }

export const getGetStoreSummaryUrl = () => {




  return `/api/store/summary`
}

/**
 * @summary Get store summary stats
 */
export const getStoreSummary = async ( options?: RequestInit): Promise<StoreSummary> => {

  return customFetch<StoreSummary>(getGetStoreSummaryUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetStoreSummaryQueryKey = () => {
    return [
    `/api/store/summary`
    ] as const;
    }


export const getGetStoreSummaryQueryOptions = <TData = Awaited<ReturnType<typeof getStoreSummary>>, TError = ErrorType<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getStoreSummary>>, TError, TData>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetStoreSummaryQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getStoreSummary>>> = ({ signal }) => getStoreSummary({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getStoreSummary>>, TError, TData> & { queryKey: QueryKey }
}

export type GetStoreSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getStoreSummary>>>
export type GetStoreSummaryQueryError = ErrorType<unknown>


/**
 * @summary Get store summary stats
 */

export function useGetStoreSummary<TData = Awaited<ReturnType<typeof getStoreSummary>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getStoreSummary>>, TError, TData>, request?: SecondParameter<typeof customFetch>}

 ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } {

  const queryOptions = getGetStoreSummaryQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  return withQueryKey(query, queryOptions.queryKey);
}







