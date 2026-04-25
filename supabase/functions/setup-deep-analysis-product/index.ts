// One-shot setup function: sets the Stripe tax_code on the deep_analysis product.
// Call once via curl to apply. Safe to re-run (idempotent).
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const env: StripeEnv = "sandbox";
    const stripe = createStripeClient(env);

    // Find product by lookup of price's product
    const prices = await stripe.prices.list({ lookup_keys: ["deep_analysis_one_time"] });
    if (!prices.data.length) {
      return new Response(JSON.stringify({ error: "Product price not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const productId = prices.data[0].product as string;

    // txcd_20030000 = Other professional services (consulting/analysis report)
    const updated = await stripe.products.update(productId, {
      tax_code: "txcd_20030000",
    });

    return new Response(
      JSON.stringify({ success: true, productId, tax_code: updated.tax_code }),
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
