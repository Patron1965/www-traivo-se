# Välj svarsnivå i AI-demonstratorn

Lägg till en enkel nivå-väljare ovanför AI-input på startsidan så besökaren själv kan välja hur svaren ska formuleras. Det gör demon mer relevant både för IT/AI-vana och för verksamhetsfolk som "bara använder IT".

## Tre nivåer

1. **Verksamhet** (default)
   Vardagligt språk, fokus på affärsnytta, tid sparad, färre stressmoment. Inga förkortningar (API, LLM, RAG, etc.) utan förklaring.
2. **Blandad**
   Branschtermer från fältservice (rutter, dispatch, ärenden, SLA) men håller AI/IT-jargong nere. Bra för planerare och driftchefer.
3. **IT/AI-van**
   Får använda tekniska begrepp (LLM, edge, integrationer, webhooks, multi-tenant, RLS). Mer detaljer om arkitektur när det är relevant.

## UX

- Liten segmenterad knapp-rad direkt ovanför textarean i `AIInput.tsx`, label: "Anpassa svaren för:"
- Tre pills: Verksamhet · Blandad · IT/AI-van
- Val sparas i `localStorage` (`traivo-answer-level`) så återkommande besökare slipper välja om
- Default = "Verksamhet" (matchar majoriteten av målgruppen)
- När man byter nivå mitt i en konversation visas en diskret notis: "Nästa svar anpassas till [nivå]"

## Hur nivån styr svaret

- Nivån skickas med i `fetch`-anropet till edge-funktionen `chat` som ett extra fält (`level`)
- Edge-funktionen lägger till en kort instruktion sist i system-prompten beroende på nivå, t.ex.:
  - Verksamhet: "Svara i vardagligt språk. Undvik IT/AI-termer. Fokusera på tid, pengar, mindre stress."
  - Blandad: "Använd branschtermer från fältservice men förklara IT-begrepp kort."
  - IT/AI-van: "Du får använda tekniska begrepp utan förklaring. Var gärna konkret om arkitektur och integrationer."
- Inga andra ändringar i prompten — bara ett tillägg

## Filer som berörs

- `src/components/AIInput.tsx` — ny nivå-väljare, state, localStorage, skicka `level` i body
- `supabase/functions/chat/index.ts` — ta emot `level`, lägg till nivå-instruktion i system-prompten

## Vad som INTE ingår

- Ingen ändring av övriga sidor (Hjärnan, Kunskap m.m.)
- Ingen översättning till engelska i denna iteration (kan läggas till sen via `useT`)
- Ingen analytics-spårning av valet (kan läggas till om du vill se vilken nivå besökare väljer)
