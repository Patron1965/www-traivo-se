import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/#ai-chat", label: "Utforska", isAnchor: true },
  { to: "/traivo-one", label: "Traivo One" },
  { to: "/traivo-go", label: "Traivo Go" },
  
  { to: "/om-oss", label: "Om oss" },
  { to: "/kontakt", label: "Kontakt" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (link: typeof links[0], e: React.MouseEvent) => {
    if (link.isAnchor) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById("ai-chat")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById("ai-chat")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="/" className="font-display font-bold text-[1.375rem] tracking-tight">
          <span className="text-gradient-ocean rounded-none text-2xl shadow-none">{"traivo \n"}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.isAnchor ? "/" : link.to}
              onClick={(e) => handleNavClick(link, e)}
              className={`px-3.5 py-2 rounded-lg text-[12px] font-medium tracking-wide uppercase transition-all duration-300 ${
                location.pathname === "/" && link.isAnchor
                  ? "text-primary"
                  : location.pathname === link.to && !link.isAnchor
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
            className="md:hidden absolute inset-x-0 top-14 glass border-t border-border"
          >
            <div className="px-6 py-5 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.isAnchor ? "/" : link.to}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleNavClick(link, e);
                  }}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    (location.pathname === "/" && link.isAnchor) || (location.pathname === link.to && !link.isAnchor)
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
