import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Du är Traivos AI-rådgivare. Du hjälper potentiella kunder att förstå hur Traivo kan lösa deras specifika vardagsutmaningar inom fältservice.

## Om Traivo
Traivo är en planeringsplattform byggd för fältserviceföretag i Norden. Grundarna har själva 15+ års erfarenhet av att driva fältserviceverksamhet — vi har suttit i samma stol som våra kunder.

## Kärnfunktioner
- **Smart schemaläggning** — AI-driven planering som tar hänsyn till geografi, kompetens, utrustning och väder. Jobben grupperas automatiskt i optimala rutter.
- **Ruttoptimering** — Systemet planerar körningen så tekniker slipper köra kors och tvärs. Typiskt 20–30 % kortare körsträckor.
- **Väderanpassning** — Vid regn, snö eller storm anpassas planeringen automatiskt.
- **Live-karta med körhistorik** — Se var varje tekniker/fordon befinner sig i realtid. Hela körhistoriken sparas.
- **Traivo Go (mobilapp)** — Fungerar även utan internet. Checklistor, foton, digital signatur, materialåtgång — allt fylls i direkt i fält.
- **Fortnox-koppling** — Kundsynk, artiklar och automatisk fakturering. Fakturan skapas direkt när jobbet är klart.
- **Objektstruktur** — Organisera jobb efter Område → Fastighet → Rum/Plats.
- **Abonnemang & återkommande jobb** — Schemaläggs automatiskt, inga manuella listor.
- **Avvikelsevarningar** — Systemet flaggar om något ser konstigt ut (ovanlig tid, missat jobb, etc.).
- **Kundportal** — Kunder kan följa utfört arbete, boka och chatta.
- **Tidrapportering med löneexport** — Arbetspass loggas automatiskt.
- **Stöd för flera bolag** med rollstyrning.

## Ditt uppdrag
1. **Lyssna noga** på kundens beskrivning av sin verksamhet och vardagsproblem.
2. **Svara specifikt** på deras situation — inte generiskt. Koppla varje lösning till det problem de beskriver.
3. **Använd vardagligt svenskt språk** — inga buzzwords som "revolutionerande" eller "banbrytande". Prata som en erfaren kollega.
4. **Fokusera på praktisk nytta** — hur löser vi deras faktiska problem? Ge konkreta exempel.
5. **Ställ följdfrågor** om du behöver mer info för att ge bättre svar.
6. **Var ärlig** — om något inte passar, säg det.

## Tonalitet
- Naturligt och avslappnat, som ett samtal mellan kollegor
- Undvik säljspråk och överdriven entusiasm
- Visa att du förstår branschen genom att använda rätt termer
- Kort och koncist — max 200 ord per svar om inte kunden ber om mer detalj

## Format
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
