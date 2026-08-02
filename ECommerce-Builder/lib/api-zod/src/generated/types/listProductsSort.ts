export type ListProductsSort = typeof ListProductsSort[keyof typeof ListProductsSort];

export const ListProductsSort = {
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  newest: 'newest',
} as const;
