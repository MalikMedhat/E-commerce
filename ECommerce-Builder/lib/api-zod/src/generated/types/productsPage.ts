import type { Product } from './product';

export interface ProductsPage {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
