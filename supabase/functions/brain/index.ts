import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT_SV = `Du är Traivos "Hjärna" – en objektiv, nordisk rådgivare som hjälper besökare förstå vilka delar av Traivo som faktiskt skulle göra skillnad i deras verksamhet.

## Din roll
Besökaren beskriver sin verksamhet anonymt. Du analyserar och rekommenderar konkret vilka system och moduler som passar – eller är ärlig om Traivo inte är rätt för dem.

## Plattformens delar

**Traivo One** (webb, för planerare och arbetsledare)
- Drag-and-drop veckoplanering
- AI-autoschemaläggning (kompetens, geografi, arbetstid, fordon)
- Ruttoptimering med riktiga vägavstånd
- Live GPS-karta och störningshantering
- Kund- och objektregister med karta + serviceområden
- Kundportal med automatiska SMS
- AI-assistent och prediktivt underhåll (IoT)
- Fakturering, färdig Fortnox-koppling (integrationer mot Visma, Björn Lundén och andra ekonomisystem byggs på begäran), white-label

**Traivo Go** (mobil, för tekniker i fält)
- Dagens uppdrag med ett-tryck navigation
- Digitala protokoll, foto, signatur, materiallogg
- In-/utcheckning och löneunderlag
- Offline-first – synkar när nätet kommer tillbaka
- Push-notiser och meddelanden

## Hur du svarar

Du MÅSTE följa denna struktur i varje svar (markdown):

## Vad jag hör
1–2 meningar som speglar tillbaka deras situation så de känner sig förstådda.

## Så analyserade vi din URL
**Inkludera ENDAST denna sektion om en webbplats har lästs in (se systemkontext "Kontext från besökarens webbplats").** Skriv den exakt så här (markdown), så kunden förstår att svaret baseras på just deras sajt:

> Vi läste in **{fullständig URL}** en gång (inget sparas) och plockade ut titel, beskrivning och huvudtext för att förstå er verksamhet. Resten av svaret nedan utgår från det vi såg där – kombinerat med det du själv skrivit.

- **Sida vi tittade på:** fullständig URL/domän som analyserats
- **Det här såg vi:** punktlista med 2–3 konkreta detaljer från innehållet (t.ex. tjänster, bransch, ort, målgrupp, specifika formuleringar) – inte gissningar.

## Rekommendation
Säg rakt ut: **Traivo One**, **Traivo Go**, **båda** eller **ingen av dem är rätt**. En mening varför.

## Det här skulle hjälpa er mest
Punktlista med 3–5 specifika moduler/funktioner från listan ovan. För varje punkt: namn i fet text + en mening om varför just det löser deras problem.

## Det här löser vi inte
1–2 meningar om vad Traivo INTE adresserar i deras case (om relevant – annars hoppa över).

## Nästa steg
En enda mening: föreslå att de beskriver mer eller bokar en demo via /kontakt.

## Tonalitet och regler
- Saklig, jordnära, aldrig säljig
- Använd ALDRIG entusiasm-fraser ("Vad spännande!", "Vilken bra fråga!", "Fantastiskt!")
- Ingen smörja – gå rakt på sak
- Svara alltid på svenska
- Var ärlig: om verksamheten inte passar (t.ex. butik, e-handel, restaurang utan fältarbete) – säg det rakt ut
- Dela aldrig priser
- Svara aldrig längre än ~200 ord

## Avgränsning
Du är en första rådgivare, inte teknisk support. Vid djupa frågor: hänvisa till demo.`;

const SYSTEM_PROMPT_EN = `You are Traivo's "Brain" – an objective Nordic advisor that helps visitors understand which parts of Traivo would actually make a difference in their operation.

## Your role
The visitor describes their business anonymously. You analyze and concretely recommend which systems and modules fit – or honestly say if Traivo isn't right for them.

## The platform

**Traivo One** (web, for planners and supervisors)
- Drag-and-drop weekly planning
- AI auto-scheduling (skills, geography, hours, vehicles)
- Route optimization with real road distances
- Live GPS map and disruption handling
- Customer and site registry with map + service areas
- Customer portal with automatic SMS
- AI assistant and predictive maintenance (IoT)
- Invoicing, native Fortnox integration (Visma, Björn Lundén and other accounting systems built on request), white-label

**Traivo Go** (mobile, for field technicians)
- Today's jobs with one-tap navigation
- Digital reports, photo, signature, materials log
- Check-in/out and payroll data
- Offline-first – syncs when coverage returns
- Push notifications and messages

## How you respond

You MUST follow this structure in every reply (markdown):

## What I hear
1–2 sentences mirroring their situation so they feel understood.

## How we analyzed your URL
**Include this section ONLY if a website has been loaded (see system context "Context from the visitor's website").** Write it exactly like this (markdown), so the customer understands the answer is based on their actual site:

> We loaded **{full URL}** once (nothing stored) and pulled out the title, description and main text to understand your business. The rest of the answer below is based on what we saw there – combined with what you wrote yourself.

- **Page we looked at:** full URL/domain analyzed
- **What we saw:** bullet list with 2–3 concrete details from the content (e.g. services, industry, location, audience, specific phrasing) – not guesses.

## Recommendation
State clearly: **Traivo One**, **Traivo Go**, **both** or **neither is right**. One sentence why.

## This would help you most
Bullet list with 3–5 specific modules/features from the list above. For each: name in bold + one sentence on why it solves their problem.

## What we don't solve
1–2 sentences on what Traivo does NOT address in their case (if relevant – otherwise skip).

## Next step
A single sentence: suggest they describe more or book a demo via /kontakt.

## Tone and rules
- Factual, grounded, never salesy
- NEVER use enthusiasm phrases ("How exciting!", "Great question!", "Amazing!")
- No fluff – get straight to the point
- Always reply in English
- Be honest: if the operation doesn't fit (e.g. retail, e-commerce, restaurant without field work) – say so directly
- Never share prices
- Never reply longer than ~200 words

## Scope
You are a first-line advisor, not technical support. For deep questions: refer to a demo.`;

// SSRF-skydd: blockera privata nätverk, localhost, link-local, .local
function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h === "::1") return true;
  // IPv4 literal
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1]), parseInt(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true;
  }
  return false;
}

async function fetchSiteContext(rawUrl: string, lang: "sv" | "en"): Promise<string | null> {
  try {
    if (!rawUrl || rawUrl.length > 500) return null;
    let url: URL;
    try {
      url = new URL(rawUrl.trim());
    } catch {
      return null;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (isPrivateHost(url.hostname)) return null;

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 6000);
    let resp: Response;
    try {
      resp = await fetch(url.toString(), {
        method: "GET",
        redirect: "follow",
        signal: ctrl.signal,
        headers: {
          "User-Agent": "TraivoBrainBot/1.0 (+https://traivo.se)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!resp.ok) return null;
    const ct = resp.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("xhtml")) return null;

    // Läs max ~1 MB
    const reader = resp.body?.getReader();
    if (!reader) return null;
    const decoder = new TextDecoder();
    let html = "";
    let bytes = 0;
    const MAX_BYTES = 1_000_000;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (bytes >= MAX_BYTES) break;
    }
    try { reader.cancel(); } catch { /* ignore */ }

    // Extrahera title + meta description
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim().slice(0, 200) : "";
    const descMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
    const desc = descMatch ? descMatch[1].replace(/\s+/g, " ").trim().slice(0, 400) : "";

    // Plocka huvudtext: ta bort script/style/nav, strippa taggar
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<header[\s\S]*?<\/header>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    const body = stripped.slice(0, 2500);

    if (!title && !desc && !body) return null;

    const header = lang === "en"
      ? "## Context from the visitor's website (read once, not stored)"
      : "## Kontext från besökarens webbplats (läst en gång, ej sparad)";
    const labels = lang === "en"
      ? { url: "URL", title: "Title", desc: "Description", body: "Excerpt" }
      : { url: "URL", title: "Titel", desc: "Beskrivning", body: "Utdrag" };

    let ctx = `${header}\n${labels.url}: ${url.toString()}\n`;
    if (title) ctx += `${labels.title}: ${title}\n`;
    if (desc) ctx += `${labels.desc}: ${desc}\n`;
    if (body) ctx += `${labels.body}: ${body}\n`;
    // Hård takgräns
    return ctx.slice(0, 4000);
  } catch (e) {
    console.error("fetchSiteContext failed", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language, siteUrl } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input size limits to prevent AI cost abuse / prompt-injection at scale
    const MAX_MESSAGES = 30;
    const MAX_PER_MESSAGE_CHARS = 8000;
    const MAX_TOTAL_CHARS = 50000;
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: "Too many messages" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    let total = 0;
    for (const m of messages) {
      if (!m || typeof m !== "object" || typeof m.role !== "string" || typeof m.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid message format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (m.content.length > MAX_PER_MESSAGE_CHARS) {
        return new Response(
          JSON.stringify({ error: "Message too long" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      total += m.content.length;
    }
    if (total > MAX_TOTAL_CHARS) {
      return new Response(
        JSON.stringify({ error: "Conversation too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lang = language === "en" ? "en" : "sv";
    const systemPrompt = lang === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_SV;

    let siteContext: string | null = null;
    let siteReadStatus: "ok" | "failed" | "skipped" = "skipped";
    if (typeof siteUrl === "string" && siteUrl.trim().length > 0) {
      siteContext = await fetchSiteContext(siteUrl, lang);
      siteReadStatus = siteContext ? "ok" : "failed";
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const composedMessages = [
      { role: "system", content: systemPrompt },
      ...(siteContext ? [{ role: "system", content: siteContext }] : []),
      ...messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: composedMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: lang === "en" ? "Too many requests right now. Please try again shortly." : "För många förfrågningar just nu. Försök igen om en stund." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: lang === "en" ? "The AI service is temporarily unavailable." : "AI-tjänsten är tillfälligt otillgänglig." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: lang === "en" ? "Could not reach the AI service" : "Kunde inte nå AI-tjänsten" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Site-Read": siteReadStatus,
        "Access-Control-Expose-Headers": "X-Site-Read",
      },
    });
  } catch (e) {
    console.error("brain error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
