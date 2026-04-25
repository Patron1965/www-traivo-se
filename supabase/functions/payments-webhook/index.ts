import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
  }
  return _supabase;
}

async function triggerReportGeneration(orderId: string) {
  const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-deep-analysis`;
  // Fire-and-forget invocation - we don't await the response
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
    },
    body: JSON.stringify({ orderId }),
  }).catch((e) => console.error("Failed to trigger generate:", e));
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error("No order_id in session metadata", session.id);
    return;
  }

  const sb = getSupabase();
  const { error } = await sb
    .from("deep_analyses")
    .update({
      payment_status: "paid",
      paid_at: new Date().toISOString(),
      amount_paid_cents: session.amount_total ?? null,
      currency: session.currency ?? "sek",
      report_status: "generating",
    })
    .eq("id", orderId)
    .eq("environment", env);

  if (error) {
    console.error("Failed to mark order paid:", error);
    return;
  }

  await triggerReportGeneration(orderId);
}

async function handlePaymentFailed(session: any, env: StripeEnv) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return;
  await getSupabase()
    .from("deep_analyses")
    .update({ payment_status: "failed" })
    .eq("id", orderId)
    .eq("environment", env);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook with invalid env:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);

    switch (event.type) {
      case "checkout.session.completed":
      case "transaction.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "checkout.session.async_payment_failed":
      case "transaction.payment_failed":
        await handlePaymentFailed(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
