import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";

const Footer = () => {
  const t = useT();
  return (
    <footer className="relative border-t border-border bg-noise">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display font-bold text-2xl text-gradient-ocean">traivo</span>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-[240px]">
              {t({
                sv: "AI-driven fältserviceplattform byggd för nordiska villkor.",
                en: "AI-driven field service platform built for Nordic conditions.",
              })}
            </p>
            <div className="flex gap-3 mt-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
              <span className="text-xs text-muted-foreground">
                {t({ sv: "System online", en: "System online" })}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t({ sv: "Plattform", en: "Platform" })}
            </h4>
            <div className="space-y-3 text-sm">
              <Link to="/traivo-one" className="block text-foreground/70 hover:text-primary transition-colors">Traivo One</Link>
              <Link to="/traivo-go" className="block text-foreground/70 hover:text-primary transition-colors">Traivo Go</Link>
              <Link to="/priser" className="block text-foreground/70 hover:text-primary transition-colors">
                {t({ sv: "Priser", en: "Pricing" })}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t({ sv: "Företag", en: "Company" })}
            </h4>
            <div className="space-y-3 text-sm">
              <Link to="/om-oss" className="block text-foreground/70 hover:text-primary transition-colors">
                {t({ sv: "Om oss", en: "About us" })}
              </Link>
              <Link to="/kontakt" className="block text-foreground/70 hover:text-primary transition-colors">
                {t({ sv: "Kontakt", en: "Contact" })}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t({ sv: "Branscher", en: "Industries" })}
            </h4>
            <div className="space-y-3 text-xs text-muted-foreground">
              <span className="block">{t({ sv: "Avfallshantering", en: "Waste management" })}</span>
              <span className="block">{t({ sv: "Fastighetsskötsel", en: "Property maintenance" })}</span>
              <span className="block">{t({ sv: "Teknisk service", en: "Technical service" })}</span>
              <span className="block">{t({ sv: "Snöröjning", en: "Snow clearing" })}</span>
              <span className="block">{t({ sv: "Miljö & Energi", en: "Environment & Energy" })}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 sm:mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            {t({ sv: "© 2026 Traivo AB · Byggd i Skandinavien", en: "© 2026 Traivo AB · Built in Scandinavia" })}
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>🇸🇪 {t({ sv: "Sverige", en: "Sweden" })}</span>
            <span>🇳🇴 {t({ sv: "Norge", en: "Norway" })}</span>
            <span>🇫🇮 {t({ sv: "Finland", en: "Finland" })}</span>
            <span>🇩🇰 {t({ sv: "Danmark", en: "Denmark" })}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
