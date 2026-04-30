# Färdigställ engelsk översättning

i18n-infrastrukturen (`LanguageProvider`, `useT()`, `LanguageToggle` i navbar) finns redan på plats. Edge-funktionen `brain` accepterar redan `language`-parameter. Det som återstår är att fixa byggfelet på `BrainPage.tsx` och översätta resterande UI-strängar.

## Vad som ska göras

### 1. Fixa byggfel
- **`src/pages/BrainPage.tsx`** rad ~203: `streamBrain` saknar `language`-argumentet. Skicka med `lang` från `useLang()` i request-body till edge-funktionen.

### 2. Översätt återstående sidor
- **`src/pages/BrainPage.tsx`** — UI-strängar, exempel-chips (8 st: Avfall & sanering → Waste & sanitation, Fastighetsdrift → Property operations, Värme & kyla → Heating & cooling, VVS-företag → Plumbing, Elinstallation → Electrical, Mark & trädgård → Grounds & landscaping, Bygg & hantverk → Construction & trades, samt befintliga). Exempeltexterna översätts också så engelska användare ser engelska scenarier.
- **`src/pages/GoLiveChecklist.tsx`** — checklisterubriker, status-texter, knappar.
- **`src/pages/DeepAnalysisCheckout.tsx`** — checkout-flöde, prisinfo, knappar.
- **`src/pages/DeepAnalysisThankYou.tsx`** — tackmeddelande, leveransinfo.
- **`src/pages/NotFound.tsx`** — 404-text.

### 3. Översätt återstående komponenter
- **`src/components/BrainHero.tsx`** — rubriker, beskrivning, CTA.
- **`src/components/AIInput.tsx`** — placeholder, knappar, statusmeddelanden.
- **`src/components/AIChatLink.tsx`** — länktext.
- **`src/components/HowItWorks.tsx`** — rubrik, steg.
- **`src/components/TeamSection.tsx`** — rubrik, roller (behåll namn).
- **`src/components/AboutVisual.tsx`** — eventuella textetiketter.
- **`src/components/PaymentTestModeBanner.tsx`** — banner-text.

### 4. Konsekvensgranskning
Sök igenom hela `src/` med `rg` efter återstående svenska strängar (vanliga ord: "och", "för", "med", "är", "vi") som inte är inlindade i `t({ sv, en })` — fixa det jag hittar.

## Tekniska detaljer

- Använder befintlig `useT()`-hook överallt: `t({ sv: "…", en: "…" })`.
- `useLang()` används där vi behöver själva språkkoden (BrainPage för att skicka till edge-funktion, ev. för att välja exempeltext).
- Inga nya bibliotek, inga nya routes, inga nya filer — endast refaktor av strängar.
- Edge-funktionen är redan klar (`SYSTEM_PROMPT_EN` finns).
- Språkval sparas i `localStorage` (redan implementerat) — sömlöst mellan sidor.

## Resultat
Hela publika sajten + Hjärnan/AI-flödet + checkout-flödet fungerar fullt ut på engelska. Användaren växlar med SV/EN-knappen i navbaren. Svenska förblir standard.