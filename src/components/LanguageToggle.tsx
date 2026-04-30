import { useLang } from "@/i18n/LanguageContext";

const LanguageToggle = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language / Språk"
      className={`inline-flex items-center rounded-full border border-border bg-card/40 backdrop-blur-sm p-0.5 ${
        compact ? "text-[10px]" : "text-[11px]"
      }`}
    >
      <button
        type="button"
        onClick={() => setLang("sv")}
        aria-pressed={lang === "sv"}
        className={`px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          lang === "sv"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        SV
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
