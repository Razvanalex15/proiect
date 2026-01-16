// js/storage.js
export const LS_HISTORY = "cs_history_v1";
export const LS_FAVS = "cs_favs_v1";
export const LS_CACHE = "cs_cache_v1";

export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function lsReadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function lsWriteJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Cache
export function cacheGet(cacheKey) {
  const cache = lsReadJSON(LS_CACHE, {});
  const entry = cache[cacheKey];
  if (!entry) return null;

  const isExpired = Date.now() - entry.t > CACHE_TTL_MS;
  if (isExpired) {
    delete cache[cacheKey];
    lsWriteJSON(LS_CACHE, cache);
    return null;
  }
  return entry.v;
}

export function cacheSet(cacheKey, value) {
  const cache = lsReadJSON(LS_CACHE, {});
  cache[cacheKey] = { t: Date.now(), v: value };
  lsWriteJSON(LS_CACHE, cache);
}

// ---- History
export function getHistory() {
  return lsReadJSON(LS_HISTORY, []);
}

export function addToHistory(term) {
  const q = term.trim();
  if (!q) return;

  const history = getHistory();
  const normalized = q.toLowerCase();
  const filtered = history.filter(h => h.toLowerCase() !== normalized);
  filtered.unshift(q);

  lsWriteJSON(LS_HISTORY, filtered.slice(0, 10));
}

export function clearHistory() {
  localStorage.removeItem(LS_HISTORY);
}

// ---- Favorites
export function getFavs() {
  return lsReadJSON(LS_FAVS, []);
}

export function isFav(cca2) {
  return getFavs().some(f => f.cca2 === cca2);
}

export function addFav(country) {
  const favs = getFavs();
  if (favs.some(f => f.cca2 === country.cca2)) return;

  favs.unshift({ cca2: country.cca2, name: country.name?.common ?? "Unknown" });
  lsWriteJSON(LS_FAVS, favs.slice(0, 50));
}

export function removeFav(cca2) {
  const favs = getFavs().filter(f => f.cca2 !== cca2);
  lsWriteJSON(LS_FAVS, favs);
}

export function clearFavs() {
  localStorage.removeItem(LS_FAVS);
}
