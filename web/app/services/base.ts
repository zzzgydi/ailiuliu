export const baseURL = window.location.origin;

export const fetcher = async (url: string) => {
  const res = await fetch(`${baseURL}${url}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
};
