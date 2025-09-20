import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import StatusControl from "@/components/StatusControl";
import OrderCard from "@/components/OrderCard";
import { Package, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import resortDeliveryIllustration from "@/assets/resort-delivery-with-logo.jpg";

const Index = () => {
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem('courier-status');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("all");

  useEffect(() => {
    localStorage.setItem('courier-status', JSON.stringify(isOnline));
  }, [isOnline]);
  const mockOrders = [
    {
      orderId: "#23456789",
      restaurant: "Margarita Mama's",
      items: ["1x Fried Rice with Chicken Protein (+$2.00)", "1x Spring Water"],
      deliveryAddress: "Room #1234",
      deliveryTime: "July 21, 11:36AM",
      itemCount: 2,
      deliveryType: "Room Delivery",
      timeRemaining: 32,
      orderTotal: 15.90,
      estimatedEarnings: 12.50,
      specialNotes: "Please knock softly - baby sleeping. Leave outside door if no answer."
    },
    {
      orderId: "#23456790",
      restaurant: "Sunset Grill",
      items: ["2x Grilled Chicken Breast", "1x Caesar Salad (Extra Parmesan)", "1x Tropical Smoothie", "1x Garlic Bread"],
      deliveryAddress: "Pool Deck - Cabana 8",
      deliveryTime: "July 21, 12:15PM",
      itemCount: 4,
      deliveryType: "Poolside Service",
      timeRemaining: 45,
      orderTotal: 42.75,
      estimatedEarnings: 18.90,
      specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids."
    },
    {
      orderId: "#867899",
      restaurant: "Margarita Mama's",
      items: ["1x Fried Rice", "2x Ham & Cheese Croissant"],
      deliveryAddress: "Beach - Umbrella A3",
      deliveryTime: "July 21, 11:36AM",
      itemCount: 2,
      deliveryType: "Beach Service",
      timeRemaining: 28,
      orderTotal: 39.90,
      estimatedEarnings: 24.80,
      specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids."
    }
  ];

  // Filter orders based on selected delivery type
  const filteredOrders = selectedDeliveryType === "all" 
    ? mockOrders 
    : mockOrders.filter(order => {
        const orderType = order.deliveryType.toLowerCase().replace(/\s+/g, '-');
        return orderType === selectedDeliveryType;
      });

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
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