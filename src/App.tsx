import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { executeScrollToTop } from "@/utils/scrollToTop";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import Index from "./pages/Index";
import OrderDetail from "./pages/OrderDetail";
import DeliveryTracking from "./pages/DeliveryTracking";
import OrderHistory from "./pages/OrderHistory";
import OrderHistoryDetail from "./pages/OrderHistoryDetail";
import Ratings from "./pages/Ratings";
import Earnings from "./pages/Earnings";
import Payouts from "./pages/Payouts";
import Help from "./pages/Help";
import ProfileSettings from "./pages/ProfileSettings";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Global scroll handler component
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Execute comprehensive scroll to top on every route change
    executeScrollToTop();
  }, [location.pathname, location.search, location.hash]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAUpdatePrompt />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/delivery/:orderId" element={<DeliveryTracking />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-details/:orderId" element={<OrderHistoryDetail />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/help" element={<Help />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
