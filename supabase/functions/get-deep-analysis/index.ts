// Returns the deep analysis content for an order, given a session_id from Stripe.
// Only returns content if payment_status = 'paid'. The session_id acts as the
// access token (Stripe-generated, hard to guess).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      return new Response(JSON.stringify({ error: "Invalid session_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error } = await supabase
      .from("deep_analyses")
      .select("id, company, contact_name, payment_status, report_status, report_content, generation_error")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) {
      console.error("DB error:", error);
      return new Response(JSON.stringify({ error: "Kunde inte hämta beställning" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!order) {
      return new Response(JSON.stringify({ error: "Beställning hittades inte" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only expose report content if paid
    const responseBody: any = {
      orderId: order.id,
      company: order.company,
      contactName: order.contact_name,
      paymentStatus: order.payment_status,
      reportStatus: order.report_status,
    };

    if (order.payment_status === "paid" && order.report_status === "ready") {
      responseBody.reportContent = order.report_content;
    }

    if (order.report_status === "failed") {
      responseBody.generationError = order.generation_error;
    }

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-deep-analysis error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Okänt fel" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
