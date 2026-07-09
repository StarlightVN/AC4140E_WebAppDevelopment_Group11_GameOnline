import type { AuthResponse } from '@/src/types';

import { apiRequest } from './client';

export function register(username: string, password: string) {
  return apiRequest<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function login(username: string, password: string) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}
