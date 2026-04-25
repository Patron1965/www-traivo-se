import { corsHeaders } from "@supabase/supabase-js/cors";
import { createStripeClient } from "../_shared/stripe.ts";

type StepId =
  | "claim_account"
  | "setup_live_account"
  | "install_app"
  | "provision_live_keys"
  | "readiness_check";

type StepStatus = "completed" | "in_progress" | "not_started" | "action_required";

interface Step {
  id: StepId;
  status: StepStatus;
  detail?: string;
}

const PRODUCT_LOOKUP_ID = "deep_analysis_one_time";

async function probeStripe(env: "sandbox" | "live"): Promise<{
  ok: boolean;
  hasProduct: boolean;
  error?: string;
}> {
  try {
    const stripe = createStripeClient(env);
    // Lightweight probe — list one price to confirm key works
    const prices = await stripe.prices.list({
      lookup_keys: [PRODUCT_LOOKUP_ID],
      limit: 1,
    });
    return { ok: true, hasProduct: prices.data.length > 0 };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, hasProduct: false, error: msg };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const sandboxKey = Deno.env.get("STRIPE_SANDBOX_API_KEY");
    const liveKey = Deno.env.get("STRIPE_LIVE_API_KEY");

    const sandbox = sandboxKey
      ? await probeStripe("sandbox")
      : { ok: false, hasProduct: false, error: "missing key" };

    const live = liveKey
      ? await probeStripe("live")
      : { ok: false, hasProduct: false, error: "missing key" };

    const steps: Step[] = [];

    // Step 1: claim — sandbox API key is configured and works
    steps.push({
      id: "claim_account",
      status: sandbox.ok ? "completed" : "in_progress",
      detail: sandbox.ok
        ? "Sandbox-kontot är anslutet."
        : "Vänta - vi väntar på att sandbox-kontot ska anslutas.",
    });

    // Steps 2–4 use live key as the strongest signal:
    //   - No live key at all => onboarding pågår
    //   - Live key works    => alla tre stegen klara
    const liveReady = !!liveKey && live.ok;

    steps.push({
      id: "setup_live_account",
      status: liveReady
        ? "completed"
        : steps[0].status === "completed"
          ? "in_progress"
          : "not_started",
      detail: liveReady
        ? "Stripe-aktivering inskickad och godkänd."
        : "Slutför aktiveringen i Stripes dashboard.",
    });

    steps.push({
      id: "install_app",
      status: liveReady
        ? "completed"
        : liveKey
          ? "in_progress"
          : "not_started",
      detail: liveReady
        ? "Lovable-appen är installerad på live-kontot."
        : "Installera Lovable-appen på ditt live-konto i Stripe.",
    });

    steps.push({
      id: "provision_live_keys",
      status: liveReady ? "completed" : liveKey ? "in_progress" : "not_started",
      detail: liveReady
        ? "Live API-nycklar är aktiva."
        : "Sker automatiskt när appen är installerad.",
    });

    // Step 5: readiness — live works AND product exists in live
    steps.push({
      id: "readiness_check",
      status: liveReady && live.hasProduct
        ? "completed"
        : liveReady
          ? "action_required"
          : "not_started",
      detail:
        liveReady && live.hasProduct
          ? "Allt är redo - betalningar är live på traivo.se."
          : liveReady
            ? "Live-nycklarna funkar men produkten saknas på live-kontot. Kör readiness-check i Payments-fliken."
            : "Låses upp när tidigare steg är klara.",
    });

    const allCompleted = steps.every((s) => s.status === "completed");

    return new Response(
      JSON.stringify({
        steps,
        all_completed: allCompleted,
        environment: liveReady ? "live" : "sandbox",
        checked_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({ error: msg }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
