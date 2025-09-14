import CourierHeader from "@/components/CourierHeader";
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
      <CourierHeader />
      
      <main className="px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Active Orders</h1>
        </div>

        {/* Status Controls */}
        <StatusControl />

        {/* Orders List */}
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              orderId={order.orderId}
              restaurant={order.restaurant}
              items={order.items}
              deliveryAddress={order.deliveryAddress}
              deliveryTime={order.deliveryTime}
              itemCount={order.itemCount}
              deliveryType={order.deliveryType}
              timeRemaining={order.timeRemaining}
            />
          ))}
        </div>

        {/* Empty State for when no orders */}
        {mockOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No active orders</h3>
            <p className="text-muted-foreground">New orders will appear here when available</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;