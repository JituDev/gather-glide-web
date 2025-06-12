
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
import HelpSupportPage from "./pages/HelpSupportPage.js";
import UserOffersPage from "./pages/UserOffersPage.js";
import VendorCreateOfferPage from "./pages/VendorCreateOfferPage .js";
import VendorsPage from "./pages/VendorsPage.js";

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
            <Route path="/help" element={<HelpSupportPage />} />
            <Route path="/userOffer" element = {<UserOffersPage/>} />
            <Route path="/vendorOffer" element = {<VendorCreateOfferPage/>} />
            <Route path="/vendors/:category" element={<VendorsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
