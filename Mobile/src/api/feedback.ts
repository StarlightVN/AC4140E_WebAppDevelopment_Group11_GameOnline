import { apiRequest } from './client';

export function submitFeedback(
  data: { name: string; email: string; content: string },
  token: string,
) {
  return apiRequest<{ message: string }>('/feedback', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}
