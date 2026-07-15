import Constants from 'expo-constants';

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
const metroHost = Constants.expoConfig?.hostUri?.split(':')[0];

export const API_BASE_URL =
  configuredUrl ??
  (metroHost ? `http://${metroHost}:3000/api` : 'http://localhost:3000/api');

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  path: string,
  { token, ...options }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type');
    const payload = contentType?.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      throw new Error(payload?.message ?? `Yêu cầu thất bại (${response.status}).`);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Máy chủ phản hồi quá lâu. Kiểm tra backend và mạng Wi-Fi.');
    }

    if (error instanceof TypeError) {
      throw new Error('Không kết nối được backend. Hãy kiểm tra IP máy tính và Wi-Fi.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
