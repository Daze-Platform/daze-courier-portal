import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OrderDetail from "./pages/OrderDetail";
import DeliveryTracking from "./pages/DeliveryTracking";
import OrderHistory from "./pages/OrderHistory";
import OrderHistoryDetail from "./pages/OrderHistoryDetail";
import Ratings from "./pages/Ratings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/delivery/:orderId" element={<DeliveryTracking />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-details/:orderId" element={<OrderHistoryDetail />} />
          <Route path="/ratings" element={<Ratings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
