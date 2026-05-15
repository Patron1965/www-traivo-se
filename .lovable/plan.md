# Välj svarsnivå i AI-demonstratorn

Lägg till en enkel nivå-väljare ovanför AI-input på startsidan så besökaren själv kan välja hur svaren ska formuleras.

## Två nivåer

1. **"Förklara vad ni kan göra för oss"** (default)
   För besökare som inte hinner sätta sig in i IT/AI. Vardagligt språk, fokus på affärsnytta — tid sparad, mindre stress, nöjdare kunder, lägre kostnader. Inga förkortningar (API, LLM, RAG, webhook, RLS osv.) utan kort förklaring. Konkreta exempel från vardagen.

2. **"Jag är IT-van / hänger med inom AI"**
   Får använda tekniska begrepp utan förklaring (LLM, edge functions, integrationer, webhooks, multi-tenant, offline-sync, RLS). Mer detaljer om arkitektur, dataflöden och integrationsmöjligheter när det är relevant.

## UX

- Liten segmenterad knapp-rad direkt ovanför textarean i `AIInput.tsx`
- Label: "Anpassa svaren för:"
- Två pills, default = "Förklara vad ni kan göra för oss"
- Val sparas i `localStorage` (`traivo-answer-level`) så återkommande besökare slipper välja om
- Vid byte mitt i konversation: diskret notis "Nästa svar anpassas till [nivå]"

## Hur nivån styr svaret

- Nivån skickas med i `fetch`-anropet till edge-funktionen `chat` som ett extra fält (`level`: `"business"` | `"tech"`)
- Edge-funktionen lägger till en kort instruktion sist i system-prompten:
  - **business**: "Svara i vardagligt språk. Undvik IT/AI-termer eller förklara dem kort. Fokusera på tid, pengar, mindre stress, nöjdare kunder."
  - **tech**: "Du får använda tekniska begrepp utan förklaring. Var gärna konkret om arkitektur, integrationer och dataflöden när det är relevant."
- Inga andra ändringar i prompten

## Filer som berörs

- `src/components/AIInput.tsx` — ny nivå-väljare, state, localStorage, skicka `level` i body
- `supabase/functions/chat/index.ts` — ta emot och validera `level`, lägg till nivå-instruktion i system-prompten

## Vad som INTE ingår

- Ingen ändring av övriga sidor
- Ingen översättning till engelska i denna iteration
- Ingen analytics-spårning av valet
