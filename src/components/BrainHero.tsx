import { motion } from "framer-motion";
import brainImage from "@/assets/brain-hero.png";

const BrainHero = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow backdrop */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-glow animate-pulse-glow" />
      
      {/* Brain image */}
      <motion.img
        src={brainImage}
        alt="Traivo AI-hjärna"
        width={420}
        height={420}
        className="relative z-10 drop-shadow-[0_0_40px_hsla(180,70%,50%,0.3)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
    </div>
  );
};

export default BrainHero;
