import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { Navigation } from "@/components/Navigation";
import Characters from "./pages/Characters";
import Spells from "./pages/Spells";
import Equipments from "./pages/Equipments";
import DiceRoller from "./pages/DiceRoller";
import Campaigns from "./pages/Campaigns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CampaignProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Characters />} />
            <Route path="/spells" element={<Spells />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/dice" element={<DiceRoller />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CampaignProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
