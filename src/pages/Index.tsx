import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import StatusControl from "@/components/StatusControl";
import OrderCard from "@/components/OrderCard";
import { Package, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import startDeliveringIllustration from "@/assets/start-delivering-illustration.jpg";

const Index = () => {
  const [isOnline, setIsOnline] = useState(false);
  const mockOrders = [
    {
      orderId: "#23456789",
      restaurant: "Margarita Mama's",
      items: ["1x Fried Rice with Chicken Protein (+$2.00)", "1x Spring Water"],
      deliveryAddress: "Room N°12345",
      deliveryTime: "July 21, 11:36AM",
      itemCount: 2,
      deliveryType: "Room delivery",
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
      deliveryType: "Poolside",
      timeRemaining: 45,
      orderTotal: 42.75,
      estimatedEarnings: 18.90,
      specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids."
    },
    {
      orderId: "#23456791",
      restaurant: "Ocean Breeze Café",
      items: ["1x Fish Tacos (3 pieces with Mango Salsa)", "1x Coconut Water", "1x Sweet Potato Fries"],
      deliveryAddress: "Beach Chair Section A - Chair 15",
      deliveryTime: "July 21, 1:20PM",
      itemCount: 3,
      deliveryType: "Beach service",
      timeRemaining: 28,
      orderTotal: 28.50,
      estimatedEarnings: 15.25,
      specialNotes: "Allergic to shellfish - please confirm no cross-contamination. Thank you!"
    }
  ];

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
          
          <StatusControl isOnline={isOnline} onStatusChange={setIsOnline} />
          
          {!isOnline ? (
            <div className="text-center py-12 lg:py-20">
              <div className="max-w-md mx-auto">
                <img 
                  src={startDeliveringIllustration} 
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
          ) : mockOrders.length > 0 ? (
            <div className="space-y-4 lg:space-y-6">
              {mockOrders.map((order) => (
                <OrderCard key={order.orderId} {...order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 lg:py-20">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium mb-2 lg:text-xl">No active orders</p>
                <p className="text-sm lg:text-base">New orders will appear here when available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;