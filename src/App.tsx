import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "./contexts/EventContext";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import HelpSupportPage from "./pages/HelpSupportPage.js";
import UserOffersPage from "./pages/UserOffersPage.js";
import VendorCreateOfferPage from "./pages/VendorCreateOfferPage .js";
import { AuthProvider } from "./contexts/AuthContext.js";
import UserProfile from "./pages/UserProfile.js";
import VendorProfile from "./pages/VendorProfile.js";
import AdminProfile from "./pages/AdminProfile.js";
import AdminAuthForm from "./pages/AdminAuthForm.js";
import { AdminProvider } from "./contexts/AdminContext.js";
import { VendorProvider } from "./contexts/VendorContext.js";
import { ServiceProvider } from "./contexts/ServiceContext.js";
import ServiceManagement from "./pages/ServiceManagement.js";
import ServicesPage from "./pages/Venues";
import ServiceDetail from "./pages/VenueDetail.js";
import { WishlistProvider } from "./contexts/WishlistContext.js";
import WishlistPage from "./pages/WishlistPage.js";
import VendorPage from "./pages/VendorPage.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSupportPage from "./pages/AdminSupportPage.js";
import { SupportProvider } from "./contexts/SupportContext.js";
import AdminUserManagement from "./pages/AdminUserManagement.js";


const App = () => (
  // <QueryClientProvider client={queryClient}>

  <TooltipProvider>
    <EventProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <VendorProvider>
              <ServiceProvider>
                <WishlistProvider>
                  <SupportProvider>
                  <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                  />
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/ServicesPage" element={<ServicesPage />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/help" element={<HelpSupportPage />} />
                  <Route path="/userOffer" element={<UserOffersPage />} />
                  <Route path="/vendorOffer" element={<VendorCreateOfferPage />} />
                  <Route path="/userprofile" element={<UserProfile />} />
                  <Route path="/vendorprofile" element={<VendorProfile />} />
                  <Route path="/adminprofile" element={<AdminProfile />} />
                  <Route path="/admin/login" element={<AdminAuthForm />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/vendor/:id" element={<VendorPage />} />
                  <Route path="/servicemanagement" element={<ServiceManagement />} />
                  <Route path="/admin/support" element={<AdminSupportPage />} />
                  <Route path="/admin/usermanagement" element={<AdminUserManagement />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </SupportProvider>
                </WishlistProvider>
              </ServiceProvider>
            </VendorProvider>
          </AdminProvider>
        </AuthProvider>

      </BrowserRouter>
    </EventProvider>
  </TooltipProvider>
  // </QueryClientProvider>
);

export default App;
