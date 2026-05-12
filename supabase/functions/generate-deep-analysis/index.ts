// Generates the deep analysis report (Markdown) using Lovable AI, then stores it
// alongside the order. The PDF is rendered client-side from the markdown content
// when the user lands on the thank-you page.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Du är Traivos seniora analytiker. Du levererar en utförlig, ärlig och konkret djupanalys (3-5 sidor) av en verksamhet baserat på kundens beskrivning. Tonalitet: nordisk, saklig, jordnära, aldrig säljig. Använd ALLTID svenska om kunden inte uttryckligen skriver på annat språk.

## Förbjudet språk
Använd ALDRIG följande ord eller fraser - de signalerar säljsnack och förstör trovärdigheten:
- "revolutionerande", "transformera", "next-gen", "game changer", "best-in-class"
- "AI-driven framtid", "digital resa", "synergier", "ekosystem"
- "Vad spännande!", "Fantastiskt!", "Vilken intressant verksamhet!"
- Tomma superlativ utan substans ("otroligt kraftfull", "sömlös upplevelse")

Om du fastnar i floskler - skriv om meningen så den beskriver vad som faktiskt händer i deras vardag.

## Plattformens delar att referera till

**Traivo One** (webb, för planerare och arbetsledare)
- Drag-and-drop veckoplanering
- AI-autoschemaläggning (kompetens, geografi, arbetstid, fordon)
- Ruttoptimering med riktiga vägavstånd
- Live GPS-karta och störningshantering
- Kund- och objektregister med karta + serviceområden
- Kundportal med automatiska SMS
- AI-assistent och prediktivt underhåll (IoT)
- Fakturering, Fortnox-export, white-label

**Traivo Go** (mobil, för tekniker i fält)
- Dagens uppdrag med ett-tryck navigation
- Digitala protokoll, foto, signatur, materiallogg
- In-/utcheckning och löneunderlag
- Offline-first - synkar när nätet kommer tillbaka
- Push-notiser och meddelanden

## Format

Producera EXAKT denna struktur i markdown. ALLA 9 numrerade rubriker måste finnas, i ordning. Skriv djupgående, konkret och baserat på vad kunden faktiskt beskrivit. Antaganden ska vara explicita.

# Djupanalys för {Företag}
*Levererad av Traivo - {dagens datum}*

## 1. Sammanfattning
3-5 meningar: kärnproblem, vår bedömning, vad vi rekommenderar.

## 2. Vad vi förstår om er verksamhet
4-6 meningar som speglar tillbaka deras verksamhet konkret. Visa att ni läst noggrant. Lyft tekniker, fordon, geografi, kundtyp, nuvarande verktyg. Om webbplatsen lästes - referera explicit till tjänster och segment de själva lyfter fram.

## 3. Risker och flaskhalsar
Punktlista med 4-6 specifika risker. För varje:
- **Risk:** kort namn
- **Konsekvens:** vad det kostar dem (tid, pengar, kvalitet, kundnöjdhet)
- **Sannolikhet:** låg/medel/hög baserat på vad de beskrivit

## 4. Möjligheter
4-6 konkreta förbättringsområden. För varje:
- **Möjlighet:** vad
- **Värde:** uppskattad effekt (i tid sparad, fakturerbar tid återvunnen, färre missade jobb, etc.)

## 5. ROI-uppskattning
Räkna ut grovt utifrån de siffror kunden nämnt (antal tekniker, bilar, jobb/vecka). KRAV: visa minst tre konkreta tal (timmar, kr/år, eller %). Visa beräkningen transparent steg-för-steg. Var ärlig med antaganden.

Exempel-struktur (anpassa till deras siffror):
- **Antagande:** X tekniker, Y jobb/vecka, Z tim/vecka manuell planering
- **Idag:** Z tim/vecka × 52 v × planerar-lön = N kr/år
- **Med Traivo:** estimerad besparing M kr/år (motsvarar P% av nuvarande planeringskostnad)
- **Återbetalning:** N månader baserat på Traivos prislista

Om kunden inte gett siffror - använd branschsnitt och säg det rakt ut.

## 6. Rekommenderade Traivo-moduler
Prioriterad lista (viktigast först). Minst 3, max 5 moduler. För varje:
- **Modulnamn**
- Vilket problem den löser för dem specifikt
- Bedömd nytta: hög/medel/låg

## 7. Vad vi INTE löser
Var ärlig. 2-3 saker som Traivo inte adresserar i deras case (t.ex. bokföring, lön, ren CRM-pipeline, konsumentbokning).

## 8. Prioriterad åtgärdsplan
- **Vecka 1 (quick wins):** 2-3 saker som ger omedelbar effekt utan att hela systemet rullas ut
- **30 dagar:** vad som ska vara på plats
- **60 dagar:** nästa steg
- **90 dagar:** full effekt

## 9. Nästa steg
2-3 meningar om hur de tar det vidare med en demo. Inga säljfraser.

---
*Denna analys är genererad av AI baserat på er beskrivning. Den ersätter inte en personlig dialog - boka gärna en demo för djupare diskussion.*`;

function isAuthorized(req: Request): boolean {
  const expected = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!expected) return false;
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) return false;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const got = m[1];
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// SSRF protection: block private/internal IP literals and non-public hosts.
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().trim();
  if (!h) return true;
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".internal") || h.endsWith(".local")) return true;
  // strip brackets for IPv6
  const bare = h.startsWith("[") && h.endsWith("]") ? h.slice(1, -1) : h;
  // IPv6 loopback / link-local / unique-local
  if (bare === "::1" || bare === "::") return true;
  if (bare.startsWith("fe80:") || bare.startsWith("fc") || bare.startsWith("fd")) return true;
  // IPv4 dotted
  const m = bare.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1]), parseInt(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local incl. cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true; // multicast / reserved
  }
  return false;
}

async function scrapeWebsite(url: string): Promise<{ ok: boolean; content: string; note: string }> {
  try {
    let parsed: URL;
    try { parsed = new URL(url); } catch { return { ok: false, content: "", note: "Ogiltig webbadress." }; }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, content: "", note: "Endast http/https stöds." };
    }
    if (isBlockedHost(parsed.hostname)) {
      return { ok: false, content: "", note: "Webbadressen pekar på en intern eller privat värd och kan inte läsas." };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TraivoBot/1.0; +https://traivo.se)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { ok: false, content: "", note: `Webbplatsen svarade med status ${res.status}.` };
    }
    const html = await res.text();
    // Ta bort script/style/noscript
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ");

    // Plocka ut title + meta description
    const titleMatch = cleaned.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descMatch = cleaned.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || cleaned.match(/<meta[^>]+content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const ogDescMatch = cleaned.match(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

    const title = titleMatch?.[1]?.trim() || "";
    const description = descMatch?.[1]?.trim() || ogDescMatch?.[1]?.trim() || "";

    // Plocka ut all synlig text
    const text = cleaned
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

    // Begränsa storleken (~ 8000 tecken text räcker långt för en analys)
    const truncated = text.length > 8000 ? text.slice(0, 8000) + " ...[trunkerat]" : text;

    const parts: string[] = [];
    if (title) parts.push(`Title: ${title}`);
    if (description) parts.push(`Meta description: ${description}`);
    parts.push(`Sidinnehåll:\n${truncated}`);

    return { ok: true, content: parts.join("\n\n"), note: "" };
  } catch (e) {
    return {
      ok: false,
      content: "",
      note: `Kunde inte läsa webbplatsen automatiskt (${e instanceof Error ? e.message : "okänt fel"}). Basera analysen på beskrivningen.`,
    };
  }
}

async function generateReport(
  businessDescription: string,
  quickResponse: string | null,
  company: string,
  websiteUrl: string | null,
  websiteContent: string,
  websiteNote: string,
): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

  const today = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });

  const websiteSection = websiteUrl
    ? (websiteContent
        ? `\nKundens webbplats: ${websiteUrl}\nFöljande innehåll har hämtats automatiskt från sajten - använd det aktivt för att göra analysen mer konkret (referera till tjänster, värdeord, segment de själva lyfter fram):\n---\n${websiteContent}\n---\n`
        : `\nKundens webbplats: ${websiteUrl}\nObs: ${websiteNote}\n`)
    : "";

  const userMessage = `Företag: ${company}
Dagens datum: ${today}
${websiteSection}
Verksamhetsbeskrivning från kunden:
${businessDescription}

${quickResponse ? `\nVår tidigare snabbrekommendation till kunden var:\n${quickResponse}\n\nByg vidare på det och gå djupare.` : ""}

Producera nu den fullständiga djupanalysen enligt mallen.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI gateway error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content in AI response");
  return content;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId || typeof orderId !== "string") {
      return new Response(JSON.stringify({ error: "orderId required" }), {
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
      .select("id, company, business_description, quick_response, website_url, payment_status, report_status")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.payment_status !== "paid") {
      return new Response(JSON.stringify({ error: "Order not paid" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.report_status === "ready") {
      return new Response(JSON.stringify({ success: true, alreadyReady: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Atomic lock: only one caller can transition pending|failed -> generating.
    // Concurrent calls won't both pass this gate, preventing duplicate AI spend.
    const { data: claimed, error: claimErr } = await supabase
      .from("deep_analyses")
      .update({ report_status: "generating" })
      .eq("id", orderId)
      .in("report_status", ["pending", "failed"])
      .select("id");

    if (claimErr) {
      return new Response(JSON.stringify({ error: "Failed to claim order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!claimed || claimed.length === 0) {
      // Already generating (or ready) — let the in-flight run finish.
      return new Response(JSON.stringify({ success: true, alreadyInProgress: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const websiteUrl = (order.website_url as string | null) ?? null;
      const scraped = websiteUrl
        ? await scrapeWebsite(websiteUrl)
        : { ok: false, content: "", note: "Webbplats saknas." };

      const content = await generateReport(
        order.business_description as string,
        order.quick_response as string | null,
        order.company as string,
        websiteUrl,
        scraped.content,
        scraped.note,
      );

      // Strukturkontroll: alla 9 numrerade rubriker måste finnas
      const requiredHeadings = [
        "## 1.", "## 2.", "## 3.", "## 4.", "## 5.",
        "## 6.", "## 7.", "## 8.", "## 9.",
      ];
      const missing = requiredHeadings.filter((h) => !content.includes(h));
      if (missing.length > 0) {
        throw new Error(`Rapporten saknar rubriker: ${missing.join(", ")}`);
      }
      if (content.length < 1500) {
        throw new Error(`Rapporten är för kort (${content.length} tecken, kräver minst 1500)`);
      }

      await supabase
        .from("deep_analyses")
        .update({
          report_content: content,
          report_status: "ready",
          report_generated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (genError) {
      console.error("Generation failed:", genError);
      await supabase
        .from("deep_analyses")
        .update({
          report_status: "failed",
          generation_error: genError instanceof Error ? genError.message : "Unknown error",
        })
        .eq("id", orderId);
      throw genError;
    }
  } catch (e) {
    console.error("generate-deep-analysis error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Okänt fel" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
