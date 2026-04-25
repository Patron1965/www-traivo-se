import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-noise">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display font-bold text-2xl text-gradient-ocean">traivo</span>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-[240px]">
              AI-driven fältserviceplattform byggd för nordiska villkor.
            </p>
            <div className="flex gap-3 mt-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
              <span className="text-xs text-muted-foreground">System online</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Plattform</h4>
            <div className="space-y-3 text-sm">
              <Link to="/traivo-one" className="block text-foreground/70 hover:text-primary transition-colors">Traivo One</Link>
              <Link to="/traivo-go" className="block text-foreground/70 hover:text-primary transition-colors">Traivo Go</Link>
              <Link to="/priser" className="block text-foreground/70 hover:text-primary transition-colors">Priser</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Företag</h4>
            <div className="space-y-3 text-sm">
              <Link to="/om-oss" className="block text-foreground/70 hover:text-primary transition-colors">Om oss</Link>
              <Link to="/kontakt" className="block text-foreground/70 hover:text-primary transition-colors">Kontakt</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Branscher</h4>
            <div className="space-y-3 text-xs text-muted-foreground">
              <span className="block">Avfallshantering</span>
              <span className="block">Fastighetsskötsel</span>
              <span className="block">Teknisk service</span>
              <span className="block">Snöröjning</span>
              <span className="block">Miljö & Energi</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 sm:mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            © 2026 Traivo AB · Byggd i Skandinavien
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>🇸🇪 Sverige</span>
            <span>🇳🇴 Norge</span>
            <span>🇫🇮 Finland</span>
            <span>🇩🇰 Danmark</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
