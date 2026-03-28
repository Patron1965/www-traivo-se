import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import brainImage from "@/assets/brain-ai.png";
import teamImage from "@/assets/team-silhouettes.png";

const BrainHero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Glow backdrop */}
      <div className="absolute top-0 w-[500px] h-[500px] rounded-full bg-glow animate-pulse-glow" />

      {/* Brain image */}
      <motion.img
        src={brainImage}
        alt="Mänsklig hjärna förstärkt med AI"
        width={380}
        height={380}
        className="relative z-10 drop-shadow-[0_0_40px_hsla(180,70%,50%,0.3)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ animation: "float 6s ease-in-out infinite" }}
      />

      {/* Connecting light streams (SVG) */}
      <motion.svg
        className="relative z-10 -mt-8 w-[400px] h-[60px]"
        viewBox="0 0 400 60"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {/* Light beams from brain down to team */}
        {[60, 120, 200, 280, 340].map((x, i) => (
          <motion.line
            key={i}
            x1={200}
            y1={0}
            x2={x}
            y2={60}
            stroke="hsl(180 70% 50% / 0.25)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
          />
        ))}
        {/* Glowing dots at connection points */}
        {[60, 120, 200, 280, 340].map((x, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={x}
            cy={58}
            r={2.5}
            fill="hsl(180 70% 50% / 0.6)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.1 }}
          />
        ))}
      </motion.svg>

      {/* Team silhouettes */}
      <motion.img
        src={teamImage}
        alt="Erfaret fältserviceteam"
        width={400}
        height={200}
        className="relative z-10 -mt-4 drop-shadow-[0_0_20px_hsla(180,70%,50%,0.15)] opacity-80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      />

      {/* Speech bubble with arrow */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="absolute right-[-260px] top-[30%] -translate-y-1/2 z-20 hidden lg:block"
      >
        <svg
          className="absolute left-[-60px] top-1/2 -translate-y-1/2"
          width="60"
          height="40"
          viewBox="0 0 60 40"
          fill="none"
        >
          <path
            d="M0 20 Q15 5, 30 12 T55 20"
            stroke="hsl(180 70% 50% / 0.5)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
          />
          <polygon
            points="50,16 58,20 50,24"
            fill="hsl(180 70% 50% / 0.5)"
          />
        </svg>

        <div className="w-[240px] rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md p-4 shadow-lg shadow-primary/5">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Det du gör här loggas inte och leder inte till säljsamtal.
              <span className="text-foreground/80 font-medium"> Du hör av dig till oss — om och när du vill.</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile version below */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="relative z-20 mt-4 lg:hidden"
      >
        <div className="w-[280px] rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md p-3 shadow-lg shadow-primary/5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Det du gör här loggas inte och leder inte till säljsamtal.
              <span className="text-foreground/80 font-medium"> Du hör av dig till oss — om och när du vill.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrainHero;
