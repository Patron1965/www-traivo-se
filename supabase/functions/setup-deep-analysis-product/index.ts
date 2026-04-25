// One-shot setup function for the deep_analysis product:
// - Sets the Stripe tax_code (idempotent)
// - Ensures the price `deep_analysis_one_time` is 399,00 SEK with tax_behavior=exclusive
//   (Stripe doesn't allow editing tax_behavior on an existing price, so we create a new
//   price with the same lookup_key — Stripe transfers the lookup_key automatically and
//   archives the old price.)
// Safe to re-run.
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOOKUP_KEY = "deep_analysis_one_time";
const TARGET_AMOUNT = 39900; // 399,00 SEK
const TARGET_CURRENCY = "sek";
const TARGET_TAX_BEHAVIOR = "exclusive" as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const env: StripeEnv = "sandbox";
    const stripe = createStripeClient(env);

    // 1. Hitta nuvarande pris via lookup_key
    const prices = await stripe.prices.list({ lookup_keys: [LOOKUP_KEY], active: true });
    if (!prices.data.length) {
      return new Response(JSON.stringify({ error: "Price with lookup_key not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const currentPrice = prices.data[0];
    const productId = currentPrice.product as string;

    // 2. Säkerställ rätt tax_code på produkten (Other professional services)
    const updatedProduct = await stripe.products.update(productId, {
      tax_code: "txcd_20030000",
    });

    // 3. Kontrollera om priset redan är korrekt konfigurerat
    const priceIsCorrect =
      currentPrice.unit_amount === TARGET_AMOUNT &&
      currentPrice.currency === TARGET_CURRENCY &&
      currentPrice.tax_behavior === TARGET_TAX_BEHAVIOR;

    let newPriceId = currentPrice.id;
    let priceAction: "kept" | "replaced" = "kept";

    if (!priceIsCorrect) {
      // 4. Skapa nytt pris med rätt tax_behavior. Genom att sätta samma lookup_key
      // med transfer_lookup_key=true flyttar Stripe automatiskt lookup-nyckeln hit
      // och frikopplar den gamla.
      const newPrice = await stripe.prices.create({
        product: productId,
        unit_amount: TARGET_AMOUNT,
        currency: TARGET_CURRENCY,
        tax_behavior: TARGET_TAX_BEHAVIOR,
        lookup_key: LOOKUP_KEY,
        transfer_lookup_key: true,
      });

      // 5. Arkivera det gamla priset så det inte används av misstag
      await stripe.prices.update(currentPrice.id, { active: false });

      newPriceId = newPrice.id;
      priceAction = "replaced";
    }

    return new Response(
      JSON.stringify({
        success: true,
        productId,
        tax_code: updatedProduct.tax_code,
        priceAction,
        priceId: newPriceId,
        unit_amount: TARGET_AMOUNT,
        currency: TARGET_CURRENCY,
        tax_behavior: TARGET_TAX_BEHAVIOR,
        previousPrice: priceAction === "replaced"
          ? {
              id: currentPrice.id,
              unit_amount: currentPrice.unit_amount,
              currency: currentPrice.currency,
              tax_behavior: currentPrice.tax_behavior,
            }
          : null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("setup-deep-analysis-product error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
