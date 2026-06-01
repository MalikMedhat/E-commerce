const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8088/api";

const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const productAPI = {
  getAll: () => apiCall<import("../types/product").Product[]>("/products"),
  getById: (id: number) =>
    apiCall<import("../types/product").Product>(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => apiCall<import("../types/product").Category[]>("/categories"),
  getById: (id: number) =>
    apiCall<import("../types/product").Category>(`/categories/${id}`),
};
