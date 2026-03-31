import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Brain, Lock, RotateCcw, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TRAIVO_KNOWLEDGE = `
Traivo är en planeringsplattform för fältserviceföretag i Norden.

Kärnfunktioner:
- Smart schemaläggning med väderanpassning
- Live-karta med körhistorik
- Ruttplanering som grupperar jobb geografiskt
- Fortnox-koppling: kundsynk, artiklar, fakturering
- Stöd för flera bolag med rollstyrning
- Direktnotiser
- Traivo Go: Mobilapp som fungerar utan internet
- Objektstruktur: Område → Fastighet → Rum
- Abonnemang med automatiska jobb
- Varningar vid avvikelser
- Automatisk fakturering via Fortnox
- Kundportal med bokning, chatt och besökshistorik
- Digital signatur, foton, materialåtgång
- Tidrapportering med löneexport
`;

const getLocalResponse = (business: string): string => {
  const b = business.toLowerCase();

  if (b.includes("avfall") || b.includes("sopor") || b.includes("återvinning") || b.includes("renhållning")) {
    return `## Avfallshantering\n\nDet här är ett område vi kan väldigt väl. Här är hur Traivo löser vanliga utmaningar:\n\n- **Smartare rutter** — Systemet grupperar tömningar i samma område så bilarna kör kortare. Typiskt 20-30% mindre körsträcka.\n- **Väderanpassning** — Vid regn, snö eller storm justeras planeringen automatiskt.\n- **Live-karta** — Se var varje bil befinner sig just nu. Hela körhistoriken sparas för uppföljning.\n- **Återkommande jobb** — Abonnemang schemaläggs automatiskt, inga manuella listor.\n- **Fakturering** — Fakturan skapas direkt i Fortnox när jobbet är klart.\n\nHar du fler specifika frågor om er situation? Beskriv gärna mer.`;
  }

  if (b.includes("vvs") || b.includes("rör") || b.includes("vatten")) {
    return `## VVS & Rörservice\n\nVanliga utmaningar vi löser:\n\n- **Smart planering** — Systemet matchar rätt tekniker till rätt jobb baserat på kompetens och var de befinner sig.\n- **Mindre körning** — Rutterna planeras så teknikerna slipper köra kors och tvärs mellan jobb.\n- **Live-karta** — Se var alla tekniker är just nu. Skicka akutjobb till den som är närmast.\n- **Digitala protokoll** — Checklistor, foton och noteringar direkt från mobilen i fält.\n- **Automatisk fakturering** — Fakturan skapas i Fortnox direkt när jobbet är klart.\n\nBeskriv gärna er specifika situation så kan jag gå djupare.`;
  }

  if (b.includes("städ") || b.includes("rengöring") || b.includes("cleaning")) {
    return `## Städ & Facility\n\nSå hanterar Traivo städbranschens utmaningar:\n\n- **Planering** — Hantera både fasta och tillfälliga uppdrag. Systemet lägger schemat åt dig.\n- **Objektstruktur** — Organisera efter Område → Fastighet → Rum, precis som ni redan tänker.\n- **Tidrapportering** — Personalen checkar in och ut automatiskt. Löneunderlaget är klart direkt.\n- **Kundportal** — Era kunder kan följa utfört arbete i realtid.\n- **Fakturering** — Fakturorna skickas till Fortnox automatiskt.\n\nVilka specifika utmaningar har ni idag?`;
  }

  if (b.includes("el") || b.includes("elektri")) {
    return `## El & Installation\n\nVanliga utmaningar vi löser:\n\n- **Smart planering** — Rätt tekniker på rätt jobb, baserat på behörighet och var de befinner sig.\n- **Akutjobb** — Se direkt vem som är närmast och ledig. Skicka ut med ett klick.\n- **Mobilapp** — Protokoll, foton och materialåtgång fylls i direkt på plats.\n- **Varningar** — Systemet flaggar om något ser konstigt ut, t.ex. ovanligt lång tid på ett jobb.\n- **Fakturering** — Hela kedjan från utfört jobb till faktura i Fortnox.\n\nBerätta mer om er verksamhet så kan jag vara mer specifik.`;
  }

  if (b.includes("snö") || b.includes("plog") || b.includes("vinter")) {
    return `## Snöröjning & Vinterväghållning\n\nEn bransch med extrema krav på snabb respons:\n\n- **Väderanpassning** — Systemet kollar vädret och föreslår bemanning automatiskt.\n- **Live-karta** — Se var alla fordon är just nu. Hela körhistoriken sparas som bevis.\n- **Snabbmobilisering** — Aktivera hela flottan med ett klick när det börjar snöa.\n- **Tidrapportering** — Arbetspass loggas automatiskt.\n- **Kundrapporter** — Visa kunder exakt vad som gjorts, med karta som bevis.\n\nVilka delar är mest relevanta för er?`;
  }

  if (b.includes("fastighet") || b.includes("drift") || b.includes("förvalt")) {
    return `## Fastighetsskötsel & Drift\n\nTraivo hanterar komplexiteten i fastighetsdrift:\n\n- **Objektstruktur** — Organisera efter Område → Fastighet → Rum, precis som ni redan jobbar.\n- **Planering** — Schemalägg tillsyn, underhåll och rondering. Systemet optimerar åt er.\n- **Felanmälan** — Hyresgäster och kunder rapporterar direkt i portalen.\n- **Digitala checklistor** — Varje jobbtyp har sin checklista med foton.\n- **Sensorer** — Koppla på mätare som automatiskt skapar jobb vid behov.\n\nBerätta mer om er specifika situation.`;
  }

  return `## ${business}\n\nBaserat på det du beskriver kan Traivo hjälpa med:\n\n- **Smart planering** — Systemet schemalägger rätt person på rätt jobb baserat på kompetens och plats.\n- **Kortare körsträckor** — Jobben grupperas geografiskt så ni slipper köra i onödan.\n- **Live-karta** — Se var alla befinner sig just nu.\n- **Mobilapp** — Fungerar även utan internet. Protokoll, foton, signatur och materialåtgång.\n- **Automatisk fakturering** — Fakturan skapas i Fortnox direkt när jobbet är klart.\n- **Väderanpassning** — Planeringen justeras automatiskt efter vädret.\n\nTraivo är byggt för nordiska fältserviceföretag. Beskriv gärna mer om era specifika utmaningar.`;
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

      {/* Privacy icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center mt-4"
      >
        <motion.button
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => setShowPrivacy((v) => !v)}
          className="p-2 rounded-full hover:bg-muted/20 transition-colors cursor-pointer"
          aria-label="Integritetsinformation"
        >
          <Lock className="w-4 h-4 text-yellow-500" />
        </motion.button>
      </motion.div>

      {/* Privacy popover */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 rounded-2xl glass p-5 relative"
          >
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Full integritet – på dina villkor</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hos oss är du helt anonym. Vi sparar aldrig personuppgifter eller det du skriver i verktyget, och vi kommer aldrig att störa dig med säljsamtal eller spam. Vi använder endast anonymiserad data för att optimera hemsidan och nå rätt målgrupp. Vill du gå vidare? Då är det du som kontaktar oss när du är redo.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
