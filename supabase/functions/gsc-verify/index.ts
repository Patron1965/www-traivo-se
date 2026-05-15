// Google Search Console verification helper.
// Proxies three actions through the connector gateway:
//   POST { action: "token" }     -> returns meta-tag token
//   POST { action: "verify" }    -> tells Google to verify META on https://traivo.se/
//   POST { action: "add-site" }  -> adds the verified site to Search Console

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_IDENTIFIER = "https://traivo.se/";
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

function gatewayHeaders() {
  const lovable = Deno.env.get("LOVABLE_API_KEY");
  const gsc = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!lovable) throw new Error("LOVABLE_API_KEY saknas");
  if (!gsc) throw new Error("GOOGLE_SEARCH_CONSOLE_API_KEY saknas (koppla Google Search Console-connectorn)");
  return {
    Authorization: `Bearer ${lovable}`,
    "X-Connection-Api-Key": gsc,
    "Content-Type": "application/json",
  };
}

async function getToken() {
  const r = await fetch(`${GATEWAY}/siteVerification/v1/token`, {
    method: "POST",
    headers: gatewayHeaders(),
    body: JSON.stringify({
      site: { identifier: SITE_IDENTIFIER, type: "SITE" },
      verificationMethod: "META",
    }),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`token ${r.status}: ${text}`);
  return JSON.parse(text);
}

async function verify() {
  const r = await fetch(
    `${GATEWAY}/siteVerification/v1/webResource?verificationMethod=META`,
    {
      method: "POST",
      headers: gatewayHeaders(),
      body: JSON.stringify({
        site: { identifier: SITE_IDENTIFIER, type: "SITE" },
      }),
    },
  );
  const text = await r.text();
  if (!r.ok) throw new Error(`verify ${r.status}: ${text}`);
  return text ? JSON.parse(text) : { ok: true };
}

async function addSite() {
  const encoded = encodeURIComponent(SITE_IDENTIFIER);
  const r = await fetch(`${GATEWAY}/webmasters/v3/sites/${encoded}`, {
    method: "PUT",
    headers: gatewayHeaders(),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`add-site ${r.status}: ${text}`);
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = String(body?.action ?? "");
    let result: unknown;
    if (action === "token") result = await getToken();
    else if (action === "verify") result = await verify();
    else if (action === "add-site") result = await addSite();
    else throw new Error("Okänd action. Använd 'token', 'verify' eller 'add-site'.");

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
