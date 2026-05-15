# Google Search Console-verifiering på /domain-status

Lägg till en sektion på `/domain-status` som hjälper dig verifiera `https://traivo.se/` i Google Search Console — synlig först när båda domänerna är **Active**.

## Vad användaren ser

Ny knapp i headern på `/domain-status`:

- **Innan Active**: knappen är inaktiverad med texten "Verifiera i Google Search Console (väntar på Active)".
- **När båda är Active**: knappen blir aktiv. Klick öppnar en dialog (shadcn `Dialog`) med ett 4-stegs flöde:

```text
Steg 1  Hämta meta-tag från Google
        [ Hämta verifierings-token ]   → kallar edge function
        Visar token i kodruta + Kopiera-knapp

Steg 2  Lägg in tagg i index.html
        Förifylld kodrad: <meta name="google-site-verification" content="..." />
        Instruktion: klistra in i <head>, publicera (Publish-knappen uppe till höger)

Steg 3  Verifiera hos Google
        [ Kör verifiering ]            → kallar edge function
        Visar OK eller felmeddelande (oftast "deploy inte live än")

Steg 4  Lägg till site i Search Console
        [ Lägg till site ]             → kallar edge function
        Bekräftar att property finns + länk till search.google.com/search-console
```

## Teknik

- Ny edge function `gsc-verify` med tre actions via `?action=`:
  - `token` — POST `/siteVerification/v1/token` (META, identifier `https://traivo.se/`)
  - `verify` — POST `/siteVerification/v1/webResource?verificationMethod=META`
  - `add-site` — PUT `/webmasters/v3/sites/https%3A%2F%2Ftraivo.se%2F`
  - Använder connector-gateway med `LOVABLE_API_KEY` + `GOOGLE_SEARCH_CONSOLE_API_KEY` (båda redan tillgängliga som Supabase-secrets).
  - `verify_jwt = false` i `supabase/config.toml` (publik admin-sida).
- Ny komponent `src/components/GoogleVerifyDialog.tsx` med stegvis UI, kallad från `DomainStatusPage`.
- Knappen i `DomainStatusPage` aktiveras via befintlig `allActive`-flagga.
- Ingen ändring av `index.html` automatiskt — användaren klistrar själv in meta-taggen och trycker Publish (frontend kräver manuell publish enligt projektets minne).

## Vad som inte ingår

- Ingen automatisk insättning av meta-taggen i `index.html` (kräver fil-edit + manuell publish — bättre att du kopierar in själv så du ser vad som händer).
- Ingen sitemap-submit i samma flöde — det görs separat när verifieringen är klar.
