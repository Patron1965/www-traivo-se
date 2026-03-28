import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Brain, ShieldCheck, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TRAIVO_KNOWLEDGE = `
Traivo är en AI-driven fältserviceplattform (SaaS) byggd för nordiska företag.

Kärnfunktioner:
- AI-schemaläggning: Väderbaserad kapacitetsplanering
- GPS-spårning i realtid med breadcrumb-historik
- Ruttoptimering: Geografisk klusterplanering
- Fortnox-integration: OAuth, kundsynk, artikelmappning, fakturaexport
- Flerföretagsstöd med RBAC
- Realtidsnotifieringar via WebSocket
- Traivo Go: Offline-first mobilapp för fältpersonal
- Hierarkisk objektstruktur: Område → Fastighet → Rum
- Abonnemangshantering med automatisk ordergenerering
- Anomaliövervakning och avvikelsedetektering
- Fakturering med Fortnox-export
- Kundportal med bokning, chatt och besökshistorik
- Digital signatur, fotodokumentation, materiallogg
- Tidsrapportering med löneexport
`;

const getLocalResponse = (business: string): string => {
  const b = business.toLowerCase();

  if (b.includes("avfall") || b.includes("sopor") || b.includes("återvinning") || b.includes("renhållning")) {
    return `## Avfallshantering\n\nDet här är ett område vi kan väldigt väl. Här är hur Traivo adresserar vanliga utmaningar:\n\n- **Ruttoptimering** — Klusterbaserad planering som grupperar tömningar geografiskt. Typiskt 20-30% kortare körsträckor.\n- **Väderbaserad schemaläggning** — AI anpassar kapacitet vid regn, snö och storm automatiskt.\n- **GPS i realtid** — Följ varje fordon live. Breadcrumb-historik för uppföljning.\n- **Abonnemangshantering** — Återkommande tömningar schemaläggs automatiskt.\n- **Fortnox-export** — Fakturor genereras direkt från utförda jobb.\n\nHar du fler specifika frågor om er situation? Beskriv gärna mer.`;
  }

  if (b.includes("vvs") || b.includes("rör") || b.includes("vatten")) {
    return `## VVS & Rörservice\n\nVanliga utmaningar vi löser:\n\n- **Schemaläggning** — AI planerar utifrån kompetens, geografi och prioritet. Rätt tekniker på rätt jobb.\n- **Ruttoptimering** — Minimera körning mellan akutjobb och planerade servicebesök.\n- **Realtidskarta** — Se var teknikerna är. Skicka akutjobb till närmaste lediga.\n- **Protokoll & dokumentation** — Digitala checklistor med foton, direkt från fältet.\n- **Fortnox-synk** — Fakturan skapas automatiskt efter utfört arbete.\n\nBeskriv gärna er specifika situation så kan jag gå djupare.`;
  }

  if (b.includes("städ") || b.includes("rengöring") || b.includes("cleaning")) {
    return `## Städ & Facility\n\nSå hanterar Traivo städbranschens utmaningar:\n\n- **Schemaläggning** — Hantera återkommande och engångsuppdrag med AI.\n- **Hierarkisk struktur** — Område → Fastighet → Rum. Perfekt för era objekt.\n- **Tidrapportering** — Automatisk in-/utcheckning. Löneexport till CSV.\n- **Kundportal** — Era kunder ser utfört arbete i realtid.\n- **Fakturering** — Fortnox-export på autopilot.\n\nVilka specifika utmaningar har ni idag?`;
  }

  if (b.includes("el") || b.includes("elektri")) {
    return `## El & Installation\n\nVanliga utmaningar vi adresserar:\n\n- **AI-planering** — Scheman baserade på teknikerkompetens och geografi.\n- **Akutjobbshantering** — Närmaste lediga tekniker identifieras direkt.\n- **Mobilapp** — Protokoll, foton och materiallogg direkt från fältet.\n- **Anomalidetektering** — Systemet varnar vid avvikelser.\n- **Fakturering** — Fortnox-integration hela kedjan.\n\nBerätta mer om er verksamhet så kan jag vara mer specifik.`;
  }

  if (b.includes("snö") || b.includes("plog") || b.includes("vinter")) {
    return `## Snöröjning & Vinterväghållning\n\nEn bransch med extrema krav på snabb respons:\n\n- **Väderbaserad planering** — AI aktiverar resurser automatiskt baserat på väderprognoser.\n- **GPS & realtidskarta** — Se alla fordon live. Dokumentera utfört arbete med breadcrumbs.\n- **Akutmobilisering** — Aktivera hela flottan med ett klick vid snöfall.\n- **Tidrapportering** — Automatisk logg av arbetspass.\n- **Kundrapportering** — Visa kunder exakt vad som utförts, med kartbevis.\n\nVilka delar är mest relevanta för er?`;
  }

  if (b.includes("fastighet") || b.includes("drift") || b.includes("förvalt")) {
    return `## Fastighetsskötsel & Drift\n\nTraivo hanterar komplexiteten i fastighetsdrift:\n\n- **Hierarkisk objektstruktur** — Område → Fastighet → Rum. Mappar direkt mot era objekt.\n- **Planering** — Schemalägg tillsyn, underhåll och rondering med AI.\n- **Felanmälan & kundportal** — Hyresgäster/kunder rapporterar direkt i portalen.\n- **Protokoll** — Digitala checklistor per jobbtyp med fotodokumentation.\n- **IoT-integration** — Sensorer triggar automatiska arbetsordrar.\n\nBerätta mer om er specifika situation.`;
  }

  return `## ${business}\n\nBaserat på det du beskriver kan Traivo hjälpa med:\n\n- **AI-schemaläggning** — Intelligent planering av fältpersonal baserat på kompetens och geografi.\n- **Ruttoptimering** — Klusterbaserad planering som minskar körsträckor.\n- **GPS-spårning** — Realtidsöversikt av alla resurser i fält.\n- **Mobilapp** — Offline-first. Protokoll, foton, signatur och materiallogg.\n- **Fakturering** — Fortnox-export direkt från utförda jobb.\n- **Väderplanering** — AI anpassar kapacitet efter prognoser.\n\nTraivo är byggt för nordiska fältserviceföretag. Beskriv gärna mer om era specifika utmaningar.`;
};

const suggestedQuestions = [
  "Vi kör avfallshantering med 15 bilar i Stockholm",
  "Hur fungerar ruttoptimeringen?",
  "Vi har problem med akutjobb och omplanering",
  "Kan appen fungera utan internet?",
  "Vi använder Fortnox idag",
];

const AIInput = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setHasAsked(true);

    await new Promise((r) => setTimeout(r, 1200));

    const result = getLocalResponse(input.trim());
    setResponse(result);
    setIsLoading(false);
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    textareaRef.current?.focus();
  };

  const handleReset = () => {
    setInput("");
    setResponse("");
    setHasAsked(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative"
      >
        <div className="relative rounded-2xl glass glow-teal overflow-hidden transition-all focus-within:border-primary/40">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Beskriv er verksamhet eller ställ en fråga..."
            className="w-full bg-transparent px-6 py-5 pr-16 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none min-h-[100px] text-sm leading-relaxed"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-4 bottom-4 p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-20 hover:bg-primary/80 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.form>

      {/* Suggested questions — only before first ask */}
      <AnimatePresence>
        {!hasAsked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {suggestedQuestions.map((q, i) => (
              <motion.button
                key={q}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                onClick={() => handleSuggestion(q)}
                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground glass-subtle hover:text-foreground hover:border-primary/20 transition-all"
              >
                {q}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-2 mt-4 text-muted-foreground/60 text-[11px]"
      >
        <ShieldCheck className="w-3 h-3" />
        <span>Helt anonymt · Ingen data sparas</span>
      </motion.div>

      {/* Response */}
      <AnimatePresence>
        {(isLoading || response) && hasAsked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="rounded-2xl glass p-6 md:p-8">
              {isLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Brain className="w-5 h-5 animate-pulse text-primary" />
                  <span className="text-sm">Analyserar er verksamhet...</span>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-display prose-p:text-foreground/75 prose-strong:text-primary prose-li:text-foreground/75 prose-blockquote:text-muted-foreground prose-blockquote:border-primary/20">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              )}
            </div>

            {response && !isLoading && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleReset}
                className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mx-auto"
              >
                <RotateCcw className="w-3 h-3" />
                Ställ en ny fråga
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInput;
