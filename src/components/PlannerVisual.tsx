import { motion } from "framer-motion";
import { MapPin, Calendar, Route } from "lucide-react";

/**
 * Levande visualisering för Traivo One.
 * Symboliserar planering, ruttoptimering och realtid:
 * - Veckorutnät med "jobbblock" som lägger sig på plats
 * - Karta med noder som kopplas ihop av en optimerad rutt
 * - Pulserande positioner i realtid
 */
const PlannerVisual = () => {
  // Jobb i veckorutnätet
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

  // Noder på "kartan"
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

  // Skapa en "rutt" mellan noder
  const routePath = nodes
    .map((n, i) => `${i === 0 ? "M" : "L"} ${n.x} ${n.y}`)
    .join(" ");

  return (
    <div className="relative w-full aspect-[4/3] max-w-[520px]">
      {/* Bakgrundsglow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 blur-2xl" />

      {/* Karta-panel (bakre) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 right-0 w-[68%] aspect-square glass-subtle rounded-2xl overflow-hidden border border-border/50"
      >
        {/* Subtil rutnätsbakgrund */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--border)/0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)/0.4) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Header */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
            Live ruttoptimering
          </span>
        </div>

        {/* SVG karta */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {/* Animerad rutt */}
          <motion.path
            d={routePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeDasharray="2 1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
          />

          {/* Noder */}
          {nodes.map((n, i) => (
            <g key={i}>
              {/* Pulserande ring */}
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="2"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 2.4,
                  delay: 0.8 + i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              {/* Punkt */}
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="1.4"
                fill="hsl(var(--primary))"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              />
            </g>
          ))}

          {/* Rörlig "tekniker"-prick längs rutten */}
          <motion.circle
            r="1.8"
            fill="hsl(var(--accent))"
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

      {/* Veckoplanerare-panel (främre, överlappande) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-0 left-0 w-[62%] glass rounded-2xl p-4 border border-border/60 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-accent" />
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
              Veckoplanering
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] text-muted-foreground">AI</span>
          </div>
        </div>

        {/* Dagar header */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          {["MÅN", "TIS", "ONS", "TOR", "FRE"].map((d) => (
            <div key={d} className="text-[8px] text-center text-muted-foreground font-medium">
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
                      className="h-3 rounded-sm bg-muted/20 border border-border/30"
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
                    }}
                    className={`rounded-sm border ${
                      job.color === "primary"
                        ? "bg-primary/30 border-primary/50"
                        : "bg-accent/30 border-accent/50"
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer-stat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[9px]"
        >
          <div className="flex items-center gap-1 text-muted-foreground">
            <Route className="w-2.5 h-2.5 text-primary" />
            <span>Optimerad</span>
          </div>
          <span className="text-primary font-semibold">−23% restid</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlannerVisual;
