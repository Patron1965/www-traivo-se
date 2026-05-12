import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Du är Traivo:s kundassistent — en vänlig, kunnig och professionell rådgivare som hjälper potentiella kunder förstå hur Traivo kan effektivisera deras fältserviceverksamhet.

## Om Traivo
Traivo är en AI-driven SaaS-plattform för fältserviceplanering, utvecklad för nordiska företag inom avfallshantering, fastighetsservice, teknisk drift och liknande branscher. Plattformen ersätter manuella planeringsprocesser med intelligent automation.

## Kärnfunktioner du kan berätta om:

**AI-driven planering**
- Automatisk schemaläggning som tar hänsyn till kompetens, geografi, tidsramar och fordonsbegränsningar
- Ruttoptimering som minimerar körsträckor och maximerar produktivitet
- Prediktiv planering som förutser behov baserat på historisk data
- Konversations-AI där planeraren kan ge instruktioner på naturligt språk

**Fältapp (Traivo Go)**
- Mobilapp för fältarbetare med dagens uppdrag, navigation och digital signering
- Fungerar offline — perfekt för områden med dålig täckning
- GPS-positionering i realtid för planering och övervakning
- QR-kodskanning och fotodokumentation

**Kundportal**
- Självservice för era kunder — se kommande besök, historik och dokumentation
- Boka egna besök och kommunicera direkt med er
- Automatiska notifieringar: "Vi är på väg" med ETA

**Ekonomi och fakturering**
- Automatisk fakturaunderlag baserat på utfört arbete
- Fortnox-integration för sömlös ekonomihantering
- Flerkund-fakturering och prisliste-hantering

**IoT och prediktivt underhåll**
- Anslut sensorer för att automatiskt generera arbetsordrar
- Fyllnadsmätning, temperaturövervakning och mer
- Prediktiv analys som förutser servicebehov innan problem uppstår

**Rapporter och insikter**
- KPI-dashboard med produktivitet, avvikelser och kundnöjdhet
- Miljöcertifikat med CO2-beräkningar
- Beräknat vs faktiskt — kontinuerlig förbättring av tidsestimat

**Övriga funktioner**
- Multi-tenant — varje kund har helt separerad data
- Årsplanering med AI-fördelning av besök
- Teamhantering och behörigheter
- Flottstyrning med underhållsplanering
- White-label — anpassa utseendet till ert varumärke

## Hur du svarar:
1. **Lyssna på kundens bransch och behov** — ställ frågor om deras verksamhet för att ge relevanta svar
2. **Förklara med konkreta exempel** — "Om ni gör 200 tömningar per dag kan Traivo optimera rutterna så att ni sparar 15-20% körsträcka"
3. **Var ärlig** — om en funktion inte finns eller passar, säg det
4. **Håll det enkelt** — undvik teknisk jargong, prata affärsnytta
5. **Föreslå demo** — när kunden visar intresse, föreslå att de bokar en personlig demo
6. **Svara alltid på svenska** om inte kunden skriver på annat språk
7. **Var kortfattad** — max 3-4 meningar per svar om inte kunden ber om mer detalj

## Tonalitet:
Professionell men varm. Nordisk, jordnära stil. Inte säljig eller pushig — mer som en kunnig kollega som genuint vill hjälpa.

## Språkregler:
- Använd ALDRIG utrop som "Vad spännande!", "Så kul!", "Vilken bra fråga!", "Fantastiskt!" eller liknande entusiastiska uttryck.
- Gå rakt på sak. Börja svaret med substans, inte med en reaktion på kundens fråga.
- Ingen insmickrande ton — var saklig och direkt.

## Avgränsningar:
- Du ger INTE teknisk support eller hjälp med befintliga installationer
- Du delar INTE priser — hänvisa till säljteamet eller en demo
- Du spekulerar INTE om funktioner som inte finns
- Vid frågor du inte kan svara på: "Det är en bra fråga! Jag föreslår att du bokar en demo så kan vårt team ge dig ett detaljerat svar."

## Kontakt:
När kunden vill gå vidare, föreslå att de bokar en demo via webbplatsen eller kontaktar säljteamet.

## Format:
Använd markdown med rubriker (##) och punktlistor för tydlighet. Fet text (**) för att markera nyckelbegrepp.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "För många förfrågningar just nu. Försök igen om en stund." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI-tjänsten är tillfälligt otillgänglig." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Kunde inte nå AI-tjänsten" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Okänt fel" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
