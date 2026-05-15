# Säkerställ att de två nivåerna får relevanta svar

Idag skickas bara `level` med och en kort instruktion läggs sist i system-prompten. Det räcker inte — modellen tappar ofta tonen efter några turer eller ignorerar nivån. Vi gör fyra konkreta saker för att garantera relevans.

## 1. Skarpare system-prompt per nivå (med exempel)

Byt ut dagens korta `LEVEL_INSTRUCTIONS` mot en tydlig nivå-sektion med:

- **Hårda regler** ("Använd ALDRIG", "Använd ALLTID")
- **Ordlista** med ord som får/inte får användas på nivån
- **Före/efter-exempel** (1 kort exempel per nivå) som visar samma fråga besvarad rätt

### "IT bra — AI används" (`business`)
- Vardagligt språk. Affärsnytta först (tid, pengar, mindre stress, nöjdare kunder).
- Förbjudna termer utan parentes-förklaring: API, LLM, RAG, webhook, edge, RLS, SDK, multi-tenant, embedding, vektor.
- Tillåtna analogier: "som en assistent som...", "tänk dig att...".
- Max 3–4 meningar per stycke. Konkreta siffror när det går ("15–20 % kortare körsträcka").

### "Rutinerat IT — på väg med AI" (`tech`)
- Får använda tekniska begrepp utan förklaring.
- Ska beröra arkitektur/dataflöde när det är relevant: integrationer (REST, webhooks), offline-sync, multi-tenant/RLS, edge functions, prompt/LLM-val.
- Får nämna integrationsytor (Fortnox, Visma, IoT-sensorer, GPS, REST API).
- Fortfarande kortfattad — undvik onödig teori.

## 2. Skicka nivån i varje turn (inte bara första)

Idag skickas `level` en gång, men modellen kan glida tillbaka. Lös genom att lägga in en **liten påminnelse som sista system-meddelande** precis innan användarens senaste fråga:

```
[Nivå-påminnelse: svara enligt 'IT bra — AI används' / 'Rutinerat IT — på väg med AI']
```

Det håller tonen stabil genom hela konversationen utan att blåsa upp prompten.

## 3. Anpassade föreslagna frågor per nivå

I `AIInput.tsx` har vi `suggestedQuestions` som är samma för alla. Dela upp:

- **business**: "Vad sparar vi på det här?", "Hur funkar det när nätet ligger nere?", "Vi använder Fortnox idag", "Vad behöver vi göra för att komma igång?"
- **tech**: "Hur ser integrationen mot Fortnox ut?", "Hur hanterar ni offline-sync och konfliktlösning?", "Är det multi-tenant med RLS per kund?", "Vilken modell driver AI-planeringen?"

Det styr besökaren mot frågor där nivå-skillnaden faktiskt syns.

## 4. Validering på klientsidan

Edge-funktionen validerar redan `level`. Lägg till samma whitelist i `streamChat` så att felstavade värden aldrig skickas — fallback till `business`.

## Filer som berörs

- `supabase/functions/chat/index.ts` — skarpare `LEVEL_INSTRUCTIONS`, lägga in nivå-påminnelse som sista system-meddelande före user-turn.
- `src/components/AIInput.tsx` — två uppsättningar `suggestedQuestions` som väljs efter `level`, klient-side level-validering.

## Vad som INTE ingår

- Inga ändringar i hero/Mondays nivå-väljare (den fungerar redan).
- Ingen A/B-test eller analytics-spårning av nivå-effekt.
- Ingen byte av AI-modell — fortsatt `google/gemini-3-flash-preview`.
- Inga few-shot-exempel som assistant-meddelanden i historik (skulle förorena context).
