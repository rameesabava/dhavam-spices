
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const headers = new Headers(options.headers);

  // Do not set Content-Type manually for FormData.
  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed: ${response.status}`
    );
  }

  return data as T;
}
