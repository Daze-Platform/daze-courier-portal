import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Package, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import DeliveryNavigation from "@/components/DeliveryNavigation";
import OrderDetailsDrawer from "@/components/OrderDetailsDrawer";
import margaritaMamasLogo from "@/assets/margarita-mamas-logo.png";
import sunsetGrillLogo from "@/assets/sunset-grill-logo.png";
import oceanBreezeLogo from "@/assets/ocean-breeze-logo.png";
import salDeMarLogo from "@/assets/sal-de-mar-logo.png";
import luxuryPoolDeckMap from "@/assets/luxury-pool-deck-hd.jpg";

const DeliveryTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);

  // Mock order data - in real app would fetch based on orderId
  const order = {
    orderId: "#867899",
    restaurant: "Margarita Mama's",
    deliveryAddress: "Beach - Umbrella A3",
    deliveryTime: "July 21, 11:36AM",
    deliveryType: "Beach Service",
    customer: {
      name: "Gretche Bergson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      phone: "+1 (555) 123-4567"
    },
    items: [
      {
        name: "1x Fried Rice",
        price: 13.90,
        modifications: "Choice of Protein: Chicken ($2.00)"
      },
      {
        name: "2x Ham & Cheese Croissant", 
        price: 22.00,
        modifications: "Extra slices of cheese ($1.00)"
      }
    ],
    specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids.",
    total: 39.90,
    earnings: {
      basePay: 10.80,
      customerTip: 24.80,
      additionalPay: 4.30,
      total: 39.90
    }
  };

  const getRestaurantLogo = (restaurantName: string) => {
    switch (restaurantName.toLowerCase()) {
      case "margarita mama's":
        return margaritaMamasLogo;
      case "sunset grill":
        return sunsetGrillLogo;
      case "ocean breeze café":
        return oceanBreezeLogo;
      case "sal de mar":
        return salDeMarLogo;
      default:
        return null;
    }
  };

  const handleStartNavigation = () => {
    setNavigationStarted(true);
    setShowNavigationModal(true);
  };

  const handleNavigationComplete = () => {
    setShowNavigationModal(false);
    setShowCompletionModal(true);
  };

  const handleCompletionConfirm = () => {
    setShowCompletionModal(false);
    toast({
      title: "🎉 Delivery Complete!",
      description: "Order was successfully delivered. Great job!",
      className: "border-l-4 border-l-green-500",
    });
    navigate("/");
  };

  const restaurantLogo = getRestaurantLogo(order.restaurant);

  return (
    <>
      <UnifiedHeader />
      <DesktopSidebar />

      <div className="min-h-screen bg-background lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/order/${orderId?.replace('#', '')}`)}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                {navigationStarted ? 'Delivery in Progress' : 'Ready to Deliver'}
              </h1>
              <p className="text-muted-foreground lg:text-lg">
                {navigationStarted ? 'Navigate to customer location' : 'Start navigation when ready'}
              </p>
            </div>
            <Badge className={navigationStarted ? "bg-primary text-white" : "bg-secondary text-secondary-foreground"}>
              {navigationStarted ? 'In Progress' : 'Ready'}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm">
                  {restaurantLogo ? (
                    <img src={restaurantLogo} alt={`${order.restaurant} logo`} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <Package className="h-6 w-6 text-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground lg:text-xl">Delivering from {order.restaurant}</h2>
                  <Badge className="bg-accent text-white font-medium mt-1 border-0">
                    {order.deliveryType}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="font-medium text-foreground">{order.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-foreground">{order.deliveryTime}</span>
                </div>
              </div>

              <Button 
                className="w-full font-medium text-white bg-primary hover:bg-primary/90"
                onClick={handleStartNavigation}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            </div>

            {/* Customer Location Preview */}
            <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Customer Location</h3>
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-video bg-accent/5 rounded-lg border border-border overflow-hidden">
                <img 
                  src={luxuryPoolDeckMap} 
                  alt="Luxury pool deck area - Customer location preview" 
                  className="w-full h-full object-contain"
                />
                {/* Pool Bar Marker */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: "28%", left: "12%" }}
                >
                  <div className="relative">
                    <MapPin className="h-6 w-6 text-amber-500 fill-amber-500 drop-shadow-lg" />
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      Pool Bar
                    </div>
                  </div>
                </div>
                {/* Customer Destination Marker */}
                <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-red-500 fill-red-500 drop-shadow-lg" />
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground shadow-lg">
                  {order.deliveryAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation started - Show drawer for order details */}
          {navigationStarted && <OrderDetailsDrawer order={order} />}

        </div>
      </div>

      {/* Full Screen Navigation Modal */}
      <Dialog open={showNavigationModal} onOpenChange={setShowNavigationModal}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 m-0 border-0">
          <DeliveryNavigation 
            destination={order.deliveryAddress}
            deliveryType={order.deliveryType}
            onComplete={handleNavigationComplete}
            order={order}
          />
        </DialogContent>
      </Dialog>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Delivery Complete!</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-foreground mb-2">Order was successfully delivered right on time!</p>
              <span className="text-2xl">🎉</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-foreground">Total Earnings</span>
                <span className="text-xl font-bold text-success">+${order.earnings.total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Pay</span>
                  <span className="text-foreground">${order.earnings.basePay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Tip</span>
                  <span className="text-foreground">${order.earnings.customerTip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Additional Pay</span>
                  <span className="text-foreground">${order.earnings.additionalPay.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full font-medium text-white"
              style={{ backgroundColor: '#29b6f6' }}
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e88e5'}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#29b6f6'}
              onClick={handleCompletionConfirm}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeliveryTracking;