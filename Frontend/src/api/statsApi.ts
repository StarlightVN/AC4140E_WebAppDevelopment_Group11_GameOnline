import { apiRequest } from './client';

type ViewCountResponse = {
  view_count: number;
};

export function incrementViewCount() {
  return apiRequest<{ message: string }>('/stats/increment', {
    method: 'POST',
  });
}

export function getViewCount() {
  return apiRequest<ViewCountResponse>('/stats');
}
