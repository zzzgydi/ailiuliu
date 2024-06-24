export let baseURL = window.location.origin;

if (process.env.NODE_ENV === "development") {
  const temp = import.meta.env.VITE_API_BASE_URL;
  if (temp) baseURL = temp;
}

export const fetcher = async (url: string) => {
  const res = await fetch(`${baseURL}${url}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
};
