import { Clock, MapPin, Package, Timer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Order expired
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleAcceptOrder = () => {
    // Navigate to order detail page
    navigate(`/order/${orderId.replace('#', '')}`);
  };
  return (
    <div className="bg-card rounded-lg p-4 shadow-soft border border-border space-y-4 lg:p-6">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:items-center lg:gap-6">
        {/* Restaurant Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Package className="h-6 w-6 text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">Order from {restaurant}</h3>
            <p className="text-sm text-muted-foreground">({orderId})</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="font-medium text-muted-foreground mb-1">Order Details</p>
            <p className="text-foreground">{items[0]}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground mb-1">Delivery Time</p>
            <p className="text-foreground">{deliveryTime}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground mb-1">Delivery Address</p>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="bg-accent/10 text-accent-foreground text-xs">
                <Truck className="h-3 w-3 mr-1" />
                {deliveryType}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`flex items-center justify-center h-12 w-12 border-2 rounded-full ${
            countdown <= 10 ? 'border-destructive' : 'border-warning'
          }`}>
            <div className="flex items-center gap-1">
              <Timer className={`h-4 w-4 ${countdown <= 10 ? 'text-destructive' : 'text-warning'}`} />
              <span className={`text-sm font-bold ${countdown <= 10 ? 'text-destructive' : 'text-warning'}`}>
                {countdown}
              </span>
            </div>
          </div>
          <Button 
            className="bg-primary/80 hover:bg-primary/70 text-primary-foreground font-medium px-6"
            onClick={handleAcceptOrder}
            disabled={countdown <= 0}
          >
            {countdown <= 0 ? 'Expired' : 'Accept'}
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
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
            className="flex-1 bg-primary/80 hover:bg-primary/70 text-primary-foreground font-medium"
            onClick={handleAcceptOrder}
            disabled={countdown <= 0}
          >
            {countdown <= 0 ? 'Order Expired' : 'Accept Order'}
          </Button>
          <div className={`ml-4 flex items-center justify-center h-12 w-12 border-2 rounded-full ${
            countdown <= 10 ? 'border-destructive' : 'border-warning'
          }`}>
            <div className="flex items-center gap-1">
              <Timer className={`h-4 w-4 ${countdown <= 10 ? 'text-destructive' : 'text-warning'}`} />
              <span className={`text-sm font-bold ${countdown <= 10 ? 'text-destructive' : 'text-warning'}`}>
                {countdown}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;