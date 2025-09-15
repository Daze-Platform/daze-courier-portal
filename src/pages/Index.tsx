import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import StatusControl from "@/components/StatusControl";
import OrderCard from "@/components/OrderCard";
import { Package } from "lucide-react";

const Index = () => {
  const mockOrders = [
    {
      orderId: "#23456789",
      restaurant: "Margarita Mama's",
      items: ["1x Fried Rice"],
      deliveryAddress: "Room N°12345",
      deliveryTime: "July 21, 11:36AM",
      itemCount: 1,
      deliveryType: "Room delivery",
      timeRemaining: 32
    },
    {
      orderId: "#23456790",
      restaurant: "Sunset Grill",
      items: ["2x Grilled Chicken", "1x Caesar Salad", "1x Tropical Smoothie"],
      deliveryAddress: "Pool Deck - Cabana 8",
      deliveryTime: "July 21, 12:15PM",
      itemCount: 4,
      deliveryType: "Poolside",
      timeRemaining: 45
    },
    {
      orderId: "#23456791",
      restaurant: "Ocean Breeze Café",
      items: ["1x Fish Tacos", "1x Coconut Water"],
      deliveryAddress: "Beach Chair Section A - Chair 15",
      deliveryTime: "July 21, 1:20PM",
      itemCount: 2,
      deliveryType: "Beach service",
      timeRemaining: 28
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
          
          <StatusControl />
          
          {mockOrders.length > 0 ? (
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