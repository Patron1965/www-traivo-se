// Public read-only domain status checker for traivo.se
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const EXPECTED_IP = "185.158.133.1";

type DerivedStatus = "Active" | "Verifying" | "Failed" | "Offline" | "Unknown";

interface DomainResult {
  domain: string;
  a_records: string[];
  expected_ip_found: boolean;
  txt_verify_found: boolean;
  txt_verify_value: string | null;
  txt_records: string[];
  txt_record_name: string;
  https_ok: boolean;
  http_status: number | null;
  ssl_ok: boolean;
  error: string | null;
  derived_status: DerivedStatus;
  checked_at: string;
}

async function dnsQuery(name: string, type: "A" | "TXT") {
  try {
    const r = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`,
      { headers: { accept: "application/dns-json" } },
    );
    if (!r.ok) return [];
    const j = await r.json();
    return (j.Answer ?? []).map((a: { data: string }) => a.data);
  } catch {
    return [];
  }
}

async function checkHttps(domain: string): Promise<{
  ok: boolean;
  status: number | null;
  ssl_ok: boolean;
  error: string | null;
}> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`https://${domain}`, {
      method: "GET",
      redirect: "manual",
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    // Cloudflare 1001 returns HTTP 530
    const ssl_ok = true; // fetch succeeded over TLS
    const ok = r.status >= 200 && r.status < 500 && r.status !== 530;
    return { ok, status: r.status, ssl_ok, error: null };
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error ? e.message : String(e);
    const ssl_ok = !/certificate|tls|ssl/i.test(msg);
    return { ok: false, status: null, ssl_ok, error: msg };
  }
}

function deriveStatus(d: Omit<DomainResult, "derived_status" | "checked_at">): DerivedStatus {
  if (d.a_records.length === 0) return "Unknown";
  if (!d.expected_ip_found) return "Offline";
  if (!d.txt_verify_found) return "Verifying";
  if (!d.https_ok) {
    if (!d.ssl_ok) return "Failed";
    if (d.http_status === 530 || d.http_status === null) return "Verifying";
    return "Failed";
  }
  return "Active";
}

async function checkDomain(domain: string): Promise<DomainResult> {
  const [aRecords, txtRecords, https] = await Promise.all([
    dnsQuery(domain, "A"),
    dnsQuery(`_lovable.${domain}`, "TXT"),
    checkHttps(domain),
  ]);

  const cleanedTxt = txtRecords.map((t) => t.replace(/^"|"$/g, ""));
  const expected_ip_found = aRecords.includes(EXPECTED_IP);
  const txt_verify_found = cleanedTxt.some((t) => t.includes("lovable_verify="));

  const partial = {
    domain,
    a_records: aRecords,
    expected_ip_found,
    txt_verify_found,
    txt_records: cleanedTxt,
    https_ok: https.ok,
    http_status: https.status,
    ssl_ok: https.ssl_ok,
    error: https.error,
  };

  return {
    ...partial,
    derived_status: deriveStatus(partial),
    checked_at: new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let domain = "traivo.se";
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (typeof body?.domain === "string" && /^[a-z0-9.-]{3,253}$/i.test(body.domain)) {
          domain = body.domain.toLowerCase();
        }
      } catch {
        // ignore
      }
    }

    const targets = [domain, `www.${domain}`];
    const results = await Promise.all(targets.map(checkDomain));

    return new Response(
      JSON.stringify({ results, expected_ip: EXPECTED_IP }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
