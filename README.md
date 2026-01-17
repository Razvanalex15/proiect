# Country Search App

Aplicația Country Search permite căutarea țărilor folosind API-ul public
REST Countries, afișând informații detaliate despre fiecare țară, istoricul
căutărilor și o listă de favorite. Aplicația include suport pentru tastatură și
un sistem de cache folosind `localStorage`.

---

## Funcționalitate generală

Aplicația pornește cu un input gol. Utilizatorul poate:

- introduce numele unei țări (parțial sau complet)
- primi sugestii după minimum 3 caractere
- naviga rezultatele folosind ↑ ↓ Enter
- selecta o țară pentru a vedea detalii complete
- salva țări în Favorites
- vedea și reutiliza Last searches

---

## Imaginea 1 – Căutare + sugestii

![Search result – Nigeria](Capture1.PNG)

Utilizatorul tastează Nigeria. Aplicația:

- detectează că există minimum 3 caractere
- face un partial search către API
- afișează rezultatele într-o listă
- lista poate fi parcursă cu săgețile ↑ ↓
- apăsarea Enter selectează țara activă

---

## Imaginea 2 – Detalii țară + istoric

![Country details + history](Capture2.PNG)

După selectarea unei țări:

- este afișat un card detaliat
- informații afișate:
  - Capitală
  - Limbă
  - Monedă
  - Populație
  - Link Google Maps
- căutarea este salvată automat în Last searches
- țara poate fi adăugată în Favorites

---

## LocalStorage & Cache

Aplicația folosește un sistem de cache pentru a evita apeluri inutile către API.

js
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;