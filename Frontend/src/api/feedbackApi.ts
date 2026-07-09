import { apiRequest } from './client';

export function submitFeedback(data: { name: string; email: string; content: string }) {
  return apiRequest<{ message: string }>('/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
