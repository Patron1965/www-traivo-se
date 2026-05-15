import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Send, Loader2, Brain, Lock, RotateCcw, Sparkles,
  Trash2, Building2, Users, MapPin,
  Wrench, Snowflake, Zap, Leaf, Truck, HardHat,
  ShieldCheck, EyeOff, Clock, PhoneOff, Database, FileText,
  Globe, X,
} from "lucide-react";

import { useT, useLang } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";

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
  siteUrl,
  onDelta,
  onDone,
  onError,
  onSiteRead,
}: {
  messages: Msg[];
  language: "sv" | "en";
  siteUrl?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
  onSiteRead?: (status: "ok" | "failed" | "skipped") => void;
}) {
  const resp = await fetch(BRAIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, language, siteUrl }),
  });

  if (!resp.ok) {
    const fallback = language === "en" ? "Something went wrong" : "Något gick fel";
    const err = await resp.json().catch(() => ({ error: fallback }));
    onError(err.error || fallback);
    return;
  }
  const siteHeader = resp.headers.get("X-Site-Read");
  if (siteHeader === "ok" || siteHeader === "failed" || siteHeader === "skipped") {
    onSiteRead?.(siteHeader);
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
  const [siteUrl, setSiteUrl] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [siteReadStatus, setSiteReadStatus] = useState<"ok" | "failed" | "skipped" | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  
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
        siteUrl: siteUrl.trim() || undefined,
        onSiteRead: (status) => setSiteReadStatus(status),
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
    setError("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    textareaRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <SEO
        path="/hjarna"
        title={t({ sv: "Hjärnan – anonym AI-rådgivare för fältservice", en: "The Brain – anonymous AI advisor for field service" })}
        description={t({ sv: "Beskriv din verksamhet anonymt och få en objektiv rekommendation om vilka delar av Traivo som skulle göra störst skillnad.", en: "Describe your operation anonymously and get an objective recommendation on which parts of Traivo would make the biggest difference." })}
      />
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

            {/* Valfri webbadress för djupare analys */}
            <div className="mt-3">
              {!showUrl ? (
                <button
                  type="button"
                  onClick={() => setShowUrl(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-card/40 text-sm font-medium text-foreground hover:text-primary hover:border-primary/50 hover:bg-card/60 transition-colors"
                >
                  <Globe className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  {t({
                    sv: "+ Lägg till er webbadress för djupare analys (frivilligt)",
                    en: "+ Add your website for a deeper analysis (optional)",
                  })}
                </button>
              ) : (
                <div className="rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm p-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                    <input
                      type="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="https://din-sajt.se"
                      maxLength={500}
                      inputMode="url"
                      autoComplete="url"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                      aria-label={t({ sv: "Webbadress", en: "Website URL" })}
                    />
                    <button
                      type="button"
                      onClick={() => { setShowUrl(false); setSiteUrl(""); setSiteReadStatus(null); }}
                      className="text-muted-foreground/70 hover:text-foreground transition-colors p-1"
                      aria-label={t({ sv: "Ta bort webbadress", en: "Remove URL" })}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground/70 leading-relaxed">
                    {t({
                      sv: "Vi läser publika sidor en gång för att förstå er bättre. Ingenting sparas.",
                      en: "We read public pages once to understand you better. Nothing is stored.",
                    })}
                  </p>
                  {siteReadStatus === "ok" && (
                    <p className="mt-1.5 text-[10px] text-primary">
                      {t({ sv: "✓ Sajten lästes med i analysen.", en: "✓ Your site was included in the analysis." })}
                    </p>
                  )}
                  {siteReadStatus === "failed" && (
                    <p className="mt-1.5 text-[10px] text-amber-500/90">
                      {t({
                        sv: "Kunde inte läsa sajten — svaret bygger bara på din beskrivning.",
                        en: "Couldn't read the site — answer is based only on your description.",
                      })}
                    </p>
                  )}
                </div>
              )}
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
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs px-3 py-1.5 rounded-lg glass-subtle hover:border-primary/30 hover:text-primary transition-all inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {t({ sv: "Ställ en ny fråga", en: "Ask a new question" })}
                      </button>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Anonymity & data protection */}
      <section className="relative px-4 sm:px-6 py-16 bg-noise border-t border-border/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-subtle mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                {t({ sv: "Integritet & dataskydd", en: "Privacy & data protection" })}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              {t({
                sv: "Anonymt på riktigt – inte bara på pappret.",
                en: "Truly anonymous – not just on paper.",
              })}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t({
                sv: "Du ska kunna utforska Hjärnan i lugn och ro, utan att riskera mejlflöde eller säljsamtal i efterhand. Här är exakt vad som händer – och inte händer – när du skriver något.",
                en: "You should be able to explore the Brain calmly, without risking email blasts or sales calls afterwards. Here is exactly what happens – and what doesn't – when you type something.",
              })}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                icon: EyeOff,
                title: { sv: "Inga personuppgifter", en: "No personal data" },
                body: {
                  sv: "Vi frågar aldrig efter namn, e-post, telefon eller företag för att använda Hjärnan. Du är anonym tills du själv väljer att höra av dig.",
                  en: "We never ask for name, email, phone or company to use the Brain. You stay anonymous until you choose to reach out.",
                },
              },
              {
                icon: Database,
                title: { sv: "Det här loggas", en: "What we log" },
                body: {
                  sv: "Endast anonym, aggregerad statistik (t.ex. antal frågor och vilka exempel som klickas) för att förbättra tjänsten. Ingen IP-adress, ingen geolokalisering, inga cookies som identifierar dig.",
                  en: "Only anonymous, aggregated statistics (e.g. number of questions and which examples are clicked) to improve the service. No IP address, no geolocation, no cookies that identify you.",
                },
              },
              {
                icon: FileText,
                title: { sv: "Din text sparas inte", en: "Your text is not stored" },
                body: {
                  sv: "Verksamhetsbeskrivningen skickas till AI-modellen för att svara dig – och slängs sedan. Den lagras inte i någon databas och används inte för att träna modeller.",
                  en: "Your description is sent to the AI model to answer you – and then discarded. It is not stored in any database and is not used to train models.",
                },
              },
              {
                icon: Clock,
                title: { sv: "Ingen lagringstid att oroa sig för", en: "No retention to worry about" },
                body: {
                  sv: "Eftersom inget kopplas till dig finns inget att radera. Stänger du fliken är samtalet borta. Vill du börja om räcker det att ladda om sidan.",
                  en: "Because nothing is linked to you, there is nothing to delete. Close the tab and the conversation is gone. Reload the page to start over.",
                },
              },
              {
                icon: PhoneOff,
                title: { sv: "Inga säljsamtal eller spam", en: "No sales calls or spam" },
                body: {
                  sv: "Vi kan inte ringa dig – vi vet inte vem du är. Du kontaktar oss när du är redo, inte tvärtom.",
                  en: "We can't call you – we don't know who you are. You contact us when you're ready, not the other way around.",
                },
              },
              {
                icon: ShieldCheck,
                title: { sv: "Djupanalys = ditt val", en: "Deep analysis = your choice" },
                body: {
                  sv: "Beställer du en betald djupanalys behöver vi en e-post för att leverera rapporten. Den används bara till det – inget nyhetsbrev, ingen försäljning.",
                  en: "If you order a paid deep analysis we need an email to deliver the report. It is only used for that – no newsletter, no sales outreach.",
                },
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="rounded-xl glass-subtle p-5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-yellow-500" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1.5">
                        {t(item.title)}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(item.body)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[11px] text-muted-foreground/80 text-center mt-6 leading-relaxed"
          >
            {t({
              sv: "Frågor om hur vi hanterar data? Skriv till oss – då först får vi din e-post, och bara den.",
              en: "Questions about how we handle data? Write to us – only then do we get your email, and nothing else.",
            })}
          </motion.p>

          {/* Cookies & tracking policy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mt-12 rounded-xl border border-border/50 bg-background/40 p-6 sm:p-7"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-yellow-500" strokeWidth={2.4} />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">
                {t({ sv: "Cookies & spårning", en: "Cookies & tracking" })}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              {t({
                sv: "Vi vill vara raka: Hjärnan-sidan använder inga marknadsförings- eller analyscookies. Inga tredjepartstjänster (Google Analytics, Meta Pixel, Hotjar eller liknande) körs här. Det finns inget banner-godkännande att klicka bort eftersom det inte finns något att godkänna.",
                en: "Let's be straight: the Brain page uses no marketing or analytics cookies. No third-party services (Google Analytics, Meta Pixel, Hotjar or similar) run here. There is no consent banner to dismiss because there is nothing to consent to.",
              })}
            </p>

            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80 font-semibold mb-1">
                {t({ sv: "Det här lagras tekniskt i din webbläsare", en: "What is technically stored in your browser" })}
              </div>

              {[
                {
                  name: { sv: "Språkval (localStorage)", en: "Language preference (localStorage)" },
                  detail: {
                    sv: "Nyckeln traivo-lang sparar SV eller EN så sajten minns ditt språk. Ingen identifierare, inget skickas till oss.",
                    en: "The key traivo-lang stores SV or EN so the site remembers your language. No identifier, nothing sent to us.",
                  },
                  optOut: {
                    sv: "Avstå: rensa webbplatsdata för traivo.se i webbläsaren.",
                    en: "Opt out: clear site data for traivo.se in your browser.",
                  },
                },
                {
                  name: { sv: "Djupanalys-utkast (sessionStorage)", en: "Deep analysis draft (sessionStorage)" },
                  detail: {
                    sv: "Endast om du själv klickar 'Beställ djupanalys' – då sparas din verksamhetsbeskrivning tillfälligt så kassan kan förfyllas. Försvinner när du stänger fliken.",
                    en: "Only if you click 'Order deep analysis' – your business description is then stored temporarily so checkout can be pre-filled. Disappears when you close the tab.",
                  },
                  optOut: {
                    sv: "Avstå: använd inte djupanalys-knappen, eller stäng fliken.",
                    en: "Opt out: don't use the deep analysis button, or close the tab.",
                  },
                },
                {
                  name: { sv: "Inga andra cookies", en: "No other cookies" },
                  detail: {
                    sv: "Vi sätter inga sessionscookies, inga reklamcookies, ingen fingerprinting. Server-loggar hos vår infrastruktur kan innehålla teknisk metadata för säkerhet men kopplas inte till dig av oss.",
                    en: "We set no session cookies, no advertising cookies, no fingerprinting. Server logs at our infrastructure may contain technical metadata for security but are not linked to you by us.",
                  },
                  optOut: null as { sv: string; en: string } | null,
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/40 bg-background/30 p-3.5"
                >
                  <div className="text-xs font-semibold text-foreground mb-1">
                    {t(row.name)}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {t(row.detail)}
                  </p>
                  {row.optOut && (
                    <p className="text-[11px] text-yellow-500/90 leading-relaxed mt-1.5">
                      {t(row.optOut)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground/70 leading-relaxed mt-5 pt-4 border-t border-border/40">
              {t({
                sv: "Vill du ändå inte lämna några spår alls? Använd webbläsarens privata läge – då rensas både localStorage och sessionStorage automatiskt när du stänger fönstret.",
                en: "Want to leave no trace at all? Use your browser's private mode – both localStorage and sessionStorage are cleared automatically when you close the window.",
              })}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Brain_Page;
