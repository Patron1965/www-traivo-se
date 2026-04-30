import { motion } from "framer-motion";
import { Users, Brain, Wrench, Sparkles } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const AboutVisual = () => {
  const t = useT();
  const nodes = [
    { id: "planner", icon: Users, label: t({ sv: "Planerare", en: "Planner" }), x: 18, y: 72, color: "primary" },
    { id: "ai", icon: Brain, label: t({ sv: "AI-hjärna", en: "AI brain" }), x: 50, y: 22, color: "accent" },
    { id: "field", icon: Wrench, label: t({ sv: "Tekniker", en: "Technician" }), x: 82, y: 72, color: "primary" },
  ] as const;

  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 0, to: 2 },
  ];

  const events = [
    { t: 0.0, label: t({ sv: "Akutjobb in", en: "Emergency in" }) },
    { t: 0.33, label: t({ sv: "AI omplanerar", en: "AI replans" }) },
    { t: 0.66, label: t({ sv: "Push till bil", en: "Push to vehicle" }) },
  ];

  return (
    <div className="relative w-full aspect-[4/3] max-w-[520px]">
      {/* Bakgrundsglow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-accent/15 blur-3xl" />

      {/* Huvudpanel – nätverket */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 right-0 w-[78%] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_40px_-8px_hsl(var(--primary)/0.4)]"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)",
        }}
      >
        {/* Rutnätsbakgrund */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--primary)/0.16) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)/0.16) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Header */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
          <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">
            Människa + AI
          </span>
        </div>

        {/* SVG-nätverk */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <filter id="about-glow">
              <feGaussianBlur stdDeviation="0.7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Linjer */}
          {edges.map((e, i) => {
            const a = nodes[e.from];
            const b = nodes[e.to];
            return (
              <motion.line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#edge-grad)"
                strokeWidth="0.6"
                strokeDasharray="2 1.5"
                filter="url(#about-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 1.4, delay: 0.6 + i * 0.2, ease: "easeInOut" }}
              />
            );
          })}

          {/* Pulser som färdas längs linjerna */}
          {edges.map((e, i) => {
            const a = nodes[e.from];
            const b = nodes[e.to];
            return (
              <motion.circle
                key={`p-${i}`}
                r="1.4"
                fill="hsl(var(--primary))"
                filter="url(#about-glow)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  cx: [a.x, b.x],
                  cy: [a.y, b.y],
                }}
                transition={{
                  duration: 2.2,
                  delay: 1.6 + i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Nod-cirklar (bakomliggande pulser) */}
          {nodes.map((n, i) => (
            <g key={`n-${i}`}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="5"
                fill="none"
                stroke={n.color === "primary" ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                strokeWidth="0.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{
                  duration: 2.6,
                  delay: 1 + i * 0.25,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
            </g>
          ))}
        </svg>

        {/* Nod-bubblor med ikon (HTML ovanpå SVG för krisp ikon-rendering) */}
        {nodes.map((n, i) => (
          <motion.div
            key={`b-${n.id}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 220, damping: 18 }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div
              className={`flex flex-col items-center gap-1`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                  n.color === "primary"
                    ? "bg-primary/15 border-primary"
                    : "bg-accent/15 border-accent"
                }`}
                style={{
                  boxShadow:
                    n.color === "primary"
                      ? "0 0 14px hsl(var(--primary)/0.5)"
                      : "0 0 14px hsl(var(--accent)/0.5)",
                }}
              >
                <n.icon
                  className={`w-4 h-4 ${
                    n.color === "primary" ? "text-primary" : "text-accent"
                  }`}
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-[9px] uppercase tracking-wider text-foreground font-bold whitespace-nowrap">
                {n.label}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tidslinje-panel (framtill, vänster-nere) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-[58%] rounded-2xl p-4 border-2 border-primary/30 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)]"
        style={{
          background:
            "linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-accent" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">
              Beslutsflöde
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_hsl(var(--primary))]" />
            <span className="text-[9px] text-foreground/80 font-semibold">Live</span>
          </div>
        </div>

        {/* Händelse-lista */}
        <div className="space-y-2">
          {events.map((ev, i) => (
            <motion.div
              key={ev.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.25 }}
              className="flex items-center gap-2"
            >
              <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                <span
                  className={`w-2 h-2 rounded-full ${
                    i === 1 ? "bg-accent" : "bg-primary"
                  }`}
                  style={{
                    boxShadow:
                      i === 1
                        ? "0 0 8px hsl(var(--accent))"
                        : "0 0 8px hsl(var(--primary))",
                  }}
                />
                {i === 1 && (
                  <motion.span
                    className="absolute w-3.5 h-3.5 rounded-full border border-accent"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </div>
              <div className="flex-1 h-px bg-border/60" />
              <span className="text-[10px] text-foreground/85 font-medium">
                {ev.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer-stat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-3 pt-3 border-t border-primary/20 flex items-center justify-between text-[10px]"
        >
          <div className="flex items-center gap-1 text-foreground/80 font-medium">
            <Sparkles className="w-3 h-3 text-primary" strokeWidth={2.5} />
            <span>Människan beslutar</span>
          </div>
          <span className="text-primary font-bold">AI förstärker</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutVisual;
