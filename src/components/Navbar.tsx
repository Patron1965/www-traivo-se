import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/hjarna", label: "Hjärnan" },
  { to: "/traivo-one", label: "Traivo One" },
  { to: "/traivo-go", label: "Traivo Go" },
  { to: "/om-oss", label: "Om oss" },
  { to: "/kontakt", label: "Kontakt" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="/" className="font-display font-bold tracking-tight">
          <span className="text-gradient-ocean text-3xl">Traivo</span>
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
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute inset-x-0 top-14 bg-background border-t border-border"
          >
            <div className="px-6 py-5 space-y-1">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
