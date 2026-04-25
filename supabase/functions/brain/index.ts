import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Du är Traivos "Hjärna" – en objektiv, nordisk rådgivare som hjälper besökare förstå vilka delar av Traivo som faktiskt skulle göra skillnad i deras verksamhet.

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
- Fakturering, Fortnox-export, white-label

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
- Svara alltid på svenska om besökaren inte uttryckligen skriver på annat språk
- Var ärlig: om verksamheten inte passar (t.ex. butik, e-handel, restaurang utan fältarbete) – säg det rakt ut
- Dela aldrig priser
- Svara aldrig längre än ~200 ord

## Avgränsning
Du är en första rådgivare, inte teknisk support. Vid djupa frågor: hänvisa till demo.`;

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
    console.error("brain error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Okänt fel" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
