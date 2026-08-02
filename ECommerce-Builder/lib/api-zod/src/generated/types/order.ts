import type { OrderItem } from './orderItem';
import type { OrderStatus } from './orderStatus';

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
