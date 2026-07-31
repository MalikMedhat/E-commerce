
import { setAuthToken, getAuthToken } from '@workspace/api-client-react';

export function setupApiClient() {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
}
