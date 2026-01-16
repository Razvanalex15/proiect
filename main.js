// js/main.js
import { getEls, setStatus, clearResultsList } from "./ui.js";
import { addToHistory, clearHistory, clearFavs, removeFav } from "./storage.js";
import {
  fetchByNameFull,
  fetchByNamePartial,
  fetchCountryByCode,
  loadCountriesForDatalist,
} from "./api.js";
import {
  renderCountryCard,
  renderResultsList,
  renderHistory,
  renderFavorites,
  syncActiveItem,
  escapeHtml,
} from "./render.js";

const els = getEls();

const state = {
  latestResults: [],
  activeIndex: -1,
  debounceTimer: null,
};

async function runFullSearch(term) {
  const query = term.trim();
  if (!query) return;

  setStatus(els.statusEl, "Se caută...");
  clearResultsList(state, els.resultsList);
  els.result.innerHTML = "";

  try {
    const data = await fetchByNameFull(query);
    const country = data[0];

    renderCountryCard({
      resultEl: els.result,
      country,
      onOpenFavsRefresh: () => refreshFavorites(),
    });

    setStatus(els.statusEl, "");
    addToHistory(country.name?.common ?? query);
    refreshHistory();
  } catch {
    try {
      const list = await fetchByNamePartial(query);
      renderResultsList({
        resultsListEl: els.resultsList,
        countries: list,
        state,
        onPick: (c, idx) => {
          state.activeIndex = idx;
          syncActiveItem(els.resultsList, state.activeIndex);
          renderCountryCard({
            resultEl: els.result,
            country: c,
            onOpenFavsRefresh: () => refreshFavorites(),
          });
          setStatus(els.statusEl, "");
          addToHistory(c.name?.common ?? query);
          refreshHistory();
        },
      });
      setStatus(els.statusEl, "Alege din listă (↑ ↓ Enter) sau click.");
    } catch (err2) {
      setStatus(els.statusEl, err2.message || "Eroare la căutare.");
      clearResultsList(state, els.resultsList);
      els.result.innerHTML = "";
    }
  }
}

async function runPartialSearch(term) {
  const query = term.trim();
  if (query.length < 3) {
    clearResultsList(state, els.resultsList);
    return;
  }

  setStatus(els.statusEl, "Sugestii...");
  els.result.innerHTML = "";

  try {
    const list = await fetchByNamePartial(query);
    renderResultsList({
      resultsListEl: els.resultsList,
      countries: list,
      state,
      onPick: (c, idx) => {
        state.activeIndex = idx;
        syncActiveItem(els.resultsList, state.activeIndex);
        renderCountryCard({
          resultEl: els.result,
          country: c,
          onOpenFavsRefresh: () => refreshFavorites(),
        });
        setStatus(els.statusEl, "");
        addToHistory(c.name?.common ?? query);
        refreshHistory();
      },
    });
    setStatus(els.statusEl, "Alege din listă (↑ ↓ Enter) sau click.");
  } catch (err) {
    setStatus(els.statusEl, err.message || "Nicio potrivire.");
    clearResultsList(state, els.resultsList);
  }
}

function refreshHistory() {
  renderHistory({
    historyListEl: els.historyList,
    onClickTerm: (term) => {
      els.input.value = term;
      runFullSearch(term);
    },
  });
}

function refreshFavorites() {
  renderFavorites({
    favoritesListEl: els.favoritesList,
    onOpenCountry: async (cca2) => {
      const c = await fetchCountryByCode(cca2);
      if (c) {
        renderCountryCard({
          resultEl: els.result,
          country: c,
          onOpenFavsRefresh: () => refreshFavorites(),
        });
        setStatus(els.statusEl, "");
      } else {
        setStatus(els.statusEl, "Nu pot încărca țara din favorites.");
      }
    },
    onRemove: (cca2) => {
      removeFav(cca2);
      refreshFavorites();
    },
  });
}

async function initDatalist() {
  try {
    const data = await loadCountriesForDatalist();
    els.datalist.innerHTML = data
      .map(c => `<option value="${escapeHtml(c.name?.common ?? "")}">`)
      .join("");
  } catch {
    // ignore
  }
}

// ===== Events =====
els.btn.addEventListener("click", () => runFullSearch(els.input.value));

els.input.addEventListener("input", () => {
  clearTimeout(state.debounceTimer);
  state.debounceTimer = setTimeout(() => runPartialSearch(els.input.value), 300);
});

els.input.addEventListener("keydown", (e) => {
  const hasList = state.latestResults.length > 0;

  if (e.key === "ArrowDown" && hasList) {
    e.preventDefault();
    state.activeIndex = Math.min(state.activeIndex + 1, state.latestResults.length - 1);
    if (state.activeIndex < 0) state.activeIndex = 0;
    syncActiveItem(els.resultsList, state.activeIndex);
    return;
  }

  if (e.key === "ArrowUp" && hasList) {
    e.preventDefault();
    state.activeIndex = Math.max(state.activeIndex - 1, 0);
    syncActiveItem(els.resultsList, state.activeIndex);
    return;
  }

  if (e.key === "Enter") {
    if (hasList && state.activeIndex >= 0) {
      e.preventDefault();
      const c = state.latestResults[state.activeIndex];
      renderCountryCard({
        resultEl: els.result,
        country: c,
        onOpenFavsRefresh: () => refreshFavorites(),
      });
      setStatus(els.statusEl, "");
      addToHistory(c.name?.common ?? els.input.value.trim());
      refreshHistory();
      return;
    }
    runFullSearch(els.input.value);
  }
});

els.clearHistoryBtn.addEventListener("click", () => {
  clearHistory();
  refreshHistory();
});

els.clearFavBtn.addEventListener("click", () => {
  clearFavs();
  refreshFavorites();
});

// ===== Init =====
function init() {
  refreshHistory();
  refreshFavorites();
  initDatalist();

  // IMPORTANT: nu porni cu o țară by default
  els.input.value = "";
  setStatus(els.statusEl, "Scrie minim 3 caractere pentru sugestii.");
}
init();
