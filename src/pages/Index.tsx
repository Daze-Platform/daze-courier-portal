import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import StatusControl from "@/components/StatusControl";
import OrderCard from "@/components/OrderCard";
import { Package, Truck, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import resortDeliveryIllustration from "@/assets/resort-delivery-with-logo.jpg";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { useIsPWA } from "@/hooks/use-is-pwa";
import { toast } from "sonner";

const Index = () => {
  const isPWA = useIsPWA();
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('courier-status');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('courier-status', JSON.stringify(isOnline));
  }, [isOnline]);

  const handleRefresh = async () => {
    // Simulate fetching new orders
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshKey(prev => prev + 1);
    toast.success("Orders refreshed!");
  };

  const { isPulling, isRefreshing, pullDistance, progress } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5,
  });
  const mockOrders = [
    {
      orderId: "#290459",
      restaurant: "Margarita Mama's",
      items: ["1x Chicken Tacos", "1x Guacamole & Chips", "1x Lime Agua Fresca"],
      deliveryAddress: "Room #215",
      deliveryTime: "Dec 21, 2:30PM",
      itemCount: 3,
      deliveryType: "Room Delivery",
      timeRemaining: 25,
      orderTotal: 28.75,
      estimatedEarnings: 15.50,
      specialNotes: "Ready for pickup - please call upon arrival.",
      customerName: "David Thompson"
    },
    {
      orderId: "#23456789",
      restaurant: "Margarita Mama's",
      items: ["1x Fried Rice with Chicken Protein (+$2.00)", "1x Spring Water"],
      deliveryAddress: "Room #123",
      deliveryTime: "Dec 21, 11:36AM",
      itemCount: 2,
      deliveryType: "Room Delivery",
      timeRemaining: 32,
      orderTotal: 15.90,
      estimatedEarnings: 12.50,
      specialNotes: "Please knock softly - baby sleeping. Leave outside door if no answer.",
      customerName: "Maria Rodriguez"
    },
    {
      orderId: "#23456790",
      restaurant: "Sunset Grill",
      items: ["2x Grilled Chicken Breast", "1x Caesar Salad (Extra Parmesan)", "1x Tropical Smoothie", "1x Garlic Bread"],
      deliveryAddress: "Pool Deck - Cabana 8",
      deliveryTime: "Dec 21, 12:15PM",
      itemCount: 4,
      deliveryType: "Poolside Service",
      timeRemaining: 45,
      orderTotal: 42.75,
      estimatedEarnings: 18.90,
      specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids.",
      customerName: "Sarah Johnson"
    },
    {
      orderId: "#867899",
      restaurant: "Margarita Mama's",
      items: ["1x Fried Rice", "2x Ham & Cheese Croissant"],
      deliveryAddress: "Beach - Umbrella A3",
      deliveryTime: "Dec 21, 11:36AM",
      itemCount: 2,
      deliveryType: "Beach Service",
      timeRemaining: 28,
      orderTotal: 39.90,
      estimatedEarnings: 24.80,
      specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids.",
      customerName: "Mike Chen"
    },
    {
      orderId: "#24681357",
      restaurant: "Sal De Mar",
      items: ["1x Seafood Paella", "2x Coconut Shrimp", "1x Fresh Catch of the Day", "1x Mango Margarita"],
      deliveryAddress: "Beach - Umbrella B7",
      deliveryTime: "Dec 21, 1:20PM",
      itemCount: 4,
      deliveryType: "Beach Service",
      timeRemaining: 38,
      orderTotal: 58.45,
      estimatedEarnings: 22.30,
      specialNotes: "Anniversary couple - please include extra lime wedges and cocktail napkins.",
      customerName: "Jennifer & Mark"
    },
    {
      orderId: "#98765432",
      restaurant: "Ocean Breeze Café",
      items: ["2x Fish Tacos", "1x Poolside Nachos", "2x Frozen Margaritas"],
      deliveryAddress: "Pool Deck - Umbrella P12",
      deliveryTime: "Dec 21, 2:45PM",
      itemCount: 3,
      deliveryType: "Poolside Service",
      timeRemaining: 20,
      orderTotal: 34.50,
      estimatedEarnings: 16.75,
      specialNotes: "Pool umbrella near the shallow end. We have two kids with us.",
      customerName: "The Johnson Family"
    },
    {
      orderId: "#11223344",
      restaurant: "Sunset Grill",
      items: ["1x Grilled Salmon", "1x Tropical Fruit Bowl", "1x Coconut Water"],
      deliveryAddress: "Pool Deck - Umbrella P8",
      deliveryTime: "Dec 21, 3:10PM",
      itemCount: 3,
      deliveryType: "Poolside Service",
      timeRemaining: 35,
      orderTotal: 29.75,
      estimatedEarnings: 14.25,
      specialNotes: "Large blue umbrella by the pool bar. Customer wearing red swim hat.",
      customerName: "Lisa Martinez"
    }
  ];

  // Filter orders based on selected delivery type and exclude cabana deliveries
  const availableOrders = mockOrders.filter(order => 
    !order.deliveryAddress.toLowerCase().includes('cabana')
  );
  
  const filteredOrders = selectedDeliveryType === "all" 
    ? availableOrders 
    : availableOrders.filter(order => {
        const orderType = order.deliveryType.toLowerCase().replace(/\s+/g, '-');
        return orderType === selectedDeliveryType;
      });

  return (
    <div className={`min-h-screen bg-primary ${isPWA ? 'pt-[110px] lg:pt-[64px]' : 'pt-[85px] lg:pt-[48px]'}`}>
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Pull to Refresh Indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="fixed top-[100px] lg:top-[56px] left-0 right-0 lg:left-64 flex justify-center z-40 transition-all duration-300"
          style={{
            transform: `translateY(${isPulling && !isRefreshing ? pullDistance : isRefreshing ? 40 : 0}px)`,
            opacity: isPulling || isRefreshing ? 1 : 0,
          }}
        >
          <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
            <RefreshCw 
              className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: !isRefreshing ? `rotate(${progress * 3.6}deg)` : undefined,
              }}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="lg:ml-64 bg-background">
        <div className={`container mx-auto px-4 space-y-6 lg:px-3 ${isPWA ? 'py-6 lg:pt-6 lg:pb-4' : 'py-6 lg:pt-6 lg:pb-4'}`}>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Active Orders</h1>
            <p className="text-muted-foreground lg:text-lg">Manage your current delivery assignments</p>
          </div>
          
          <StatusControl 
            isOnline={isOnline} 
            onStatusChange={setIsOnline}
            selectedDeliveryType={selectedDeliveryType}
            onDeliveryTypeChange={setSelectedDeliveryType}
          />
          
          {!isOnline ? (
            <div className="text-center py-6 lg:py-10">
              <div className="max-w-md mx-auto">
                <img 
                  src={resortDeliveryIllustration} 
                  alt="Start delivering illustration" 
                  className="w-full h-48 object-cover rounded-lg mb-6"
                  loading="lazy"
                  decoding="async"
                />
                <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Start Delivering?</h2>
                <p className="text-muted-foreground mb-6">
                  Turn on your account status to start receiving delivery orders and earn money at your resort!
                </p>
                <Button 
                  onClick={() => setIsOnline(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium"
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Start Delivering
                </Button>
              </div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4 lg:space-y-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.orderId} {...order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 lg:py-20">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium mb-2 lg:text-xl">
                  {selectedDeliveryType === "all" ? "No active orders" : `No ${selectedDeliveryType.replace('-', ' ')} orders`}
                </p>
                <p className="text-sm lg:text-base">
                  {selectedDeliveryType === "all" 
                    ? "New orders will appear here when available" 
                    : "Try selecting 'All Deliveries' to see other available orders"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;