import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useT } from "@/i18n/LanguageContext";

const SYSTEM_URL = "https://kinab-core-concepts--tomas155.replit.app";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const t = useT();

  const links = [
    { to: "/hjarna", label: t({ sv: "Hjärnan", en: "The Brain" }) },
    { to: "/traivo-one", label: "Traivo One" },
    { to: "/traivo-go", label: "Traivo Go" },
    { to: "/om-oss", label: t({ sv: "Om oss", en: "About" }) },
    { to: "/kontakt", label: t({ sv: "Kontakt", en: "Contact" }) },
  ];

  const loginLabel = t({ sv: "Logga in", en: "Sign in" });
  const loginAria = t({
    sv: "Logga in i Traivo-systemet (öppnas i ny flik)",
    en: "Sign in to the Traivo system (opens in a new tab)",
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link to="/" className="font-display font-bold tracking-tight">
          <span className="text-gradient-ocean text-2xl sm:text-3xl">Traivo</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-[12px] font-medium tracking-wide uppercase transition-all duration-300 ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-2">
            <LanguageToggle />
          </div>

          <a
            href={SYSTEM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={loginAria}
            className="ml-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground shadow-[0_0_0_3px_hsl(var(--primary)/0.18),0_4px_14px_hsl(var(--primary)/0.30)] hover:bg-primary/90 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {loginLabel}
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </a>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle compact />
          <button className="p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute inset-x-0 top-14 bg-background border-t border-border"
          >
            <div className="px-4 sm:px-6 py-5 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <a
                href={SYSTEM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                aria-label={loginAria}
                className="mt-2 flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground shadow-[0_0_0_3px_hsl(var(--primary)/0.18),0_4px_14px_hsl(var(--primary)/0.30)] hover:bg-primary/90 transition-all"
              >
                {t({ sv: "Logga in i systemet", en: "Sign in to the system" })}
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
