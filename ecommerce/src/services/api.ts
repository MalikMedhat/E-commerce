const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://e-commerce-production-2019.up.railway.app/api";

const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const productAPI = {
  getAll: () =>
    apiCall<import("../types/product").Product[]>("/products"),

  getById: (id: number) =>
    apiCall<import("../types/product").Product>(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () =>
    apiCall<import("../types/product").Category[]>("/categories"),

  getById: (id: number) =>
    apiCall<import("../types/product").Category>(`/categories/${id}`),
};
