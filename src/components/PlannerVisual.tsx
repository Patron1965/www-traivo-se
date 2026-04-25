import { motion } from "framer-motion";
import { MapPin, Calendar, Route } from "lucide-react";

/**
 * Levande visualisering för Traivo One.
 * Uppdaterad: skarpare typografi, ljusare ytor, tydligare kontrast.
 */
const PlannerVisual = () => {
  const jobs = [
    { day: 0, slot: 0, w: 1, color: "primary" },
    { day: 0, slot: 2, w: 2, color: "accent" },
    { day: 1, slot: 1, w: 1, color: "primary" },
    { day: 1, slot: 3, w: 1, color: "accent" },
    { day: 2, slot: 0, w: 2, color: "primary" },
    { day: 2, slot: 3, w: 1, color: "accent" },
    { day: 3, slot: 1, w: 1, color: "primary" },
    { day: 3, slot: 2, w: 2, color: "accent" },
    { day: 4, slot: 0, w: 1, color: "primary" },
    { day: 4, slot: 2, w: 1, color: "accent" },
  ];

  const nodes = [
    { x: 12, y: 20 },
    { x: 38, y: 12 },
    { x: 62, y: 28 },
    { x: 82, y: 18 },
    { x: 88, y: 52 },
    { x: 64, y: 70 },
    { x: 36, y: 80 },
    { x: 14, y: 58 },
  ];

  const routePath = nodes
    .map((n, i) => `${i === 0 ? "M" : "L"} ${n.x} ${n.y}`)
    .join(" ");

  return (
    <div className="relative w-full aspect-[4/3] max-w-[520px]">
      {/* Bakgrundsglow – starkare */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-accent/15 blur-3xl" />

      {/* Karta-panel (bakre) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 right-0 w-[68%] aspect-square rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_40px_-8px_hsl(var(--primary)/0.4)]"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)",
        }}
      >
        {/* Tydligare rutnätsbakgrund */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--primary)/0.18) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)/0.18) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Header – större och tydligare */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
          <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">
            Live ruttoptimering
          </span>
        </div>

        {/* SVG karta */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="glow-primary">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animerad rutt – tjockare och ljusare */}
          <motion.path
            d={routePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2.5 1.5"
            filter="url(#glow-primary)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
          />

          {/* Noder */}
          {nodes.map((n, i) => (
            <g key={i}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="2.2"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 2.5, 1], opacity: [0.9, 0, 0.9] }}
                transition={{
                  duration: 2.4,
                  delay: 0.8 + i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="1.8"
                fill="hsl(var(--primary))"
                filter="url(#glow-primary)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              />
            </g>
          ))}

          {/* Rörlig "tekniker"-prick */}
          <motion.circle
            r="2.2"
            fill="hsl(var(--accent))"
            filter="url(#glow-primary)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              begin="3s"
              path={routePath}
            />
          </motion.circle>
        </svg>
      </motion.div>

      {/* Veckoplanerare-panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-0 left-0 w-[62%] rounded-2xl p-4 border-2 border-primary/30 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)]"
        style={{
          background:
            "linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-wider text-foreground font-bold">
              Veckoplanering
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_hsl(var(--primary))]" />
            <span className="text-[9px] text-foreground/80 font-semibold">AI</span>
          </div>
        </div>

        {/* Dagar header – tydligare */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          {["MÅN", "TIS", "ONS", "TOR", "FRE"].map((d) => (
            <div
              key={d}
              className="text-[9px] text-center text-foreground/70 font-bold tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Rutnät med jobb */}
        <div className="relative grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }).map((_, day) => (
            <div key={day} className="flex flex-col gap-1">
              {Array.from({ length: 5 }).map((_, slot) => {
                const job = jobs.find((j) => j.day === day && j.slot === slot);
                if (!job) {
                  return (
                    <div
                      key={slot}
                      className="h-3 rounded-sm bg-muted/30 border border-border/50"
                    />
                  );
                }
                return (
                  <motion.div
                    key={slot}
                    initial={{ opacity: 0, scale: 0.6, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.8 + day * 0.1 + slot * 0.05,
                      type: "spring",
                      stiffness: 200,
                      damping: 18,
                    }}
                    style={{
                      height: `${job.w * 12 + (job.w - 1) * 4}px`,
                      boxShadow:
                        job.color === "primary"
                          ? "0 0 8px hsl(var(--primary)/0.5)"
                          : "0 0 8px hsl(var(--accent)/0.5)",
                    }}
                    className={`rounded-sm border ${
                      job.color === "primary"
                        ? "bg-primary/70 border-primary"
                        : "bg-accent/70 border-accent"
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer-stat – tydligare */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-3 pt-3 border-t border-primary/20 flex items-center justify-between text-[10px]"
        >
          <div className="flex items-center gap-1 text-foreground/80 font-medium">
            <Route className="w-3 h-3 text-primary" strokeWidth={2.5} />
            <span>Optimerad</span>
          </div>
          <span className="text-primary font-bold">−23% restid</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlannerVisual;
