import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Brain, ShieldCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Traivo knowledge for local fallback responses
const TRAIVO_KNOWLEDGE = `
Traivo är en AI-driven fältserviceplattform (SaaS) byggd för nordiska företag, med fokus på avfallshantering och fältservice.

Kärnfunktioner:
- AI-schemaläggning: Väderbaserad kapacitetsplanering med 7-dagars prognos
- GPS-spårning i realtid: Följ resurser live med breadcrumb-historik
- Ruttoptimering: Geografisk klusterplanering med interaktiv kartvy
- Fortnox-integration: OAuth, kundsynk, artikelmappning och automatisk fakturaexport
- Flerföretagsstöd: Varje kund får egen separata miljö med RBAC
- Realtidsnotifieringar: WebSocket-baserade push-notiser
- Traivo Go: Mobilapp för fältpersonal
- Hierarkisk objektstruktur: Område → Fastighet → Rum
- Abonnemangshantering: Återkommande tjänster med automatisk ordergenerering
- Anomaliövervakning: Automatisk detektering av avvikelser

Branscher som gynnas mest: Avfallshantering, fastighetsservice, VVS, el, städ, trädgård, snöröjning, skadedjursbekämpning, hissservice, brandskydd.
`;

const getLocalResponse = (business: string): string => {
  const b = business.toLowerCase();
  
  if (b.includes("avfall") || b.includes("sopor") || b.includes("återvinning") || b.includes("renhållning")) {
    return `## Perfekt matchning för ${business}! 🎯\n\nTraivo är **specialbyggt** för avfallshantering:\n\n- **AI-optimerade rutter** – Spara 20-30% bränsle med smart klusterplanering\n- **Väderbaserad schemaläggning** – Automatisk kapacitetsanpassning vid regn/snö\n- **GPS i realtid** – Följ varje fordon live med breadcrumb-historik\n- **Fortnox-integration** – Automatisk fakturaexport direkt från fältet\n- **Abonnemangshantering** – Automatisera återkommande tömningar\n\n> Helt anonymt. Inga samtal. Inga mail. Utforska i din egen takt.`;
  }
  
  if (b.includes("vvs") || b.includes("rör") || b.includes("vatten")) {
    return `## Traivo för VVS-företag 🔧\n\nSå kan Traivo effektivisera er verksamhet:\n\n- **Smart schemaläggning** – AI planerar jobb baserat på geografi och prioritet\n- **Ruttoptimering** – Minimera körsträckor mellan jobb\n- **Realtidsspårning** – Se var teknikerna är, alltid\n- **Fortnox-synk** – Fakturor skapas automatiskt efter utfört jobb\n- **Mobilapp (Traivo Go)** – Tekniker uppdaterar status och lägger anteckningar direkt\n\n> Helt anonymt. Inga samtal. Utforska fritt.`;
  }

  if (b.includes("städ") || b.includes("rengöring") || b.includes("cleaning")) {
    return `## Traivo för städföretag ✨\n\nOptimera er städverksamhet:\n\n- **Schemaläggning** – AI hanterar återkommande och engångs-uppdrag\n- **Hierarkisk struktur** – Område → Fastighet → Rum, perfekt för era objekt\n- **GPS & tidrapport** – Automatisk dokumentation av utförda jobb\n- **Kundportal** – Era kunder ser status i realtid\n- **Fortnox** – Fakturering på autopilot\n\n> Helt anonymt. Inga samtal. Inga mail.`;
  }

  if (b.includes("el") || b.includes("elektri")) {
    return `## Traivo för elföretag ⚡\n\nEffektivisera fältservicen:\n\n- **AI-planering** – Optimala rutter och scheman för era tekniker\n- **Realtidsspårning** – Följ pågående jobb och resurser live\n- **Mobilapp** – Statusuppdateringar, foton och anteckningar från fältet\n- **Automatisk fakturering** – Fortnox-integration hela vägen\n- **Anomalidetektering** – Få varningar vid avvikelser\n\n> Helt anonymt. Utforska fritt.`;
  }

  return `## Traivo för ${business} 🚀\n\nBaserat på er verksamhet kan Traivo hjälpa med:\n\n- **AI-schemaläggning** – Intelligent planering av fältpersonal och resurser\n- **Ruttoptimering** – Spara tid och bränsle med smart klusterplanering\n- **GPS i realtid** – Full översikt av alla resurser i fält\n- **Fortnox-integration** – Automatisk fakturering och kundsynk\n- **Mobilapp (Traivo Go)** – Era medarbetare uppdaterar direkt från fältet\n- **Väderbaserad planering** – AI anpassar kapacitet efter väderprognoser\n\nTraivo är byggt för nordiska fältserviceföretag och anpassar sig efter era specifika behov.\n\n> Helt anonymt. Inga samtal. Inga mail. Utforska i er egen takt.`;
};

const AIInput = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setHasAsked(true);

    // Simulate brief thinking delay for UX
    await new Promise((r) => setTimeout(r, 1200));
    
    const result = getLocalResponse(input.trim());
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input area */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative"
      >
        <div className="relative rounded-xl border border-border bg-secondary/50 backdrop-blur-sm glow-neural overflow-hidden transition-all focus-within:border-primary/50">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Beskriv din verksamhet... t.ex. 'Vi är ett avfallshanteringsföretag med 12 fordon i Göteborg'"
            className="w-full bg-transparent px-5 py-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none min-h-[80px] font-display text-sm"
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
            className="absolute right-3 bottom-3 p-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.form>

      {/* Anonymous badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-xs"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
        <span>Helt anonymt · Ingen data sparas · Inga samtal</span>
      </motion.div>

      {/* Response */}
      <AnimatePresence>
        {(isLoading || response) && hasAsked && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 glow-neural">
              {isLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Brain className="w-5 h-5 animate-pulse text-primary" />
                  <span className="text-sm">Traivo AI analyserar din verksamhet...</span>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-display prose-p:text-secondary-foreground prose-strong:text-primary prose-li:text-secondary-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-primary/30">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              )}
            </div>

            {response && !isLoading && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  setInput("");
                  setResponse("");
                  setHasAsked(false);
                }}
                className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors mx-auto block"
              >
                Fråga om en annan verksamhet →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInput;
