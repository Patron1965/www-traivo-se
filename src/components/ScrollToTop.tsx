import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrollar till toppen vid varje route-byte (om ingen hash finns).
 * Om URL:en har en #hash försöker vi scrolla till det elementet istället.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Vänta en tick så DOM hinner rendera målnoden
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
