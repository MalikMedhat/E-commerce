import { UseQueryOptions } from '@tanstack/react-query';
export declare function setupApiClient(): void;
export declare function setAuthToken(token: string | null): void;
export declare function getAuthToken(): string | null;
export declare const useLogin: (options?: UseQueryOptions) => import("@tanstack/react-query").UseQueryResult<unknown, Error>;
export declare const useRegister: (options?: UseQueryOptions) => import("@tanstack/react-query").UseQueryResult<unknown, Error>;
export declare const useLogout: () => (() => void)[];
export declare const useMe: (options?: UseQueryOptions) => import("@tanstack/react-query").UseQueryResult<unknown, Error>;
export declare const useGetProducts: (params?: {
    query?: any;
}) => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useGetProduct: (id: string) => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useProducts: (params?: {
    query?: any;
}) => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useGetCart: (params?: {
    query?: any;
}) => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useCreateCartItem: () => [(item: any) => Promise<any>, import("react").Dispatch<import("react").SetStateAction<(item: any) => Promise<any>>>];
export declare const useUpdateCartItem: () => [(id: string, item: any) => Promise<any>, import("react").Dispatch<import("react").SetStateAction<(id: string, item: any) => Promise<any>>>];
export declare const useDeleteCartItem: () => [(id: string) => Promise<any>, import("react").Dispatch<import("react").SetStateAction<(id: string) => Promise<any>>>];
export declare const useGetOrders: (options?: UseQueryOptions) => import("@tanstack/react-query").UseQueryResult<unknown, Error>;
export declare const useGetOrder: (id: string) => import("@tanstack/react-query").UseQueryResult<any, Error>;
export declare const useCreateOrder: () => [(order: any) => Promise<any>, import("react").Dispatch<import("react").SetStateAction<(order: any) => Promise<any>>>];
export declare const useGetCategories: (options?: UseQueryOptions) => import("@tanstack/react-query").UseQueryResult<unknown, Error>;
export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
    category?: string;
    stock?: number;
}
export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
}
export interface Cart {
    id: string;
    items: CartItem[];
    total: number;
}
export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: string;
    createdAt: string;
}
export interface Category {
    id: string;
    name: string;
}
