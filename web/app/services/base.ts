export const baseURL = window.location.origin;

let _getToken: null | (() => Promise<string | null>) = null;

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export const fetcher = async (url: string, opt?: FetchOptions) => {
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
};

export const createFetcher = (getToken: () => Promise<string | null>) => {
  _getToken = getToken;
  return fetcher;
};
