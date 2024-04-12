import { getToken } from "./authenticate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  headers.append("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.ok) {
    return response.json();
  } else {
    const errorResponse = await response.text();
    console.error(`Error fetching data: ${response.status}`, errorResponse);
    throw new Error("Failed to fetch data");
  }
}

export const addToFavourites = (id) => fetchWithAuth(`/favourites/${id}`, { method: "PUT" });

export const removeFromFavourites = (id) => fetchWithAuth(`/favourites/${id}`, { method: "DELETE" });

export const getFavourites = () => fetchWithAuth("/favourites", { method: "GET" });

export const addToHistory = (id) => fetchWithAuth(`/history/${id}`, { method: "PUT" });

export const removeFromHistory = (id) => fetchWithAuth(`/history/${id}`, { method: "DELETE" });

export const getHistory = () => fetchWithAuth("/history", { method: "GET" });
