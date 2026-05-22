import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        path={location.pathname}
        title="Sidan kunde inte hittas (404) | Traivo"
        description="Sidan du sökte finns inte. Gå tillbaka till startsidan eller utforska Traivos lösningar för fältservice och ruttoptimering."
        noindex
      />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Sidan kunde inte hittas</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Tillbaka till startsidan
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
