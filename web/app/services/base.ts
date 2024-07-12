export const baseURL = window.location.origin;

export const fetcher = async (url: string) => {
  const res = await fetch(`${baseURL}${url}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await res.json();
  if (result.code !== 0) {
    throw new Error(result.msg);
  }
  return result.data;
};
