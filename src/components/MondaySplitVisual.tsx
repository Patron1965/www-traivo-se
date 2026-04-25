import { motion } from "framer-motion";
import { Phone, AlertTriangle, MessageSquare, MapPin, CheckCircle2, Clock } from "lucide-react";

/**
 * Split-screen visual: kaos (vänster) vs lugn (höger).
 * Stiliserade UI-fragment — ingen "skärmdump", ingen produktbeskrivning.
 * Inga buzzwords. Bara två stämningar.
 */
const MondaySplitVisual = () => {
  return (
    <div className="relative w-full">
      {/* Klocka över split */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-background border border-border shadow-sm">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground" strokeWidth={2.5} />
          <span className="text-[10px] font-mono font-semibold tracking-wider text-foreground">
            MÅN · 06:32
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 rounded-2xl overflow-hidden border border-border bg-card/30">
        {/* ─── VÄNSTER: KAOS ─── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-destructive/[0.04] via-background to-background min-h-[280px] sm:min-h-[340px] overflow-hidden"
        >
          {/* Subtil "skakning" via roterade post-its */}
          <div className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-wider text-destructive/70 font-semibold">
            Utan Traivo
          </div>

          {/* Post-it 1 — sjuk */}
          <motion.div
            initial={{ opacity: 0, y: 8, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ delay: 0.2 }}
            className="absolute top-10 left-3 sm:left-5 w-28 sm:w-32 p-2 sm:p-2.5 bg-yellow-200/90 dark:bg-yellow-200/85 text-gray-900 text-[9px] sm:text-[10px] font-medium leading-tight shadow-md rotate-[-4deg]"
          >
            <div className="font-bold text-[10px] sm:text-[11px] mb-0.5">Erik – sjuk</div>
            <div className="opacity-70">Ringde 06:14</div>
          </motion.div>

          {/* Post-it 2 — akutjobb */}
          <motion.div
            initial={{ opacity: 0, y: 8, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ delay: 0.35 }}
            className="absolute top-14 right-4 sm:right-8 w-28 sm:w-32 p-2 sm:p-2.5 bg-pink-200/90 dark:bg-pink-200/85 text-gray-900 text-[9px] sm:text-[10px] font-medium leading-tight shadow-md rotate-[5deg]"
          >
            <div className="font-bold text-[10px] sm:text-[11px] mb-0.5">AKUT</div>
            <div className="opacity-70">Acme – läcka</div>
          </motion.div>

          {/* Telefon ringer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-20 sm:bottom-24 left-3 sm:left-5 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background border border-destructive/30 shadow-sm"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4 }}
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-destructive" strokeWidth={2.5} />
            </motion.div>
            <span className="text-[9px] sm:text-[10px] font-medium text-foreground/80">
              Kund ringer…
            </span>
          </motion.div>

          {/* Excel-fragment */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="absolute bottom-3 right-3 sm:right-5 w-32 sm:w-36 rounded-sm border border-border/80 bg-background/80 overflow-hidden shadow-sm rotate-[2deg]"
          >
            <div className="grid grid-cols-3 text-[7px] sm:text-[8px] font-mono">
              <div className="bg-muted/60 px-1 py-0.5 border-r border-b border-border/60 text-muted-foreground">A</div>
              <div className="bg-muted/60 px-1 py-0.5 border-r border-b border-border/60 text-muted-foreground">B</div>
              <div className="bg-muted/60 px-1 py-0.5 border-b border-border/60 text-muted-foreground">C</div>
              {[
                ["08:00", "Erik", "?"],
                ["09:30", "Anna", "?"],
                ["11:00", "—", "AKUT"],
                ["13:00", "Sven", "?"],
              ].map((row, i) => (
                <div key={i} className="contents">
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      className={`px-1 py-0.5 border-b border-border/40 ${j < 2 ? "border-r border-border/40" : ""} ${cell === "AKUT" || cell === "?" ? "text-destructive font-semibold" : "text-foreground/70"}`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stress-indikator längst ner */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-destructive/30 to-transparent" />

          {/* Bakgrunds-varning */}
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <AlertTriangle className="w-16 sm:w-20 h-16 sm:h-20 text-destructive/[0.08]" strokeWidth={1} />
          </motion.div>
        </motion.div>

        {/* ─── HÖGER: LUGN ─── */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-primary/[0.05] via-background to-background min-h-[280px] sm:min-h-[340px] overflow-hidden"
        >
          <div className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-wider text-primary/80 font-semibold">
            Med Traivo
          </div>

          {/* Schema-rader, lugna */}
          <div className="mt-7 space-y-2">
            {[
              { time: "08:00", who: "Maria", task: "Service · Solna", done: false },
              { time: "09:30", who: "Johan", task: "Akut · Acme", done: false, accent: true },
              { time: "11:15", who: "Maria", task: "Installation", done: false },
              { time: "13:00", who: "Sven", task: "Rondering", done: false },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border ${
                  row.accent
                    ? "border-primary/30 bg-primary/[0.06]"
                    : "border-border/60 bg-background/40"
                }`}
              >
                <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-muted-foreground tabular-nums">
                  {row.time}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-foreground truncate flex-1">
                  {row.who}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate hidden sm:inline">
                  {row.task}
                </span>
              </motion.div>
            ))}
          </div>

          {/* SMS-bubbla — kund redan informerad */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="absolute bottom-12 sm:bottom-14 left-3 sm:left-5 max-w-[60%] flex items-start gap-1.5"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
              <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" strokeWidth={2.5} />
            </div>
            <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg rounded-tl-sm bg-primary/10 border border-primary/20 text-[9px] sm:text-[10px] leading-tight text-foreground/85">
              "Johan är på väg. Beräknad ankomst 09:18."
            </div>
          </motion.div>

          {/* Karta-pin med ETA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-3 right-3 sm:right-5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border shadow-sm"
          >
            <MapPin className="w-3 h-3 text-primary" strokeWidth={2.5} />
            <span className="text-[9px] sm:text-[10px] font-mono text-foreground/80">2.4 km</span>
            <CheckCircle2 className="w-2.5 h-2.5 text-primary" strokeWidth={2.5} />
          </motion.div>

          {/* Lugn glow längst ner */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </motion.div>
      </div>

      {/* Bildtext under split */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 text-center">
        <p className="text-[10px] sm:text-xs text-muted-foreground/80 leading-snug px-2">
          Två sjukanmälda. Akutläcka. Telefon ringer.
          <br />
          <span className="text-foreground/60">Excel öppen sen 06:14.</span>
        </p>
        <p className="text-[10px] sm:text-xs text-muted-foreground/80 leading-snug px-2">
          Schemat är redan justerat. Kunden vet.
          <br />
          <span className="text-foreground/60">Kaffet är fortfarande varmt.</span>
        </p>
      </div>
    </div>
  );
};

export default MondaySplitVisual;
