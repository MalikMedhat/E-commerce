export interface HealthStatus {
  status: string;
}

export interface ErrorResponse {
  error: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export type AuthResponseRole = typeof AuthResponseRole[keyof typeof AuthResponseRole];

export const AuthResponseRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;

export interface AuthResponse {
  userId: number;
  email: string;
  token: string;
  refreshToken: string;
  role: AuthResponseRole;
}

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;

export interface User {
  userId: number;
  email: string;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
}

export interface ProductsPage {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export interface CartItemInput {
  productId: number;
  quantity: number;
}

export interface CartItemUpdate {
  quantity: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  priceAtPurchase: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutInput {
  shippingAddress?: string;
}

export interface PaymentIntentInput {
  orderId: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PaymentConfirmInput {
  orderId: number;
  paymentIntentId: string;
}

export interface StoreSummary {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  recentOrders: Order[];
}

export type ListProductsParams = {
  search?: string;
  categoryId?: number;
  sort?: ListProductsSort;
  page?: number;
  limit?: number;
};

export type ListProductsSort = typeof ListProductsSort[keyof typeof ListProductsSort];

export const ListProductsSort = {
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  newest: 'newest',
} as const;

