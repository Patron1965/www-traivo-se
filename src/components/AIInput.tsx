import { useState, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Brain, Lock, RotateCcw, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Msg = { role: "user" | "assistant"; content: string };

const suggestedQuestions = [
  "Vi kör avfallshantering med 15 bilar i Stockholm",
  "Vi rengör soptunnor och soprum men lönsamheten per tekniker är dålig",
  "Vi har problem med akutjobb och omplanering",
  "Kan appen fungera utan internet?",
  "Vi använder Fortnox idag",
];

type Level = "business" | "tech";

const LEVEL_STORAGE_KEY = "traivo-answer-level";

async function streamChat({
  messages,
  level,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  level: Level;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, level }),
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

  // Flush remaining
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

const AIInput = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevelState] = useState<Level>(() => {
    if (typeof window === "undefined") return "business";
    const stored = localStorage.getItem(LEVEL_STORAGE_KEY);
    return stored === "tech" ? "tech" : "business";
  });
  const [levelChanged, setLevelChanged] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const setLevel = (l: Level) => {
    if (l === level) return;
    setLevelState(l);
    localStorage.setItem(LEVEL_STORAGE_KEY, l);
    if (hasAsked) {
      setLevelChanged(true);
      setTimeout(() => setLevelChanged(false), 3500);
    }
  };

  const highlightDemo = (children: React.ReactNode): React.ReactNode => {
    return Array.isArray(children)
      ? children.map((child, i) => {
          if (typeof child === "string") {
            const parts = child.split(/(demo)/gi);
            if (parts.length === 1) return child;
            return parts.map((part, j) =>
              /^demo$/i.test(part) ? (
                <a
                  key={`${i}-${j}`}
                  href="/kontakt"
                  className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  {part}
                </a>
              ) : (
                part
              )
            );
          }
          return child;
        })
      : children;
  };

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
      await streamChat({
        messages: allMessages,
        level,
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

  const handleSuggestion = (q: string) => {
    setInput(q);
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Level selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
      >
        <span className="text-xs text-muted-foreground shrink-0">Anpassa svaren för:</span>
        <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl glass-subtle">
          {([
            { id: "business", label: "Förklara vad ni kan göra för oss" },
            { id: "tech", label: "Jag är IT-van / hänger med inom AI" },
          ] as { id: Level; label: string }[]).map((opt) => {
            const active = level === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLevel(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground border border-transparent hover:text-foreground"
                }`}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {levelChanged && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 text-[11px] text-primary/80"
          >
            Nästa svar anpassas till {level === "tech" ? "IT-van nivå" : "förklarande nivå"}.
          </motion.div>
        )}
      </AnimatePresence>

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
            className="relative w-full bg-transparent px-5 sm:px-6 py-5 pr-16 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none min-h-[100px] text-base leading-relaxed"
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
            aria-label="Skicka"
            className="absolute right-3 bottom-3 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-primary-foreground border border-primary-foreground/20 shadow-[0_0_0_3px_hsl(var(--primary)/0.25),0_4px_14px_hsl(var(--primary)/0.35)] hover:bg-primary/90 hover:scale-[1.05] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
            ) : (
              <Send className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </motion.form>

      {/* Suggested questions */}
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
          <Lock className="w-6 h-6 text-yellow-500" />
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
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Full integritet – på dina villkor
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hos oss är du helt anonym. Vi sparar aldrig personuppgifter eller det du skriver i
                  verktyget, och vi kommer aldrig att störa dig med säljsamtal eller spam. Vi
                  använder endast anonymiserad data för att optimera hemsidan och nå rätt målgrupp.
                  Vill du gå vidare? Då är det du som kontaktar oss när du är redo.
                </p>
              </div>
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
            <div className="rounded-2xl glass p-6 md:p-8">
              {isLoading && !latestResponse ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Brain className="w-5 h-5 animate-pulse text-primary" />
                  <span className="text-sm">Analyserar er verksamhet...</span>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-primary prose-headings:font-display prose-p:text-foreground/75 prose-strong:text-primary prose-li:text-foreground/75 prose-blockquote:text-muted-foreground prose-blockquote:border-primary/20">
                  <ReactMarkdown
                    components={{
                      h2: ({ children }) => <h2 className="text-primary border-b border-primary/20 pb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-primary/80">{children}</h3>,
                      p: ({ children }) => <p>{highlightDemo(children)}</p>,
                      li: ({ children }) => <li>{highlightDemo(children)}</li>,
                    }}
                  >
                    {latestResponse?.content || ""}
                  </ReactMarkdown>
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5" />
                  )}
                </div>
              )}
              {latestResponse && !isLoading && (
                <div className="flex justify-end mt-4">
                  <a
                    href="/kontakt"
                    className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    Boka demo →
                  </a>
                </div>
              )}
            </div>

            {latestResponse && !isLoading && (
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
