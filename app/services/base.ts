export let baseURL = window.location.origin;

if (process.env.NODE_ENV === "development") {
  baseURL = import.meta.env.VITE_API_BASR_URL || "";
}

export const fetcher = async (url: string) => {
  const res = await fetch(`${baseURL}${url}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
};
