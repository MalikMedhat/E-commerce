import type { ListProductsSort } from './listProductsSort';

export type ListProductsParams = {
  search?: string;
  categoryId?: number;
  sort?: ListProductsSort;
  page?: number;
  limit?: number;
};
