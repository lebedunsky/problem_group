const TOKEN_KEY = "pg_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.error || "Помилка запиту");
  }
  return data as T;
}

export const get = <T>(path: string) => api<T>(path);
export const post = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "POST", body: JSON.stringify(body) });
export const put = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "PUT", body: JSON.stringify(body) });
export const del = <T>(path: string) => api<T>(path, { method: "DELETE" });
