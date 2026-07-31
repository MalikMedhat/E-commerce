const fs = require('fs');
const path = require('path');
const base = 'c:/Users/Malik/Downloads/ECommerce-Builder/ECommerce-Builder/artifacts/shop';
const libBase = 'c:/Users/Malik/Downloads/ECommerce-Builder/ECommerce-Builder/lib/api-client-react';

function write(rel, content) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function writeLib(rel, content) {
  const full = path.join(libBase, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

// ============ API Client Package ============
writeLib('package.json', JSON.stringify({
  name: '@workspace/api-client-react',
  version: '0.0.0',
  private: true,
  type: 'module',
  main: 'src/index.ts',
  scripts: { typecheck: 'tsc -p tsconfig.json --noEmit' },
  dependencies: { '@tanstack/react-query': 'catalog:' },
  devDependencies: { '@types/react': 'catalog:', '@types/node': 'catalog:', react: 'catalog:', 'react-dom': 'catalog:', 'typescript': '~5.9.3' }
}, null, 2));

writeLib('tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.base.json',
  compilerOptions: { noEmit: true, jsx: 'preserve', lib: ['esnext','dom','dom.iterable'], moduleResolution: 'bundler', types: ['node'], paths: {} },
  include: ['src/**/*']
}, null, 2));

writeLib('src/index.ts', `
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env?.VITE_API_URL || '/api';

// Simple fetch helper
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: \`Bearer \${token}\` } : {}), ...options.headers };
  const res = await fetch(\`\${API_BASE}\${path}\`, { ...options, headers });
  if (!res.ok) throw new Error(\`API error \${res.status}\`);
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
export const useGetProducts = (params: { query?: any } = {}) => useQuery({ queryKey: ['products', params], queryFn: () => apiFetch(\`/products?\${new URLSearchParams(params.query || {}).toString()}\`) });
export const useGetProduct = (id: string) => useQuery({ queryKey: ['product', id], queryFn: () => apiFetch(\`/products/\${id}\`) });
export const useProducts = (params: { query?: any } = {}) => useGetProducts(params);

// Cart
export const useGetCart = (params: { query?: any } = {}) => useQuery({ queryKey: ['cart', params], queryFn: () => apiFetch('/cart'), ...params });
export const useCreateCartItem = () => useState(() => (item: any) => apiFetch('/cart', { method: 'POST', body: JSON.stringify(item) }));
export const useUpdateCartItem = () => useState(() => (id: string, item: any) => apiFetch(\`/cart/\${id}\`, { method: 'PUT', body: JSON.stringify(item) }));
export const useDeleteCartItem = () => useState(() => (id: string) => apiFetch(\`/cart/\${id}\`, { method: 'DELETE' }));

// Orders
export const useGetOrders = (options?: UseQueryOptions) => useQuery({ queryKey: ['orders'], queryFn: () => apiFetch('/orders'), ...options });
export const useGetOrder = (id: string) => useQuery({ queryKey: ['order', id], queryFn: () => apiFetch(\`/orders/\${id}\`) });
export const useCreateOrder = () => useState(() => (order: any) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) }));

// Categories
export const useGetCategories = (options?: UseQueryOptions) => useQuery({ queryKey: ['categories'], queryFn: () => apiFetch('/categories'), ...options });

// Types
export interface Product { id: string; name: string; price: number; description: string; imageUrl?: string; category?: string; stock?: number; }
export interface CartItem { id: string; productId: string; quantity: number; price: number; product?: Product; }
export interface Cart { id: string; items: CartItem[]; total: number; }
export interface Order { id: string; items: CartItem[]; total: number; status: string; createdAt: string; }
export interface Category { id: string; name: string; }
`);

// ============ Shop source files ============
// api-setup.ts
write('src/lib/api-setup.ts', `
import { setAuthToken, getAuthToken } from '@workspace/api-client-react';

export function setupApiClient() {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
}
`);

// authStore.ts
write('src/store/authStore.ts', `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  hydrate: () => void;
  login: (token: string, user: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      hydrate: () => set((state) => ({ isAuthenticated: !!state.token, })),
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
`);

// cartStore.ts
write('src/store/cartStore.ts', `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
    }),
    { name: 'cart-storage' }
  )
);
`);

// Footer.tsx
write('src/components/Footer.tsx', String.raw`
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tech Hub. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link>
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
`);

// CartSidebar.tsx
write('src/components/CartSidebar.tsx', String.raw`
import { X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useGetCart } from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CartSidebar() {
  const { isOpen, setIsOpen } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { data: cart } = useGetCart({ query: { enabled: isAuthenticated, queryKey: ["cart-sidebar"] } });

  const totalItems = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.total || 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {cart?.items?.length === 0 || !cart?.items ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart?.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name || 'Product'}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold">${totalPrice}</span>
          </div>
          <Button asChild className="w-full" disabled={totalItems === 0}>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
`);

// ============ UI Components (placeholders) ============
const uiComponents = [
  'accordion', 'alert', 'alert-dialog', 'aspect-ratio', 'avatar', 'badge',
  'breadcrumb', 'button', 'calendar', 'card', 'carousel', 'chart', 'checkbox',
  'collapsible', 'command', 'configurator', 'context-menu', 'dialog', 'drawer',
  'dropdown-menu', 'empty', 'field', 'form', 'hover-card', 'input-group',
  'input-otp', 'input', 'item', 'kbd', 'menubar', 'navigation-menu',
  'pagination', 'popover', 'progress', 'radio-group', 'resizable',
  'scroll-area', 'separator', 'sidebar', 'skeleton', 'slider', 'sonner',
  'spinner', 'switch', 'table', 'tabs', 'textarea', 'toast', 'toaster',
  'toggle-group', 'toggle',
];

for (const comp of uiComponents) {
  const fileName = comp.replace(/-/g, '');
  write(`src/components/ui/${comp}.tsx`, `
import * as React from 'react';
export const ${comp.replace(/-/g, '')} = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
${comp.replace(/-/g, '')}.displayName = '${comp.replace(/-/g, '')}';
export default ${comp.replace(/-/g, '')};
`);
}

// Button with proper export
write('src/components/ui/button.tsx', `
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
`);

// Toaster.tsx - uses sonner
write('src/components/ui/toaster.tsx', `
import { Toaster as SonnerToaster } from 'sonner';
export function Toaster() {
  return <SonnerToaster />;
}
`);

// Tooltip - already has the modified version, but let's make sure it's correct
// (Already created earlier, skip)

// Input.tsx
write('src/components/ui/input.tsx', `
import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';
export { Input };
`);

// ============ Pages (placeholders) ============
const pages = [
  { name: 'Home', defaultExport: true },
  { name: 'Products', defaultExport: true },
  { name: 'ProductDetail', defaultExport: true },
  { name: 'Login', defaultExport: true },
  { name: 'Register', defaultExport: true },
  { name: 'Checkout', defaultExport: true },
  { name: 'OrderConfirmation', defaultExport: true },
  { name: 'Orders', defaultExport: true },
  { name: 'OrderDetail', defaultExport: true },
  { name: 'Profile', defaultExport: true },
  { name: 'not-found', defaultExport: false, isDefault: true },
];

for (const page of pages) {
  const compName = page.name === 'not-found' ? 'NotFound' : page.name;
  write(`src/pages/${page.name}.tsx`, `
import { ${page.name === 'not-found' ? '' : 'Link'} } from '${page.name === 'not-found' ? '' : 'wouter'}';

${page.name === 'not-found' ? '' : 'const ' + page.name + ' = () => {'}
${page.name === 'not-found' ? 'const NotFound = () => {' : ''}
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">${page.name === 'not-found' ? '404 - Page Not Found' : page.name}</h1>
      ${page.name === 'not-found' ? '<p>Oops! The page you are looking for does not exist.</p>' : '<p>Welcome to the ' + page.name + ' page.</p>'}
      ${page.name !== 'not-found' ? '<p>This is a placeholder page.</p>' : ''}
    </div>
  );
};

${page.name === 'not-found' ? 'export default NotFound;' : 'export default ' + page.name + ';'}
`);
}

console.log('All source files created successfully!');
