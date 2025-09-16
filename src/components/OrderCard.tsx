import { Clock, MapPin, Package, Timer, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import margaritaMamasLogo from "@/assets/margarita-mamas-logo.png";
import sunsetGrillLogo from "@/assets/sunset-grill-logo.png";
import oceanBreezeLogo from "@/assets/ocean-breeze-logo.png";

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
  orderTotal?: number;
  estimatedEarnings?: number;
  specialNotes?: string;
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
  timeRemaining = 32,
  orderTotal = 0,
  estimatedEarnings = 0,
  specialNotes
}: OrderCardProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(timeRemaining);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getRestaurantLogo = (restaurantName: string) => {
    switch (restaurantName.toLowerCase()) {
      case "margarita mama's":
        return margaritaMamasLogo;
      case "sunset grill":
        return sunsetGrillLogo;
      case "ocean breeze café":
        return oceanBreezeLogo;
      default:
        return null;
    }
  };

  const currentRestaurantLogo = getRestaurantLogo(restaurant);

  return (
    <div className="bg-card rounded-lg shadow-soft border border-border overflow-hidden">
      {/* Collapsed Header - Always Visible */}
      <div className="p-4 space-y-3">
        {/* Top Row - Restaurant Info */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-white shadow-sm">
            {currentRestaurantLogo ? (
              <img src={currentRestaurantLogo} alt={`${restaurant} logo`} className="h-10 w-10 object-contain" />
            ) : (
              <Package className="h-6 w-6 text-accent" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg">
              Order from {restaurant}
            </h3>
            <p className="text-primary font-medium text-sm cursor-pointer hover:underline">
              ({orderId})
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Enhanced Summary Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground font-medium">
              {itemCount} item{itemCount > 1 ? 's' : ''}
            </span>
            {orderTotal > 0 && (
              <>
                <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                <span className="text-foreground font-semibold">
                  ${orderTotal.toFixed(2)}
                </span>
              </>
            )}
            {specialNotes && (
              <>
                <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                  💬 Special Notes
                </Badge>
              </>
            )}
          </div>
          <Badge className="bg-accent text-white font-medium text-xs border-0">
            <Truck className="h-3 w-3 mr-1" />
            {deliveryType}
          </Badge>
        </div>
        
        {/* Earnings Preview */}
        {estimatedEarnings > 0 && (
          <div className="bg-success/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-success text-sm font-medium">Estimated Earnings</span>
              <span className="text-success text-lg font-bold">${estimatedEarnings.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between">
          <Button 
            className="font-medium px-12 py-3 text-white flex-1 mr-4"
            style={{ backgroundColor: '#29b6f6' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e88e5'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#29b6f6'}
            onClick={handleAcceptOrder}
          >
            Accept
          </Button>
          
          <div className={`flex items-center justify-center h-12 w-12 border-2 rounded-full flex-shrink-0 ${
            countdown === 0 ? 'border-red-500' : 'border-orange-500'
          }`}>
            <span className={`text-lg font-bold ${countdown === 0 ? 'text-red-500' : 'text-orange-500'}`}>
              {countdown}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-gradient-to-r from-muted/10 to-muted/5">
          {/* Delivery Info Section */}
          <div className="p-4 border-b border-border/50">
            <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Delivery Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/60 rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Address</p>
                <p className="text-sm font-semibold text-foreground">{deliveryAddress}</p>
              </div>
              <div className="bg-background/60 rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Expected Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-accent" />
                  <p className="text-sm font-semibold text-foreground">{deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="p-4">
            <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-accent" />
              Order Items ({itemCount})
            </h4>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="bg-background/80 border border-border/50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                      <p className="text-sm font-medium text-foreground leading-relaxed">{item}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Item {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            {(orderTotal > 0 || estimatedEarnings > 0) && (
              <div className="mt-4 bg-background/80 border border-border/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  {orderTotal > 0 && (
                    <div className="text-center">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order Total</p>
                      <p className="text-lg font-bold text-foreground">${orderTotal.toFixed(2)}</p>
                    </div>
                  )}
                  {estimatedEarnings > 0 && (
                    <div className="text-center">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Earnings</p>
                      <p className="text-lg font-bold text-success">${estimatedEarnings.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Special Notes - More Prominent */}
            {specialNotes && (
              <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-400 rounded-lg p-3 shadow-sm">
                <h5 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 text-sm">💬</span>
                  </div>
                  Special Instructions
                </h5>
                <p className="text-sm text-amber-700 leading-relaxed font-medium bg-white/60 p-2 rounded border border-amber-200">
                  {specialNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;