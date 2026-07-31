import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';
import { useAuthStore } from '../store/authStore';

export function setupApiClient() {
  // Use the deployed Vercel function by default. A custom backend URL can still
  // be supplied through VITE_API_BASE_URL for local or Docker deployments.
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';

  setBaseUrl(apiBaseUrl);

  setAuthTokenGetter(() => {
    const token = useAuthStore.getState().token;
    return token;
  });
}
