## Mål

En intern statussida på `/domanstatus` som visar live-status för `traivo.se` och `www.traivo.se` — om domänen är **Active**, **Verifying**, **Failed** eller **Offline** — när den senast kontrollerades, samt tydliga nästa steg beroende på status.

## Vad som byggs

### 1. Edge function: `check-domain-status`
- Publik (verify_jwt = false), ingen auth — bara läsoperationer.
- Tar emot `{ domain: string }` (default `traivo.se`).
- Gör tre kontroller parallellt:
  1. **DNS A-record** via Google DNS-over-HTTPS (`https://dns.google/resolve?name=...&type=A`) — kollar att svaret innehåller `185.158.133.1`.
  2. **DNS TXT** för `_lovable.<domain>` — kollar att en `lovable_verify=...`-rad finns.
  3. **HTTPS reachability** — `fetch` mot `https://<domain>` med kort timeout, läser status och om SSL fungerar.
- Returnerar per domän:
  ```
  { domain, a_record_ok, expected_ip_found, txt_verify_found,
    https_ok, http_status, ssl_ok, derived_status, checked_at }
  ```
- `derived_status` mappas till `Active | Verifying | Failed | Offline | Unknown` enligt:
  - Allt OK → **Active**
  - A-record OK men TXT saknas eller HTTPS svarar Cloudflare 1001 → **Verifying**
  - A-record pekar fel IP → **Offline**
  - A-record OK + TXT OK men SSL/HTTPS failar → **Failed**
  - Inget A-record alls → **Unknown**

Lagt till i `supabase/config.toml`:
```toml
[functions.check-domain-status]
verify_jwt = false
```

### 2. Ny route + sida: `/domanstatus`
- Registreras i `src/App.tsx` under befintliga routes (innan `*`).
- Ny fil `src/pages/DomainStatusPage.tsx`.
- SEO: `<title>Domänstatus – Traivo</title>`, meta description, H1 "Domänstatus".
- Layout följer befintligt designsystem (semantiska tokens, `text-gradient-ocean`, `Card`, `Badge`, lugn ton — inga buzzwords).

Sektioner på sidan:
1. **Översiktshjälte** — kort förklaring att detta är en transparent statussida för domänen, inte en marknadsföringssida.
2. **Statuskort** för varje domän (`traivo.se`, `www.traivo.se`):
   - Stor statusbadge med färg per status (Active = primary/teal, Verifying = warning/amber-ton via `secondary`, Failed/Offline = `destructive`).
   - Rader för: A-record (förväntad IP `185.158.133.1`), TXT `_lovable`, HTTPS-svar, SSL.
   - Tidstämpel "Senast kontrollerad: HH:MM CET".
   - Knapp **Kör om kontrollen** (anropar edge functionen igen).
3. **Nästa steg-panel** — visas kontextuellt baserat på status:
   - **Active**: "Allt fungerar. Inget behöver göras."
   - **Verifying**: lista — vänta upp till 72h på DNS-propagering, kolla Loopia att A-record + TXT är satta, länk till `dnschecker.org/#A/traivo.se`.
   - **Failed**: kontrollera CAA-records, kontakta Lovable-support.
   - **Offline**: instruktioner för att uppdatera A-record hos Loopia till `185.158.133.1`.
4. **Vad varje status betyder** — kort tabell/lista som förklarar Active / Verifying / Failed / Offline på vanlig svenska.

### 3. Datahämtning
- React Query (`useQuery`) anropar edge functionen vid sidladdning och var 60:e sekund.
- Manuell refresh-knapp via `refetch()`.
- Loading skeleton + felhantering om function svarar 5xx.

## Out of scope
- Ingen DB-tabell för historik (kan läggas till senare om önskas).
- Ingen autentisering — sidan är publik och read-only.
- Ingen koppling till Lovables interna domain API (vi har bara DNS- och HTTP-signaler att jobba med).
