import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';
import { useAuthStore } from '../store/authStore';

export function setupApiClient() {
  // For local development, use the local mock API server
  // For production, this will use the deployed Vercel function
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8088';

  setBaseUrl(apiBaseUrl);

  setAuthTokenGetter(() => {
    const token = useAuthStore.getState().token;
    return token;
  });
}
