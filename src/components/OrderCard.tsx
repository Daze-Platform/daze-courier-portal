import { Clock, MapPin, Package, Timer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  orderId: string;
  restaurant: string;
  restaurantLogo?: string;
  items: string[];
  deliveryAddress: string;
  deliveryTime: string;
  itemCount: number;
  deliveryType: string;
  timeRemaining?: number;
}

const OrderCard = ({
  orderId,
  restaurant,
  restaurantLogo,
  items,
  deliveryAddress,
  deliveryTime,
  itemCount,
  deliveryType,
  timeRemaining = 32
}: OrderCardProps) => {
  const navigate = useNavigate();

  const handleAcceptOrder = () => {
    // Navigate to order detail page
    navigate(`/order/${orderId.replace('#', '')}`);
  };
  return (
    <div className="bg-card rounded-lg p-6 shadow-soft border border-border space-y-4">
      {/* Restaurant Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
          <Package className="h-6 w-6 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Order from {restaurant}</h3>
          <p className="text-sm text-muted-foreground">({orderId})</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex items-center gap-4 py-2 border-b border-border">
        <span className="text-sm text-foreground">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
        <div className="h-1 w-1 bg-muted-foreground rounded-full" />
        <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
          <Truck className="h-3 w-3 mr-1" />
          {deliveryType}
        </Badge>
      </div>

      {/* Delivery Details */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Address</p>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            <p className="text-sm font-semibold text-foreground">{deliveryAddress}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Time</p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <p className="text-sm font-medium text-foreground">{deliveryTime}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Order Details</p>
          <div className="space-y-1">
            {items.map((item, index) => (
              <p key={index} className="text-sm text-foreground">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2">
        <Button 
          className="flex-1 bg-gradient-accent hover:bg-accent-hover text-accent-foreground font-medium"
          onClick={handleAcceptOrder}
        >
          Accept Order
        </Button>
        <div className="ml-4 flex items-center justify-center h-12 w-12 border-2 border-warning rounded-full">
          <div className="flex items-center gap-1">
            <Timer className="h-4 w-4 text-warning" />
            <span className="text-sm font-bold text-warning">{timeRemaining}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;