import { createClient } from "npm:@supabase/supabase-js@2";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RequestBody {
  email: string;
  company: string;
  contactName: string;
  orgNumber?: string;
  websiteUrl: string;
  businessDescription: string;
  quickResponse?: string;
  returnUrl: string;
  environment: StripeEnv;
}

function validateBody(body: any): { valid: true; data: RequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== "object") return { valid: false, error: "Invalid body" };

  const email = String(body.email || "").trim();
  const company = String(body.company || "").trim();
  const contactName = String(body.contactName || "").trim();
  const orgNumber = body.orgNumber ? String(body.orgNumber).trim() : undefined;
  let websiteUrl = String(body.websiteUrl || "").trim();
  const businessDescription = String(body.businessDescription || "").trim();
  const quickResponse = body.quickResponse ? String(body.quickResponse) : undefined;
  const returnUrl = String(body.returnUrl || "");
  const environment = body.environment === "live" ? "live" : "sandbox";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { valid: false, error: "Ogiltig e-postadress" };
  if (company.length < 2 || company.length > 200) return { valid: false, error: "Ogiltigt företagsnamn" };
  if (contactName.length < 2 || contactName.length > 200) return { valid: false, error: "Ogiltigt namn" };
  if (orgNumber && orgNumber.length > 50) return { valid: false, error: "Ogiltigt org.nr" };
  if (!websiteUrl) return { valid: false, error: "Webbplats måste anges" };
  if (!/^https?:\/\//i.test(websiteUrl)) websiteUrl = `https://${websiteUrl}`;
  if (!/^https?:\/\/[^\s.]+\.[^\s]+/i.test(websiteUrl) || websiteUrl.length > 500) {
    return { valid: false, error: "Ogiltig webbplats-URL" };
  }
  if (businessDescription.length < 30 || businessDescription.length > 5000) {
    return { valid: false, error: "Verksamhetsbeskrivning måste vara 30-5000 tecken" };
  }
  if (!returnUrl.startsWith("http")) return { valid: false, error: "Ogiltig return URL" };

  return {
    valid: true,
    data: { email, company, contactName, orgNumber, websiteUrl, businessDescription, quickResponse, returnUrl, environment },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const json = await req.json().catch(() => null);
    const validation = validateBody(json);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const body = validation.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Skapa pending deep_analyses-rad
    const { data: order, error: insertError } = await supabase
      .from("deep_analyses")
      .insert({
        email: body.email,
        company: body.company,
        contact_name: body.contactName,
        org_number: body.orgNumber || null,
        website_url: body.websiteUrl,
        business_description: body.businessDescription,
        quick_response: body.quickResponse || null,
        environment: body.environment,
      })
      .select("id")
      .single();

    if (insertError || !order) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Kunde inte spara beställning" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Skapa Stripe Checkout-session
    const stripe = createStripeClient(body.environment);
    const prices = await stripe.prices.list({ lookup_keys: ["deep_analysis_one_time"] });
    if (!prices.data.length) {
      return new Response(JSON.stringify({ error: "Pris hittades inte" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded",
      return_url: `${body.returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: body.email,
      // Stripe räknar ut momsen automatiskt (+0,5%)
      automatic_tax: { enabled: true },
      metadata: {
        order_id: order.id,
        company: body.company,
        contact_name: body.contactName,
        org_number: body.orgNumber || "",
      },
    });

    // 3. Spara session-id på beställningen via service role (bypassar RLS)
    await supabase
      .from("deep_analyses")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret, orderId: order.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("create-deep-analysis-checkout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Okänt fel" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
