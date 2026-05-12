import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import TraivoOne from "./pages/TraivoOne";
import TraivoGo from "./pages/TraivoGo";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BrainPage from "./pages/BrainPage";
import DeepAnalysisCheckout from "./pages/DeepAnalysisCheckout";
import DeepAnalysisThankYou from "./pages/DeepAnalysisThankYou";
import GoLiveChecklist from "./pages/GoLiveChecklist";
import DomainStatusPage from "./pages/DomainStatusPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/traivo-one" element={<TraivoOne />} />
            <Route path="/traivo-go" element={<TraivoGo />} />
            <Route path="/hjarna" element={<BrainPage />} />
            <Route path="/hjarna/djupanalys" element={<DeepAnalysisCheckout />} />
            <Route path="/hjarna/djupanalys/tack" element={<DeepAnalysisThankYou />} />
            <Route path="/go-live" element={<GoLiveChecklist />} />
            <Route path="/priser" element={<Pricing />} />
            <Route path="/om-oss" element={<About />} />
            <Route path="/kontakt" element={<Contact />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
