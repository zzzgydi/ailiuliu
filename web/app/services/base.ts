export const baseURL = window.location.origin;

interface FetchOptions {
  headers?: Record<string, string>;
}

export const fetcher = async (url: string, opt?: FetchOptions) => {
  const res = await fetch(`${baseURL}${url}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...opt?.headers },
    credentials: "include",
  });
  const result = await res.json();
  if (result.code !== 0) {
    throw new Error(result.msg);
  }
  return result.data;
};

export const createFetcher = (getToken: () => Promise<string | null>) => {
  return async (url: string) => {
    const token = await getToken();
    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return fetcher(url, { headers });
  };
};
