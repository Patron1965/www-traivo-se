import { motion } from "framer-motion";
import { MapPin, Check, WifiOff, Navigation } from "lucide-react";

/**
 * Levande visualisering för Traivo Go.
 * Uppdaterad: skarpare typografi, ljusare ytor, tydligare kontrast.
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
      {/* Bakgrundsglow – starkare */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-bl from-accent/15 via-transparent to-primary/15 blur-3xl" />

      {/* Karta i bakgrunden */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-4 rounded-2xl overflow-hidden border-2 border-accent/30 shadow-[0_0_40px_-8px_hsl(var(--accent)/0.4)]"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)",
        }}
      >
        {/* Vägar/topografi – tydligare */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-80">
          <defs>
            <filter id="glow-accent">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 0 30 Q 30 25, 50 40 T 100 50"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <path
            d="M 0 70 Q 25 60, 45 65 T 100 55"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <path
            d="M 20 0 Q 25 30, 40 55 T 60 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <path
            d="M 70 0 Q 75 30, 80 60 T 90 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
            opacity="0.7"
          />

          {/* Animerad rutt – tjockare och ljusare */}
          <motion.path
            d="M 15 25 Q 35 35, 50 50 T 85 70"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="1.2"
            strokeDasharray="2.5 1.5"
            filter="url(#glow-accent)"
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
              r="2"
              fill="hsl(var(--accent))"
              filter="url(#glow-accent)"
            />
          ))}
        </svg>

        {/* GPS-pin */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="absolute"
          style={{ top: "48%", left: "48%" }}
        >
          <span className="absolute inset-0 -m-2 rounded-full bg-accent/40 animate-ping" />
          <span className="absolute inset-0 -m-1 rounded-full bg-accent/60" />
          <div className="relative w-3.5 h-3.5 rounded-full bg-accent border-2 border-background shadow-[0_0_12px_hsl(var(--accent))]" />
        </motion.div>

        {/* Offline-badge – tydligare */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/95 backdrop-blur-sm border-2 border-accent/40 shadow-lg"
        >
          <WifiOff className="w-3 h-3 text-accent" strokeWidth={2.5} />
          <span className="text-[9px] uppercase tracking-wider text-foreground font-bold">
            Offline · synkad
          </span>
        </motion.div>
      </motion.div>

      {/* Mobil-mockup – ljusare och skarpare */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 w-[58%] max-w-[240px] rounded-[28px] border-2 border-accent/40 shadow-[0_25px_60px_-15px_hsl(var(--accent)/0.5),0_0_30px_-10px_hsl(var(--accent)/0.3)] overflow-hidden"
        style={{
          aspectRatio: "9/16",
          background:
            "linear-gradient(160deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-background rounded-b-2xl z-20" />

        {/* Status bar */}
        <div className="px-5 pt-2 pb-1 flex items-center justify-between text-[9px] text-foreground/80 font-semibold">
          <span>09:42</span>
          <span className="flex items-center gap-1">
            <WifiOff className="w-2.5 h-2.5" strokeWidth={2.5} />
            <span>96%</span>
          </span>
        </div>

        {/* App header – tydligare */}
        <div className="px-4 pt-4 pb-3 border-b border-accent/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-foreground/70 font-bold">
              Idag · Tisdag
            </span>
            <Navigation className="w-3.5 h-3.5 text-accent" strokeWidth={2.5} />
          </div>
          <div className="text-base font-display font-bold text-foreground">5 stopp</div>
          <div className="text-[10px] text-foreground/70 font-medium">2 klara · 3 kvar</div>
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
                  ? "bg-accent/25 border-accent shadow-[0_0_10px_hsl(var(--accent)/0.3)]"
                  : job.done
                  ? "bg-muted/30 border-border/50"
                  : "bg-muted/20 border-border/50"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-4 h-4 rounded-md flex items-center justify-center border-2 ${
                  job.done
                    ? "bg-primary border-primary shadow-[0_0_6px_hsl(var(--primary)/0.6)]"
                    : job.active
                    ? "border-accent bg-accent/30"
                    : "border-foreground/30 bg-transparent"
                }`}
              >
                {job.done && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.2, type: "spring" }}
                  >
                    <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3.5} />
                  </motion.div>
                )}
                {job.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </div>

              {/* Text – tydligare */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-foreground/70 font-mono font-semibold">
                    {job.time}
                  </span>
                  {job.active && (
                    <span className="text-[8px] uppercase tracking-wider text-accent font-bold">
                      Pågår
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] font-semibold truncate ${
                    job.done
                      ? "text-foreground/50 line-through"
                      : job.active
                      ? "text-foreground"
                      : "text-foreground/90"
                  }`}
                >
                  {job.title}
                </div>
              </div>

              {job.active && (
                <MapPin className="flex-shrink-0 w-3.5 h-3.5 text-accent animate-pulse" strokeWidth={2.5} />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FieldVisual;
