// Favorites system using localStorage
import type { Domain } from "./types";
import { getDomains } from "./db";

const STORAGE_KEY = "nitaqat:favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(domainId: string) {
  const favorites = getFavorites();
  if (!favorites.includes(domainId)) {
    favorites.push(domainId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(domainId: string) {
  const favorites = getFavorites();
  const filtered = favorites.filter((id) => id !== domainId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function isFavorite(domainId: string): boolean {
  return getFavorites().includes(domainId);
}

export function toggleFavorite(domainId: string): boolean {
  if (isFavorite(domainId)) {
    removeFavorite(domainId);
    return false;
  } else {
    addFavorite(domainId);
    return true;
  }
}

export function getFavoriteDomains(): Domain[] {
  const favorites = getFavorites();
  const allDomains = getDomains();
  return allDomains.filter((d: Domain) => favorites.includes(d.id));
}
