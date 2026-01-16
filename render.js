// js/render.js
import { isFav, addFav, removeFav, getHistory, getFavs } from "./storage.js";

export function formatNumber(n) {
  return new Intl.NumberFormat("ro-RO").format(n);
}

export function getLanguages(languages) {
  if (!languages) return "N/A";
  return Object.values(languages).join(", ");
}

export function getCurrency(currencies) {
  if (!currencies) return "N/A";
  const key = Object.keys(currencies)[0];
  return currencies[key]?.name ?? "N/A";
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function syncActiveItem(resultsList, activeIndex) {
  const items = [...resultsList.querySelectorAll("li")];
  items.forEach((li, i) => li.classList.toggle("active", i === activeIndex));
}

export function renderCountryCard({ resultEl, country, onOpenFavsRefresh }) {
  const favText = isFav(country.cca2) ? "★ In favorites" : "☆ Add to favorites";

  resultEl.innerHTML = `
    <div class="card">
      <div class="left">
        <img class="flag" src="${country.flags?.png ?? ""}" alt="flag" />
        <div>
          <p class="country-name">${escapeHtml(country.name?.common ?? "Unknown")}</p>
          <div class="meta">
            <div><span>Capital:</span>${escapeHtml(country.capital?.[0] ?? "N/A")}</div>
            <div><span>Language:</span>${escapeHtml(getLanguages(country.languages))}</div>
            <div><span>Currency:</span>${escapeHtml(getCurrency(country.currencies))}</div>
            <div><span>Map:</span>
              <a href="${country.maps?.googleMaps ?? "#"}" target="_blank" rel="noreferrer">Google Maps</a>
            </div>
            <div><a href="#" id="favToggle">${favText}</a></div>
          </div>
        </div>
      </div>

      <div class="right">
        <div><span>Population:</span> ${formatNumber(country.population ?? 0)}</div>
      </div>
    </div>
  `;

  const favToggle = document.getElementById("favToggle");
  favToggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (isFav(country.cca2)) removeFav(country.cca2);
    else addFav(country);

    // refresh UI (text + favorites list)
    renderCountryCard({ resultEl, country, onOpenFavsRefresh });
    onOpenFavsRefresh?.();
  });
}

export function renderResultsList({ resultsListEl, countries, state, onPick }) {
  resultsListEl.innerHTML = "";
  state.activeIndex = -1;

  if (!countries || countries.length === 0) {
    resultsListEl.innerHTML = `<li><small>No results</small></li>`;
    state.latestResults = [];
    return;
  }

  state.latestResults = countries.slice(0, 10);

  state.latestResults.forEach((c, idx) => {
    const li = document.createElement("li");
    const name = c.name?.common ?? "Unknown";
    const cap = c.capital?.[0] ?? "N/A";
    li.innerHTML = `<span>${escapeHtml(name)}</span><small>${escapeHtml(cap)}</small>`;

    li.addEventListener("click", () => onPick(c, idx));
    resultsListEl.appendChild(li);
  });
}

export function renderHistory({ historyListEl, onClickTerm }) {
  const history = getHistory();
  historyListEl.innerHTML = "";

  if (history.length === 0) {
    historyListEl.innerHTML = `<li><small>No searches yet</small></li>`;
    return;
  }

  for (const term of history) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${escapeHtml(term)}</span><small>search</small>`;
    li.addEventListener("click", () => onClickTerm(term));
    historyListEl.appendChild(li);
  }
}

export function renderFavorites({ favoritesListEl, onOpenCountry, onRemove }) {
  const favs = getFavs();
  favoritesListEl.innerHTML = "";

  if (favs.length === 0) {
    favoritesListEl.innerHTML = `<li><small>No favorites yet</small></li>`;
    return;
  }

  for (const fav of favs) {
    const li = document.createElement("li");

    const left = document.createElement("span");
    left.textContent = fav.name;

    const right = document.createElement("small");
    right.textContent = "remove";

    left.addEventListener("click", (e) => {
      e.stopPropagation();
      onOpenCountry(fav.cca2);
    });

    right.addEventListener("click", (e) => {
      e.stopPropagation();
      onRemove(fav.cca2);
    });

    li.appendChild(left);
    li.appendChild(right);
    favoritesListEl.appendChild(li);
  }
}
