import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Send, Loader2, Brain, Lock, RotateCcw, X,
  Trash2, Building2, Users, MapPin, Sparkles,
  Wrench, Snowflake, Zap, Leaf, Truck, HardHat,
} from "lucide-react";
import DeepAnalysisUpsell from "@/components/DeepAnalysisUpsell";

const BRAIN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/brain`;

type Msg = { role: "user" | "assistant"; content: string };

const examples = [
  {
    icon: Trash2,
    label: "Avfall & sanering",
    text: "Vi rengör soptunnor och soprum åt 80 BRF:er i Mälardalen. 8 tekniker, 6 bilar. Akutjobb varje vecka rubbar rutterna och vid sjukdom blir det kaos. Planeringen sker i Excel och dagboken är pappersburen.",
  },
  {
    icon: Building2,
    label: "Fastighetsdrift",
    text: "Vi sköter teknisk fastighetsdrift för 200 fastigheter i Stockholm. Tekniker får jobb via SMS, kvitterar i Excel och felanmälningar kommer in via mejl. Vi tappar tid på dubbelarbete och fakturaunderlagen är ofullständiga.",
  },
  {
    icon: Snowflake,
    label: "Värme & kyla",
    text: "25 servicetekniker som installerar och servar värmepumpar och kylanläggningar i Mellansverige. Mycket körtid mellan jobb, pappersprotokoll skannas på kontoret och garantiärenden är svåra att spåra tillbaka.",
  },
  {
    icon: Wrench,
    label: "VVS-företag",
    text: "Vi är 15 rörmokare som gör både service och nyinstallation. Akutjobb krockar ofta med planerade jobb och vi hinner inte fakturera i tid. Material registreras på papperslappar i bilen.",
  },
  {
    icon: Zap,
    label: "Elinstallation",
    text: "Elfirma med 30 montörer som jobbar mot både privatkund och företag. Vi har problem att hålla koll på vilka jobb som är klara, signaturer från kund och vilka delar som gått åt per jobb.",
  },
  {
    icon: Leaf,
    label: "Mark & trädgård",
    text: "Vi gör grönyteskötsel åt kommuner och fastighetsbolag. 40 personer i fält under sommarhalvåret. Säsongsplanering är ett pussel och vi behöver bevis på utfört arbete för att få betalt.",
  },
  {
    icon: HardHat,
    label: "Bygg & hantverk",
    text: "Byggfirma med 50 hantverkare på flera projekt parallellt. Tidsrapportering sker på papper, ÄTA-arbeten dokumenteras dåligt och projektledarna har svårt att se vilka som är var.",
  },
  {
    icon: Truck,
    label: "Transport & logistik",
    text: "Lokalt åkeri med 20 bilar som kör schemalagda och akuta uppdrag. Vi behöver bättre koll på var bilarna är, digitala körorder och att kunder kan följa leveransen.",
  },
  {
    icon: Users,
    label: "Hemtjänst & vård",
    text: "Privat hemtjänst med 35 medarbetare. Schemaläggning är komplex pga kompetenskrav och kontinuitet hos brukare. Vi vill också få in tidsrapportering och avvikelser digitalt.",
  },
  {
    icon: MapPin,
    label: "Endast fältstöd",
    text: "Vi har bara 3 tekniker men de behöver bättre verktyg i bilen – navigation, checklistor, foto och digitala protokoll. Planeringen funkar redan i ett befintligt system.",
  },
];

async function streamBrain({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(BRAIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Något gick fel" }));
    onError(err.error || "Något gick fel");
    return;
  }

  if (!resp.body) {
    onError("Ingen data mottagen");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  if (buffer.trim()) {
    for (let raw of buffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

const Brain_Page = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [focusAnnouncement, setFocusAnnouncement] = useState("");
  const [justFocused, setJustFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();

  // Scroll to + focus the input when navigated with #brain-input
  useEffect(() => {
    if (location.hash === "#brain-input") {
      // small delay so layout is settled after route change
      const t = setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        textareaRef.current?.focus({ preventScroll: true });
        // Announce to screen readers that the input is now focused
        setFocusAnnouncement(
          "Inmatningsfältet för verksamhetsbeskrivning är nu fokuserat. Börja skriva för att beskriva er verksamhet."
        );
        setJustFocused(true);
        // Clear visual focus highlight after a moment, but keep announcement until next nav
        window.setTimeout(() => setJustFocused(false), 2200);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  const latestResponse = messages.filter((m) => m.role === "assistant").pop();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMsg];

    setMessages(allMessages);
    setIsLoading(true);
    setHasAsked(true);
    setError("");
    setInput("");

    let assistantSoFar = "";

    try {
      await streamBrain({
        messages: allMessages,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
              );
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => setIsLoading(false),
        onError: (msg) => {
          setError(msg);
          setIsLoading(false);
        },
      });
    } catch {
      setError("Kunde inte ansluta. Försök igen.");
      setIsLoading(false);
    }
  };

  const handleExample = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const handleReset = () => {
    setInput("");
    setMessages([]);
    setHasAsked(false);
    setError("");
    textareaRef.current?.focus();
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-noise pt-20 pb-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,100vw)] h-[min(420px,100vw)] rounded-full bg-primary/[0.06] blur-[120px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex max-w-full items-center gap-2 px-3 py-1 rounded-full glass-subtle"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-muted-foreground font-medium">
              Hjärnan · AI-stöd · Anonymt
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl md:text-5xl font-bold leading-[0.95] tracking-tight mb-3"
          >
            Beskriv er verksamhet.<br />
            <span className="text-gradient-ocean">Få ett ärligt råd.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Berätta hur ni jobbar idag – utan att lämna namn, e-post eller företag.
            Hjärnan föreslår vilka delar av Traivo som skulle göra skillnad,
            eller säger ärligt om vi inte är rätt för er.
          </motion.p>
        </div>
      </section>

      {/* Form + response */}
      <section className="relative pb-12 px-4 sm:px-6 pt-4">
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Privacy banner – ovanför textfältet */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-4 rounded-2xl border border-yellow-500/25 bg-yellow-500/[0.04] p-4 relative overflow-hidden"
          >
            {/* Subtil gul glow till vänster */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500/0 via-yellow-500/60 to-yellow-500/0" />

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Ikon-cirkel */}
              <div className="relative flex-shrink-0">
                <span className="absolute inset-0 rounded-full bg-yellow-500/20 blur-md animate-pulse" />
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-yellow-500" strokeWidth={2.5} />
                </div>
              </div>

              {/* Tre punkter – stapel på små skärmar, rad från sm */}
              <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1 sm:grid sm:grid-cols-3 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_hsl(var(--primary))]" />
                  <span className="text-[11px] font-semibold text-foreground">Anonymt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_hsl(var(--primary))]" />
                  <span className="text-[11px] font-semibold text-foreground">Inget sparas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_hsl(var(--primary))]" />
                  <span className="text-[11px] font-semibold text-foreground">Ingen spam</span>
                </div>
              </div>

              {/* Läs-mer toggle */}
              <button
                onClick={() => setShowPrivacy((v) => !v)}
                className="flex-shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors font-semibold"
              >
                {showPrivacy ? "Dölj" : "Läs mer"}
              </button>
            </div>

            {/* Expanderbar förklaring */}
            <AnimatePresence>
              {showPrivacy && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-muted-foreground leading-relaxed mt-4 pt-4 border-t border-yellow-500/15">
                    Vi sparar aldrig det du skriver här. Inga personuppgifter, ingen IP, inget företagsnamn.
                    Du är helt anonym tills du själv väljer att höra av dig.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Input */}
          <motion.form
            ref={formRef}
            id="brain-input"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative scroll-mt-24"
            aria-labelledby="brain-input-label"
            aria-describedby="brain-input-help"
          >
            {/* Visually-hidden label for screen readers */}
            <label htmlFor="brain-input-textarea" id="brain-input-label" className="sr-only">
              Beskriv er verksamhet för Hjärnans AI-rådgivare
            </label>

            {/* Polite live region — announces focus change after hash navigation */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {focusAnnouncement}
            </div>

            <div
              className={`relative rounded-2xl glass glow-teal overflow-hidden transition-all duration-300 focus-within:border-primary/40 ${
                justFocused
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary/60 shadow-[0_0_0_4px_hsl(var(--primary)/0.25)]"
                  : ""
              }`}
            >
              <textarea
                ref={textareaRef}
                id="brain-input-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Vi är ett företag inom… Vi har X tekniker… Vårt största problem är…"
                aria-label="Beskriv er verksamhet för Hjärnans AI-rådgivare"
                aria-describedby="brain-input-help brain-input-counter"
                className="relative w-full bg-transparent px-5 sm:px-6 py-5 pr-16 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none resize-none min-h-[140px] text-base leading-relaxed"
                rows={5}
                maxLength={2000}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label={isLoading ? "Skickar din beskrivning" : "Skicka beskrivning till Hjärnan"}
                className="absolute right-3 bottom-3 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-primary-foreground border border-primary-foreground/20 shadow-[0_0_0_3px_hsl(var(--primary)/0.25),0_4px_14px_hsl(var(--primary)/0.35)] hover:bg-primary/90 hover:scale-[1.05] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Send className="w-5 h-5" strokeWidth={2.5} />
                )}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-muted-foreground/70 px-1">
              <span id="brain-input-help">⌘ + Enter för att skicka</span>
              <span id="brain-input-counter" aria-live="off">
                {input.length}/2000
              </span>
            </div>
          </motion.form>

          {/* Examples */}
          <AnimatePresence>
            {!hasAsked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-3 text-center">
                  Eller välj ett exempel för en träffsäker rekommendation
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {examples.map((ex, i) => (
                    <motion.button
                      key={ex.label}
                      type="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.04 }}
                      onClick={() => handleExample(ex.text)}
                      className="min-w-0 text-left p-3 rounded-xl glass-subtle hover:border-primary/40 hover:bg-primary/[0.03] transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <ex.icon className="w-3.5 h-3.5 text-primary opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0" strokeWidth={2.25} />
                        <span className="min-w-0 text-[10.5px] font-semibold uppercase tracking-wider text-foreground/90 truncate">
                          {ex.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {ex.text}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-2xl glass text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {/* Response */}
          <AnimatePresence>
            {(isLoading || latestResponse) && hasAsked && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div className="rounded-2xl glass p-6 md:p-8 relative overflow-hidden">
                  {/* Subtle accent stripe */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                  {isLoading && !latestResponse ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Brain className="w-5 h-5 animate-pulse text-primary" />
                      <span className="text-sm">Hjärnan analyserar er verksamhet…</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                          Hjärnans rekommendation
                        </span>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-primary prose-headings:font-display prose-p:text-foreground/80 prose-strong:text-primary prose-li:text-foreground/80 prose-blockquote:text-muted-foreground prose-blockquote:border-primary/20">
                        <ReactMarkdown
                          components={{
                            h2: ({ children }) => (
                              <h2 className="text-primary border-b border-primary/20 pb-1 text-base">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => <h3 className="text-primary/80">{children}</h3>,
                          }}
                        >
                          {latestResponse?.content || ""}
                        </ReactMarkdown>
                        {isLoading && (
                          <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5" />
                        )}
                      </div>
                    </>
                  )}

                  {latestResponse && !isLoading && (
                    <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-border/40">
                      <Link
                        to="/traivo-one"
                        className="text-xs px-3 py-1.5 rounded-lg glass-subtle hover:border-primary/30 hover:text-primary transition-all"
                      >
                        Läs om Traivo One →
                      </Link>
                      <Link
                        to="/traivo-go"
                        className="text-xs px-3 py-1.5 rounded-lg glass-subtle hover:border-accent/30 hover:text-accent transition-all"
                      >
                        Läs om Traivo Go →
                      </Link>
                      <Link
                        to="/kontakt"
                        className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                      >
                        Boka demo →
                      </Link>
                    </div>
                  )}
                </div>

                {latestResponse && !isLoading && (
                  <>
                    <DeepAnalysisUpsell
                      businessDescription={messages.filter((m) => m.role === "user").pop()?.content || ""}
                      quickResponse={latestResponse.content}
                    />
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleReset}
                      className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mx-auto"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Beskriv en annan verksamhet
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default Brain_Page;
