## Mål

Anpassa priset på Djupanalysen till svensk B2B-standard: visa **399 kr exkl. moms** i hela UI:et, och säkerställ att Stripe lägger på moms (498,75 kr totalt vid checkout) istället för att momsen är inbakad i 399.

## Bakgrund

I Sverige är det lagkrav/branschpraxis att B2B-priser anges **exklusive moms**. Idag står det "399 kr inkl. moms" på två ställen, vilket både är fel signal till företagskunder och troligen fel konfigurerat i Stripe (priset är sannolikt satt som `tax_behavior: inclusive`, så kunden betalar 399 kr totalt och företaget får bara 319 kr netto).

## Ändringar

### 1. UI-texter (visuellt)

**`src/components/DeepAnalysisUpsell.tsx`** (rad 73–74)
- Ändra "inkl. moms · engångsbetalning" → **"exkl. moms · engångsbetalning"**

**`src/pages/DeepAnalysisCheckout.tsx`**
- Rad 149: behåll "Traivo Djupanalys · 399 kr" som den är (neutral)
- Rad 299: "399 kr inkl. moms" → **"399 kr exkl. moms"**
- Lägg till en rad direkt under: liten muted text "498,75 kr inkl. moms" så kunden tydligt ser totalsumman före checkout

### 2. Stripe-pris (tax_behavior)

Det befintliga priset `deep_analysis_one_time` i Stripe är sannolikt satt som `tax_behavior: inclusive`. Jag uppdaterar produkten/priset så:
- `unit_amount` = **39900** (399,00 kr)
- `tax_behavior` = **`exclusive`**
- `currency` = `sek`

Stripe tillåter inte att man ändrar `tax_behavior` på ett befintligt pris — i så fall skapas ett nytt pris med samma `lookup_key` (`deep_analysis_one_time`), och det gamla arkiveras. `create-deep-analysis-checkout`-funktionen letar redan upp priset via `lookup_keys`, så ingen kodändring behövs där.

Detta körs som en engångsuppdatering via en uppdaterad version av `setup-deep-analysis-product`-edge functionen (den finns redan, jag utökar den till att även hantera priset, inte bara `tax_code`).

### 3. Verifiering

Efter deploy:
1. Öppna `/hjarna/djupanalys`
2. Bekräfta att UI visar "399 kr exkl. moms" + "498,75 kr inkl. moms"
3. Starta sandbox-checkout med kort `4242 4242 4242 4242`
4. Bekräfta att Stripe-betalfönstret visar:
   - Subtotal: 399,00 kr
   - Moms (25%): 99,75 kr
   - **Totalt: 498,75 kr**

## Inget som ändras

- `Pricing.tsx` är redan korrekt ("Priserna är exklusive moms")
- Edge function-logiken för checkout/webhook/PDF rörs inte
- Inga ändringar i databasschemat
- Inga ändringar i `automatic_tax`-flaggan (den är redan på)
