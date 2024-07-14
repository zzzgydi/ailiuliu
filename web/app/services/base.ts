export const baseURL = window.location.origin;

let _getToken: null | (() => Promise<string | null>) = null;

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export async function fetcher<T = any>(
  url: string,
  opt?: FetchOptions
): Promise<T> {
  const token = await _getToken?.();
  const headers: any = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseURL}${url}`, {
    method: opt?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...opt?.headers,
    },
    credentials: "include",
    body: opt?.body ? JSON.stringify(opt?.body) : undefined,
  });
  const result = await res.json();
  if (result.code !== 0) {
    throw new Error(result.msg);
  }
  return result.data;
}

export async function fetchStream<T = any>(url: string, opt?: FetchOptions) {
  const token = await _getToken?.();
  const headers: any = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const stream = await fetch(`${baseURL}${url}`, {
    method: opt?.method ?? "POST",
    headers: {
      "Content-Type": "text/event-stream",
      ...headers,
      ...opt?.headers,
    },
    credentials: "include",
    body: opt?.body ? JSON.stringify(opt?.body) : undefined,
  });

  const contentType = stream.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    const result = await stream.json();
    if (result.code !== 0) {
      throw new Error(result.msg);
    }
    throw new Error("invalid content type");
  }
  return stream;
}

export const createFetcher = (getToken: () => Promise<string | null>) => {
  _getToken = getToken;
  return fetcher;
};
