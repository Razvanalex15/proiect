// js/ui.js
export function getEls() {
  const input = document.getElementById("countryInput");
  const btn = document.getElementById("searchBtn");
  const result = document.getElementById("result");
  const statusEl = document.getElementById("status");
  const datalist = document.getElementById("countriesList");

  const resultsList = document.getElementById("resultsList");
  const historyList = document.getElementById("historyList");
  const favoritesList = document.getElementById("favoritesList");

  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const clearFavBtn = document.getElementById("clearFavBtn");

  return {
    input, btn, result, statusEl, datalist,
    resultsList, historyList, favoritesList,
    clearHistoryBtn, clearFavBtn,
  };
}

export function setStatus(statusEl, msg = "") {
  statusEl.textContent = msg;
}

export function clearResultsList(state, resultsList) {
  resultsList.innerHTML = "";
  state.latestResults = [];
  state.activeIndex = -1;
}
