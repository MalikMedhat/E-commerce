import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
const API_BASE = import.meta.env?.VITE_API_URL || '/api';
// Simple fetch helper
async function apiFetch(path, options = {}) {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok)
        throw new Error(`API error ${res.status}`);
    return res.json();
}
// Auth
export function setupApiClient() { }
export function setAuthToken(token) {
    if (typeof window !== 'undefined') {
        if (token)
            window.localStorage.setItem('token', token);
        else
            window.localStorage.removeItem('token');
    }
}
export function getAuthToken() {
    return typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
}
// Auth hooks
export const useLogin = (options) => useQuery({ queryKey: ['login'], queryFn: () => apiFetch('/auth/login'), ...options });
export const useRegister = (options) => useQuery({ queryKey: ['register'], queryFn: () => apiFetch('/auth/register'), ...options });
export const useLogout = () => {
    const [mutate] = useState(() => () => setAuthToken(null));
    return [mutate];
};
export const useMe = (options) => useQuery({ queryKey: ['me'], queryFn: () => apiFetch('/auth/me'), ...options });
// Products
export const useGetProducts = (params = {}) => useQuery({ queryKey: ['products', params], queryFn: () => apiFetch(`/products?${new URLSearchParams(params.query || {}).toString()}`) });
export const useGetProduct = (id) => useQuery({ queryKey: ['product', id], queryFn: () => apiFetch(`/products/${id}`) });
export const useProducts = (params = {}) => useGetProducts(params);
// Cart
export const useGetCart = (params = {}) => useQuery({ queryKey: ['cart', params], queryFn: () => apiFetch('/cart'), ...params });
export const useCreateCartItem = () => useState(() => (item) => apiFetch('/cart', { method: 'POST', body: JSON.stringify(item) }));
export const useUpdateCartItem = () => useState(() => (id, item) => apiFetch(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(item) }));
export const useDeleteCartItem = () => useState(() => (id) => apiFetch(`/cart/${id}`, { method: 'DELETE' }));
// Orders
export const useGetOrders = (options) => useQuery({ queryKey: ['orders'], queryFn: () => apiFetch('/orders'), ...options });
export const useGetOrder = (id) => useQuery({ queryKey: ['order', id], queryFn: () => apiFetch(`/orders/${id}`) });
export const useCreateOrder = () => useState(() => (order) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) }));
// Categories
export const useGetCategories = (options) => useQuery({ queryKey: ['categories'], queryFn: () => apiFetch('/categories'), ...options });
