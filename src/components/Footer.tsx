import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-bold text-lg text-gradient-ocean">Traivo</span>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              AI-driven fältserviceplattform för nordiska företag.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Produkter</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/traivo-one" className="block hover:text-foreground transition-colors">Traivo One</Link>
              <Link to="/traivo-go" className="block hover:text-foreground transition-colors">Traivo Go</Link>
              <Link to="/priser" className="block hover:text-foreground transition-colors">Priser</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Företag</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/om-oss" className="block hover:text-foreground transition-colors">Om oss</Link>
              <Link to="/kontakt" className="block hover:text-foreground transition-colors">Kontakt</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Branscher</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <span className="block">Avfallshantering</span>
              <span className="block">Fastighetsskötsel</span>
              <span className="block">Teknisk service</span>
              <span className="block">Snöröjning</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Traivo · Nordisk fältservice förstärkt med AI
          </p>
          <p className="text-xs text-muted-foreground">
            Byggd i Skandinavien 🇸🇪
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
