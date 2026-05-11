import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Send, Loader2, Brain, Lock, RotateCcw, Sparkles,
  Trash2, Building2, Users, MapPin,
  Wrench, Snowflake, Zap, Leaf, Truck, HardHat,
  ShieldCheck, EyeOff, Clock, PhoneOff, Database, FileText,
} from "lucide-react";
import DeepAnalysisUpsell from "@/components/DeepAnalysisUpsell";
import { useT, useLang } from "@/i18n/LanguageContext";

const BRAIN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/brain`;

type Msg = { role: "user" | "assistant"; content: string };

const examples = [
  {
    icon: Trash2,
    label: { sv: "Avfall & sanering", en: "Waste & sanitation" },
    text: {
      sv: "Vi rengör soptunnor och soprum åt 80 BRF:er i Mälardalen. 8 tekniker, 6 bilar. Akutjobb varje vecka rubbar rutterna och vid sjukdom blir det kaos. Planeringen sker i Excel och dagboken är pappersburen.",
      en: "We clean bins and waste rooms for 80 housing co-ops in central Sweden. 8 technicians, 6 vehicles. Weekly emergencies disrupt routes and any sick day causes chaos. Planning is done in Excel and the daily log is on paper.",
    },
  },
  {
    icon: Building2,
    label: { sv: "Fastighetsdrift", en: "Property operations" },
    text: {
      sv: "Vi sköter teknisk fastighetsdrift för 200 fastigheter i Stockholm. Tekniker får jobb via SMS, kvitterar i Excel och felanmälningar kommer in via mejl. Vi tappar tid på dubbelarbete och fakturaunderlagen är ofullständiga.",
      en: "We handle technical property operations for 200 buildings in Stockholm. Technicians get jobs by SMS, sign off in Excel and fault reports come in by email. We lose time to duplicate work and invoice data is incomplete.",
    },
  },
  {
    icon: Snowflake,
    label: { sv: "Värme & kyla", en: "Heating & cooling" },
    text: {
      sv: "25 servicetekniker som installerar och servar värmepumpar och kylanläggningar i Mellansverige. Mycket körtid mellan jobb, pappersprotokoll skannas på kontoret och garantiärenden är svåra att spåra tillbaka.",
      en: "25 service technicians installing and maintaining heat pumps and cooling systems in central Sweden. A lot of driving between jobs, paper reports are scanned at the office and warranty cases are hard to trace.",
    },
  },
  {
    icon: Wrench,
    label: { sv: "VVS-företag", en: "Plumbing" },
    text: {
      sv: "Vi är 15 rörmokare som gör både service och nyinstallation. Akutjobb krockar ofta med planerade jobb och vi hinner inte fakturera i tid. Material registreras på papperslappar i bilen.",
      en: "We're 15 plumbers doing both service and new installations. Emergencies often collide with planned jobs and we don't manage to invoice on time. Materials are recorded on paper notes in the van.",
    },
  },
  {
    icon: Zap,
    label: { sv: "Elinstallation", en: "Electrical" },
    text: {
      sv: "Elfirma med 30 montörer som jobbar mot både privatkund och företag. Vi har problem att hålla koll på vilka jobb som är klara, signaturer från kund och vilka delar som gått åt per jobb.",
      en: "Electrical company with 30 installers serving both private and business customers. We struggle to track which jobs are done, customer signatures and which parts were used per job.",
    },
  },
  {
    icon: Leaf,
    label: { sv: "Mark & trädgård", en: "Grounds & landscaping" },
    text: {
      sv: "Vi gör grönyteskötsel åt kommuner och fastighetsbolag. 40 personer i fält under sommarhalvåret. Säsongsplanering är ett pussel och vi behöver bevis på utfört arbete för att få betalt.",
      en: "We do grounds maintenance for municipalities and property companies. 40 people in the field during summer. Seasonal planning is a puzzle and we need proof of work to get paid.",
    },
  },
  {
    icon: HardHat,
    label: { sv: "Bygg & hantverk", en: "Construction & trades" },
    text: {
      sv: "Byggfirma med 50 hantverkare på flera projekt parallellt. Tidsrapportering sker på papper, ÄTA-arbeten dokumenteras dåligt och projektledarna har svårt att se vilka som är var.",
      en: "Construction firm with 50 tradespeople across several parallel projects. Time reporting is on paper, change orders are poorly documented and project managers struggle to see who is where.",
    },
  },
  {
    icon: Truck,
    label: { sv: "Transport & logistik", en: "Transport & logistics" },
    text: {
      sv: "Lokalt åkeri med 20 bilar som kör schemalagda och akuta uppdrag. Vi behöver bättre koll på var bilarna är, digitala körorder och att kunder kan följa leveransen.",
      en: "Local haulier with 20 vehicles running scheduled and urgent jobs. We need better visibility on where vehicles are, digital dispatch orders and customer delivery tracking.",
    },
  },
  {
    icon: Users,
    label: { sv: "Hemtjänst & vård", en: "Home care & health" },
    text: {
      sv: "Privat hemtjänst med 35 medarbetare. Schemaläggning är komplex pga kompetenskrav och kontinuitet hos brukare. Vi vill också få in tidsrapportering och avvikelser digitalt.",
      en: "Private home care with 35 staff. Scheduling is complex due to skill requirements and continuity for clients. We also want digital time reporting and incident logging.",
    },
  },
  {
    icon: MapPin,
    label: { sv: "Endast fältstöd", en: "Field support only" },
    text: {
      sv: "Vi har bara 3 tekniker men de behöver bättre verktyg i bilen – navigation, checklistor, foto och digitala protokoll. Planeringen funkar redan i ett befintligt system.",
      en: "We only have 3 technicians but they need better tools in the van – navigation, checklists, photos and digital reports. Planning already works in an existing system.",
    },
  },
];

async function streamBrain({
  messages,
  language,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  language: "sv" | "en";
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
    body: JSON.stringify({ messages, language }),
  });

  if (!resp.ok) {
    const fallback = language === "en" ? "Something went wrong" : "Något gick fel";
    const err = await resp.json().catch(() => ({ error: fallback }));
    onError(err.error || fallback);
    return;
  }

  if (!resp.body) {
    onError(language === "en" ? "No data received" : "Ingen data mottagen");
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
  const t = useT();
  const { lang } = useLang();
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

  useEffect(() => {
    if (location.hash === "#brain-input") {
      const t = setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        textareaRef.current?.focus({ preventScroll: true });
        setFocusAnnouncement(
          lang === "en"
            ? "The business description input is now focused. Start typing to describe your operation."
            : "Inmatningsfältet för verksamhetsbeskrivning är nu fokuserat. Börja skriva för att beskriva er verksamhet."
        );
        setJustFocused(true);
        window.setTimeout(() => setJustFocused(false), 2200);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [location.hash, lang]);

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
        language: lang,
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
      setError(lang === "en" ? "Could not connect. Please try again." : "Kunde inte ansluta. Försök igen.");
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
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-noise pt-20 pb-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
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
              {t({ sv: "Hjärnan · AI-stöd · Anonymt", en: "The Brain · AI assist · Anonymous" })}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl md:text-5xl font-bold leading-[0.95] tracking-tight mb-3"
          >
            {t({ sv: "Beskriv er verksamhet.", en: "Describe your operation." })}<br />
            <span className="text-gradient-ocean">
              {t({ sv: "Få ett ärligt råd.", en: "Get an honest answer." })}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            {t({
              sv: "Berätta hur ni jobbar idag – utan att lämna namn, e-post eller företag. Hjärnan föreslår vilka delar av Traivo som skulle göra skillnad, eller säger ärligt om vi inte är rätt för er.",
              en: "Tell us how you work today – without leaving name, email or company. The Brain suggests which parts of Traivo would make a difference, or honestly says if we're not right for you.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Form + response */}
      <section className="relative pb-12 px-4 sm:px-6 pt-4 flex-1 bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(600px,90vw)] h-[300px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Privacy banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-3 rounded-xl border border-yellow-500/25 bg-yellow-500/[0.04] px-4 py-2.5 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500/0 via-yellow-500/60 to-yellow-500/0" />

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <span className="absolute inset-0 rounded-full bg-yellow-500/20 blur-md animate-pulse" />
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-yellow-500" strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1 sm:grid sm:grid-cols-3 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_hsl(var(--primary))]" />
                  <span className="text-[11px] font-semibold text-foreground">
                    {t({ sv: "Anonymt", en: "Anonymous" })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_hsl(var(--primary))]" />
                  <span className="text-[11px] font-semibold text-foreground">
                    {t({ sv: "Inget sparas", en: "Nothing stored" })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_hsl(var(--primary))]" />
                  <span className="text-[11px] font-semibold text-foreground">
                    {t({ sv: "Ingen spam", en: "No spam" })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPrivacy((v) => !v)}
                className="flex-shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors font-semibold"
              >
                {showPrivacy
                  ? t({ sv: "Dölj", en: "Hide" })
                  : t({ sv: "Läs mer", en: "Read more" })}
              </button>
            </div>

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
                    {t({
                      sv: "Vi sparar aldrig det du skriver här. Inga personuppgifter, ingen IP, inget företagsnamn. Du är helt anonym tills du själv väljer att höra av dig.",
                      en: "We never store what you write here. No personal data, no IP, no company name. You stay completely anonymous until you choose to reach out.",
                    })}
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
            <label htmlFor="brain-input-textarea" id="brain-input-label" className="sr-only">
              {t({
                sv: "Beskriv er verksamhet för Hjärnans AI-rådgivare",
                en: "Describe your operation for the Brain AI advisor",
              })}
            </label>

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
                placeholder={t({
                  sv: "Vi är ett företag inom… Vi har X tekniker… Vårt största problem är…",
                  en: "We're a company in… We have X technicians… Our biggest problem is…",
                })}
                aria-label={t({
                  sv: "Beskriv er verksamhet för Hjärnans AI-rådgivare",
                  en: "Describe your operation for the Brain AI advisor",
                })}
                aria-describedby="brain-input-help brain-input-counter"
                className="relative w-full bg-transparent px-5 sm:px-6 py-4 pr-16 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none resize-none min-h-[110px] text-base leading-relaxed"
                rows={4}
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
                aria-label={isLoading
                  ? t({ sv: "Skickar din beskrivning", en: "Sending your description" })
                  : t({ sv: "Skicka beskrivning till Hjärnan", en: "Send description to the Brain" })}
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
              <span id="brain-input-help">
                {t({ sv: "⌘ + Enter för att skicka", en: "⌘ + Enter to send" })}
              </span>
              <span id="brain-input-counter" aria-live="off">
                {input.length}/2000
              </span>
            </div>
          </motion.form>

          {/* Examples */}
          <AnimatePresence>
            {!hasAsked && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-8"
              >
                <div className="text-center mb-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-medium mb-1.5">
                    {t({ sv: "Snabbstart", en: "Quick start" })}
                  </p>
                  <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
                    {t({
                      sv: "Hitta din bransch — fyller i åt dig",
                      en: "Find your industry — fills in for you",
                    })}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">
                    {t({
                      sv: "Klicka på det område som liknar er verksamhet mest. Texten fylls i ovan så kan du justera den innan du skickar.",
                      en: "Click the area closest to your operation. The text fills in above so you can adjust before sending.",
                    })}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {examples.map((ex, i) => {
                    const label = t(ex.label);
                    const text = t(ex.text);
                    return (
                      <motion.button
                        key={ex.label.sv}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.03 }}
                        onClick={() => handleExample(text)}
                        title={text}
                        className="min-w-0 text-left px-3 py-2.5 rounded-lg glass-subtle hover:border-primary/50 hover:bg-primary/[0.05] hover:-translate-y-0.5 transition-all group flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <ex.icon className="w-3.5 h-3.5 text-primary" strokeWidth={2.25} />
                        </div>
                        <span className="min-w-0 text-xs font-semibold text-foreground/90 leading-tight">
                          {label}
                        </span>
                      </motion.button>
                    );
                  })}
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
                className="mt-5"
              >
                <div className="rounded-2xl glass p-5 md:p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                  {isLoading && !latestResponse ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Brain className="w-5 h-5 animate-pulse text-primary" />
                      <span className="text-sm">
                        {t({
                          sv: "Hjärnan analyserar er verksamhet…",
                          en: "The Brain is analyzing your operation…",
                        })}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                          {t({
                            sv: "Hjärnans rekommendation",
                            en: "Brain's recommendation",
                          })}
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
                        {t({ sv: "Läs om Traivo One →", en: "Read about Traivo One →" })}
                      </Link>
                      <Link
                        to="/traivo-go"
                        className="text-xs px-3 py-1.5 rounded-lg glass-subtle hover:border-accent/30 hover:text-accent transition-all"
                      >
                        {t({ sv: "Läs om Traivo Go →", en: "Read about Traivo Go →" })}
                      </Link>
                      <Link
                        to="/kontakt"
                        className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                      >
                        {t({ sv: "Boka demo →", en: "Book a demo →" })}
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
                      {t({ sv: "Beskriv en annan verksamhet", en: "Describe another operation" })}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Brain_Page;
