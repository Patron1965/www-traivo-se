import { motion } from "framer-motion";
import { MapPin, Check, WifiOff, Navigation } from "lucide-react";

/**
 * Levande visualisering för Traivo Go.
 * Symboliserar fältarbete:
 * - Mobil-mockup med dagens jobblista
 * - Checkmarks som klickas av i takt
 * - Pulserande GPS-pin som visar tekniker i fält
 * - Offline-badge som lyser upp
 */
const FieldVisual = () => {
  const jobs = [
    { time: "08:30", title: "Service – Industri AB", done: true },
    { time: "10:15", title: "Akut – Hisschakt 4B", done: true },
    { time: "12:00", title: "Inspektion – Lager Nord", done: false, active: true },
    { time: "14:30", title: "Underhåll – Värmecentral", done: false },
    { time: "16:00", title: "Avslutning – Kontorsfast.", done: false },
  ];

  return (
    <div className="relative w-full aspect-[4/3] max-w-[520px] flex items-center justify-center">
      {/* Bakgrundsglow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-bl from-accent/5 via-transparent to-primary/5 blur-2xl" />

      {/* Karta i bakgrunden */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-4 rounded-2xl overflow-hidden glass-subtle border border-border/40"
      >
        {/* Vägar/topografi som SVG */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-50">
          {/* Vägar */}
          <path
            d="M 0 30 Q 30 25, 50 40 T 100 50"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          <path
            d="M 0 70 Q 25 60, 45 65 T 100 55"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          <path
            d="M 20 0 Q 25 30, 40 55 T 60 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          <path
            d="M 70 0 Q 75 30, 80 60 T 90 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />

          {/* Animerad rutt-linje */}
          <motion.path
            d="M 15 25 Q 35 35, 50 50 T 85 70"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />

          {/* Stoppunkter */}
          {[
            { x: 15, y: 25 },
            { x: 50, y: 50 },
            { x: 85, y: 70 },
          ].map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.5"
              fill="hsl(var(--accent))"
              opacity="0.8"
            />
          ))}
        </svg>

        {/* GPS-pin med pulserande ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="absolute"
          style={{ top: "48%", left: "48%" }}
        >
          <span className="absolute inset-0 -m-2 rounded-full bg-accent/30 animate-ping" />
          <span className="absolute inset-0 -m-1 rounded-full bg-accent/50" />
          <div className="relative w-3 h-3 rounded-full bg-accent border-2 border-background shadow-lg" />
        </motion.div>

        {/* Offline-badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60"
        >
          <WifiOff className="w-2.5 h-2.5 text-accent" />
          <span className="text-[8px] uppercase tracking-wider text-foreground/80 font-semibold">
            Offline · synkad
          </span>
        </motion.div>
      </motion.div>

      {/* Mobil-mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 w-[58%] max-w-[240px] glass rounded-[28px] border border-border/70 shadow-2xl overflow-hidden"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-background/80 rounded-b-2xl z-20" />

        {/* Status bar */}
        <div className="px-5 pt-2 pb-1 flex items-center justify-between text-[8px] text-muted-foreground">
          <span>09:42</span>
          <span className="flex items-center gap-1">
            <WifiOff className="w-2 h-2" />
            <span>96%</span>
          </span>
        </div>

        {/* App header */}
        <div className="px-4 pt-4 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
              Idag · Tisdag
            </span>
            <Navigation className="w-3 h-3 text-accent" />
          </div>
          <div className="text-sm font-display font-bold">5 stopp</div>
          <div className="text-[9px] text-muted-foreground">2 klara · 3 kvar</div>
        </div>

        {/* Job list */}
        <div className="px-3 py-2 space-y-1.5">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.12 }}
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                job.active
                  ? "bg-accent/15 border-accent/40"
                  : job.done
                  ? "bg-muted/20 border-border/30"
                  : "bg-muted/10 border-border/30"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-4 h-4 rounded-md flex items-center justify-center border ${
                  job.done
                    ? "bg-primary border-primary"
                    : job.active
                    ? "border-accent bg-accent/20"
                    : "border-border bg-transparent"
                }`}
              >
                {job.done && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.2, type: "spring" }}
                  >
                    <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
                  </motion.div>
                )}
                {job.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-muted-foreground font-mono">
                    {job.time}
                  </span>
                  {job.active && (
                    <span className="text-[7px] uppercase tracking-wider text-accent font-bold">
                      Pågår
                    </span>
                  )}
                </div>
                <div
                  className={`text-[9px] font-medium truncate ${
                    job.done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {job.title}
                </div>
              </div>

              {job.active && (
                <MapPin className="flex-shrink-0 w-3 h-3 text-accent animate-pulse" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FieldVisual;
