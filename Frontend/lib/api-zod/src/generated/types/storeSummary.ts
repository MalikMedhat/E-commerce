import type { Order } from './order';

export interface StoreSummary {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  recentOrders: Order[];
}
