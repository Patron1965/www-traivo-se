# Plan: Betald djupanalys på Hjärnan

## Vad vi bygger

Efter att Hjärnan gett sitt gratis snabbsvar dyker ett uppgraderings-kort upp:

> **Vill du gå djupare?** Få en utförlig analys (3–5 sidor) av risker, möjligheter, ROI-uppskattning och en prioriterad åtgärdsplan — skickad som PDF till din mejl. **399 kr.**

Användaren klickar → fyller i e-post + fakturauppgifter (företag, namn, ev. org.nr) → betalar med kort via Stripe → vi genererar PDF-rapporten i bakgrunden med Lovable AI → mejlar den som bilaga + bekräftelse.

Snabb-Hjärnan förblir helt anonym och gratis (precis som idag). Djupanalysen är ett tydligt separat premium-spår.

## Användarflöde

```
/hjarna
  └─ Snabbsvar visas (gratis, anonymt)
       └─ NYTT KORT: "Vill du gå djupare? 399 kr"
            └─ Klick → Modal/sida med formulär:
                  • E-post (för leverans)
                  • Företag + ditt namn (för faktura)
                  • Org.nr (valfritt, för moms-spec)
                  • Bekräfta verksamhetsbeskrivningen
                 → "Betala 399 kr" → Stripe Checkout
                      └─ Tillbaka till /hjarna/tack?session_id=xxx
                            • "Tack! Din rapport genereras nu och kommer
                              till din mejl inom några minuter."
                            • Bakgrundsjobb: AI genererar PDF + mejlar den
```

## Innehåll i djupanalysen (3–5 sidor PDF)

AI:n får en mer omfattande prompt än Hjärnan och producerar:

1. **Sammanfattning** — kärnproblem, vår bedömning på 3 rader
2. **Verksamhetsanalys** — vad vi förstår om dem (storlek, modell, nuvarande flöden)
3. **Risker & flaskhalsar** — 4–6 specifika punkter
4. **Möjligheter** — 4–6 konkreta förbättringsområden
5. **ROI-uppskattning** — grov beräkning baserat på antal tekniker/bilar/objekt de nämnt
6. **Rekommenderade Traivo-moduler** — prioriterad lista, vad löser vad
7. **Prioriterad åtgärdsplan** — 30/60/90 dagar
8. **Nästa steg** — boka demo

PDF:en brandas med Traivo-loggotyp, primärfärg och samma typografi som sajten.

## Tekniska delar

### 1. Aktivera betalningar
- Aktivera Lovable Payments med Stripe (test-läge direkt, live efter verifiering)
- Skapa en produkt: "Traivo Djupanalys" — 399 kr engångsbetalning

### 2. Ny tabell: `deep_analyses`
Spara alla beställningar för spårning, kvitton, omleveranser:
- `id`, `created_at`
- `email`, `company`, `contact_name`, `org_number` (nullable)
- `business_description` (texten användaren skickat in)
- `quick_response` (Hjärnans gratissvar — sparas så AI:n kan bygga vidare)
- `stripe_session_id`, `payment_status` (pending/paid/failed/refunded)
- `report_status` (pending/generating/sent/failed)
- `pdf_storage_path` (i Supabase Storage)
- `paid_at`, `report_sent_at`

RLS: ingen publik SELECT — bara edge functions skriver/läser via service role.

### 3. Storage bucket: `deep-analysis-reports`
Privat bucket där PDF:erna sparas. Endast åtkomlig via signed URLs från edge functions.

### 4. Edge functions
- **`create-checkout`** — tar emot beställningsdata, skapar `deep_analyses`-rad, returnerar Stripe Checkout-URL
- **`stripe-webhook`** — lyssnar på `checkout.session.completed`, markerar betald, triggar generering
- **`generate-deep-analysis`** — kallar Lovable AI (gemini-2.5-pro för djup), bygger PDF med React PDF eller Puppeteer, sparar i Storage
- **`send-deep-analysis-email`** — mejlar PDF som bilaga via Lovable Emails (kräver e-post-domän setup)

### 5. Email-infrastruktur
- Sätta upp en avsändardomän (t.ex. `notify.traivo.se`) för att mejla PDF:er från `noreply@traivo.se`
- Skapa transactional email template: "Din djupanalys är klar"

### 6. UI-ändringar i `src/pages/BrainPage.tsx`
- Lägga till uppgraderings-kort efter Hjärnans svar (när `latestResponse && !isLoading`)
- Skapa `src/components/DeepAnalysisUpsell.tsx` — det säljande kortet
- Skapa `src/pages/DeepAnalysisCheckout.tsx` — formulärsidan (`/hjarna/djupanalys`)
- Skapa `src/pages/DeepAnalysisThankYou.tsx` — kvittosidan (`/hjarna/tack`)

### 7. Bekräftelsesida + statuspolling
Tack-sidan pollar `deep_analyses` var 5:e sekund för att visa:
- "Genererar din rapport…" (spinner)
- "Din rapport har skickats till {email} ✓"
- Vid problem: "Något gick fel — vi har fått notis och kontaktar dig"

## Anonymitet — vad ändras

- **Snabb-Hjärnan:** oförändrat helt anonym. Loggar inget.
- **Djupanalys:** kräver e-post + företag + namn. Tydligt kommunicerat på upgrade-kortet: *"För att leverera din rapport och kvitto behöver vi e-post och fakturauppgifter."*
- Privacy-bannern på sidan uppdateras för att förklara skillnaden.

## Vad jag rekommenderar att vi INTE bygger nu

- **Manuell granskning före leverans** — börja med ren AI-leverans, lägg till mänsklig review senare om det visar sig behövas
- **Kundportal med tidigare rapporter** — onödigt för engångsköp; använd PDF + e-post som arkivering
- **Refunds-flöde i UI** — hantera de få fall som dyker upp manuellt via Stripe-dashboard

## Genomförandeordning

1. Aktivera Lovable Payments (Stripe) + skapa produkten
2. Skapa databas-tabell + storage bucket
3. Sätt upp e-postdomän + transactional email
4. Bygg edge functions (checkout → webhook → generera PDF → mejla)
5. Bygg UI (upsell-kort → checkout-form → tack-sida)
6. Uppdatera privacy-bannern på /hjarna
7. Testa hela flödet i Stripe sandbox med 100 % rabattkod

## Frågor jag inte tagit ställning till — kan justeras efter approval

- **Moms:** Stripe kan automatiskt lägga på 25 % moms ovanpå 399 kr (= 499 kr för kund). Eller är 399 kr inklusive moms? *Default i planen: 399 kr inkl. moms.*
- **Avsändardomän:** Jag föreslår `notify.traivo.se` — säg till om ni vill ha annan.
- **PDF-bibliotek:** React PDF (renderar direkt i edge function) är enklast. Puppeteer ger snyggare resultat men mer komplex setup. *Default: React PDF.*

Säg till när jag ska köra igång — eller om något ska justeras först.