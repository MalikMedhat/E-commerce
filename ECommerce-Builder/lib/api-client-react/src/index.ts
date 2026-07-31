
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env?.VITE_API_URL || '/api';

// Simple fetch helper
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Auth
export function setupApiClient() {}
export function setAuthToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) window.localStorage.setItem('token', token);
    else window.localStorage.removeItem('token');
  }
}
export function getAuthToken(): string | null {
  return typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
}

// Auth hooks
export const useLogin = (options?: UseQueryOptions) => useQuery({ queryKey: ['login'], queryFn: () => apiFetch('/auth/login'), ...options });
export const useRegister = (options?: UseQueryOptions) => useQuery({ queryKey: ['register'], queryFn: () => apiFetch('/auth/register'), ...options });
export const useLogout = () => {
  const [mutate] = useState(() => () => setAuthToken(null));
  return [mutate];
};
export const useMe = (options?: UseQueryOptions) => useQuery({ queryKey: ['me'], queryFn: () => apiFetch('/auth/me'), ...options });

// Products
export const useGetProducts = (params: { query?: any } = {}) => useQuery({ queryKey: ['products', params], queryFn: () => apiFetch(`/products?${new URLSearchParams(params.query || {}).toString()}`) });
export const useGetProduct = (id: string) => useQuery({ queryKey: ['product', id], queryFn: () => apiFetch(`/products/${id}`) });
export const useProducts = (params: { query?: any } = {}) => useGetProducts(params);

// Cart
export const useGetCart = (params: { query?: any } = {}) => useQuery({ queryKey: ['cart', params], queryFn: () => apiFetch('/cart'), ...params });
export const useCreateCartItem = () => useState(() => (item: any) => apiFetch('/cart', { method: 'POST', body: JSON.stringify(item) }));
export const useUpdateCartItem = () => useState(() => (id: string, item: any) => apiFetch(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(item) }));
export const useDeleteCartItem = () => useState(() => (id: string) => apiFetch(`/cart/${id}`, { method: 'DELETE' }));

// Orders
export const useGetOrders = (options?: UseQueryOptions) => useQuery({ queryKey: ['orders'], queryFn: () => apiFetch('/orders'), ...options });
export const useGetOrder = (id: string) => useQuery({ queryKey: ['order', id], queryFn: () => apiFetch(`/orders/${id}`) });
export const useCreateOrder = () => useState(() => (order: any) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) }));

// Categories
export const useGetCategories = (options?: UseQueryOptions) => useQuery({ queryKey: ['categories'], queryFn: () => apiFetch('/categories'), ...options });

// Types
export interface Product { id: string; name: string; price: number; description: string; imageUrl?: string; category?: string; stock?: number; }
export interface CartItem { id: string; productId: string; quantity: number; price: number; product?: Product; }
export interface Cart { id: string; items: CartItem[]; total: number; }
export interface Order { id: string; items: CartItem[]; total: number; status: string; createdAt: string; }
export interface Category { id: string; name: string; }
