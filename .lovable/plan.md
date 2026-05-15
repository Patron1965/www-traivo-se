# Välj svarsnivå redan på startsidan

Flytta upp nivå-valet till hero på `/` så besökaren väljer ton innan de klickar in i AI-demonstratorn. Hjärnan på `/hjarna` läser samma val och anpassar svaren direkt.

## Två nivåer (nya etiketter)

1. **"Rutinerat IT — på väg med AI"** (id: `tech`)
   Tekniska begrepp utan förklaring (LLM, edge, integrationer, webhooks, multi-tenant, offline-sync, RLS). Mer arkitektur och dataflöden när det är relevant.

2. **"IT bra — AI intressant"** (id: `business`, default)
   För dig som har IT på plats men inte hunnit sätta dig in i AI. Vardagligt språk, fokus på affärsnytta. Förkortningar (API, LLM, RAG, webhook, RLS) förklaras kort i parentes första gången.

## Placering & UX

- Liten segmenterad pill-rad i `MondayHero.tsx`, direkt ovanför "Beskriv din verksamhet anonymt"-länken.
- Label: "Vilken nivå vill du ha svaren på?"
- Pillarna animeras in mjukt tillsammans med övriga hero-element.
- Valet sparas i `localStorage` (`traivo-answer-level`).
- Ingen separat knapp — själva valet aktiverar och länken under tar besökaren vidare till hjärnan.
- Liten hint under: "Hjärnan anpassar svaren efter ditt val."

## Hjärnan på `/hjarna`

- `AIInput.tsx` läser redan `traivo-answer-level` från localStorage — etiketterna i pill-raden där uppdateras till samma två nya texter så det blir konsekvent.
- Besökaren ser sitt val redan förvalt när de landar på sidan.

## Edge-funktion `chat`

- Ingen ändring i logiken. `level`-parametern (`"business" | "tech"`) finns redan och styr system-prompten.

## Filer som berörs

- `src/components/MondayHero.tsx` — ny nivå-väljare ovanför hjärn-länken, läser/skriver localStorage.
- `src/components/AIInput.tsx` — uppdaterade etiketter på pill-raden så de matchar startsidan.

## Vad som INTE ingår

- Ingen ändring av övriga sidor.
- Ingen översättning till engelska i denna iteration (etiketterna läggs in på svenska, EN-fallback samma text).
- Ingen analytics-spårning av valet.
