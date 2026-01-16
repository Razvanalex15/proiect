// js/api.js
import { cacheGet, cacheSet } from "./storage.js";

const FIELDS = "name,flags,cca2,capital,languages,currencies,maps,population";

export async function fetchByNamePartial(query) {
  const cacheKey = `name_partial:${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Nicio potrivire.");

  const data = await res.json();
  cacheSet(cacheKey, data);
  return data;
}

export async function fetchByNameFull(query) {
  const cacheKey = `name_full:${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=true&fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Țara nu a fost găsită.");

  const data = await res.json();
  cacheSet(cacheKey, data);
  return data;
}

export async function fetchCountryByCode(cca2) {
  const cacheKey = `code:${cca2}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(cca2)}?fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  const country = Array.isArray(data) ? data[0] : data;
  cacheSet(cacheKey, country);
  return country;
}

export async function loadCountriesForDatalist() {
  const cacheKey = "all_names";
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
  const data = await res.json();
  cacheSet(cacheKey, data);
  return data;
}
