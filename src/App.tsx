
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "./contexts/EventContext";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail.js";
import Catering from "./pages/Catering";
import LightStudio from "./pages/LightStudio";
import WeddingVenues from "./pages/WeddingVenues";
import NotFound from "./pages/NotFound";
import EventWalaProfiles from './pages/ProfilePage.js'

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EventProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/catering" element={<Catering />} />
            <Route path="/light-studio" element={<LightStudio />} />
            <Route path="/wedding-venues" element={<WeddingVenues />} />
            <Route path="/venue/:id" element={<VenueDetail />} />
            <Route path="/profile" element={<EventWalaProfiles/>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
