import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, MapPin, Clock, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import DeliveryNavigation from "@/components/DeliveryNavigation";
import OrderDetailsDrawer from "@/components/OrderDetailsDrawer";
import ResortImageView from "@/components/ResortImageView";
import RoomDeliveryStatus from "@/components/RoomDeliveryStatus";
import margaritaMamasLogo from "@/assets/margarita-mamas-logo.png";
import sunsetGrillLogo from "@/assets/sunset-grill-logo.png";
import oceanBreezeLogo from "@/assets/ocean-breeze-logo.png";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [showRoomStatus, setShowRoomStatus] = useState(false);

  // Scroll to top when component mounts or orderId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [orderId]);

  // Mock order data - in real app would fetch based on orderId
  const mockOrders = [
    {
      orderId: "#23456789",
      restaurant: "Margarita Mama's",
      deliveryAddress: "Room N°12345",
      deliveryTime: "July 21, 11:36AM",
      deliveryType: "Room Delivery",
      customer: {
        name: "Gretche Bergson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        phone: "+1 (555) 123-4567"
      },
      items: [
        {
          name: "1x Fried Rice with Chicken Protein (+$2.00)",
          price: 13.90,
          modifications: "Choice of Protein: Chicken ($2.00)"
        },
        {
          name: "1x Spring Water", 
          price: 2.00,
          modifications: ""
        }
      ],
      specialNotes: "Please knock softly - baby sleeping. Leave outside door if no answer.",
      subtotal: 15.90,
      processingFee: 0.00,
      deliveryTips: 4.00,
      total: 15.90,
      earnings: {
        basePay: 8.50,
        customerTip: 4.00,
        additionalPay: 0.00,
        total: 12.50
      }
    },
    {
      orderId: "#23456790",
      restaurant: "Sunset Grill",
      deliveryAddress: "Pool Deck - Cabana 8",
      deliveryTime: "July 21, 12:15PM",
      deliveryType: "Poolside Service",
      customer: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        phone: "+1 (555) 987-6543"
      },
      items: [
        {
          name: "2x Grilled Chicken Breast",
          price: 24.00,
          modifications: ""
        },
        {
          name: "1x Caesar Salad (Extra Parmesan)",
          price: 12.75,
          modifications: "Extra Parmesan"
        },
        {
          name: "1x Tropical Smoothie",
          price: 8.00,
          modifications: ""
        },
        {
          name: "1x Garlic Bread",
          price: 6.00,
          modifications: ""
        }
      ],
      specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids.",
      subtotal: 42.75,
      processingFee: 2.00,
      deliveryTips: 6.00,
      total: 42.75,
      earnings: {
        basePay: 12.90,
        customerTip: 6.00,
        additionalPay: 0.00,
        total: 18.90
      }
    },
    {
      orderId: "#867899",
      restaurant: "Margarita Mama's",
      deliveryAddress: "Beach - Umbrella A3",
      deliveryTime: "July 21, 11:36AM",
      deliveryType: "Beach Service",
      customer: {
        name: "Mike Thompson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        phone: "+1 (555) 456-7890"
      },
      items: [
        {
          name: "1x Fried Rice",
          price: 13.90,
          modifications: ""
        },
        {
          name: "2x Ham & Cheese Croissant",
          price: 22.00,
          modifications: ""
        }
      ],
      specialNotes: "We're the family with blue umbrellas. Please bring extra napkins and utensils for kids.",
      subtotal: 35.90,
      processingFee: 4.00,
      deliveryTips: 4.00,
      total: 39.90,
      earnings: {
        basePay: 20.80,
        customerTip: 4.00,
        additionalPay: 0.00,
        total: 24.80
      }
    }
  ];

  // Find the order based on orderId parameter
  const order = mockOrders.find(o => o.orderId === `#${orderId}`) || mockOrders[0];

  const handleStartDelivery = () => {
    console.log('Starting delivery with:', { 
      deliveryType: order.deliveryType, 
      deliveryAddress: order.deliveryAddress,
      orderId: order.orderId
    });
    setNavigationStarted(true);
    
    // For room deliveries, show status bar instead of navigation modal
    if (order.deliveryType === "Room Delivery" || order.deliveryAddress?.toLowerCase().includes('room')) {
      console.log('Room delivery detected - showing status bar');
      setShowRoomStatus(true);
    } else {
      console.log('Non-room delivery - showing navigation modal');
      setShowNavigationModal(true);
    }
  };

  const handleNavigationComplete = () => {
    setShowNavigationModal(false);
    setShowCompletionModal(true);
  };

  const handleCompleteDelivery = () => {
    setShowCompletionModal(true);
  };

  const handleRoomDeliveryComplete = () => {
    setShowRoomStatus(false);
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

  const restaurantLogo = getRestaurantLogo(order.restaurant);

  return (
    <>
      <UnifiedHeader />
      <DesktopSidebar />

      {/* Main Content */}
      <div className="min-h-screen bg-background lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Order {order.orderId}</h1>
              <p className="text-muted-foreground lg:text-lg">Delivery details and customer information</p>
            </div>
          </div>

          {/* Order Content - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Restaurant Info */}
              <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm">
                    {restaurantLogo ? (
                      <img src={restaurantLogo} alt={`${order.restaurant} logo`} className="h-10 w-10 object-contain" />
                    ) : (
                      <Package className="h-6 w-6 text-accent" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground lg:text-xl">Order from {order.restaurant}</h2>
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
                  className="w-full font-medium text-white"
                  style={{ backgroundColor: '#29b6f6' }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e88e5'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#29b6f6'}
                  onClick={handleStartDelivery}
                >
                  Start Delivery
                </Button>
              </div>

              {/* Customer Location Map - Only for Beach and Pool deliveries */}
              {(order.deliveryType === "Beach Service" || order.deliveryType === "Poolside Service") && (
                <div className="bg-card shadow-soft border border-border overflow-hidden">
                  <div className="p-6 pb-0">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Customer Location</h3>
                  </div>
                  <div className="relative aspect-video">
                    <ResortImageView 
                      destination={order.deliveryAddress}
                      isDelivering={false}
                      focusArea={order.deliveryType === "Beach Service" ? 'beach' : 'pool'}
                    />
                  </div>
                </div>
              )}

              {/* Room Delivery Instructions - Only for Room deliveries */}
              {order.deliveryType === "Room Delivery" && (
                <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Room Delivery Instructions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Enter Main Lobby</p>
                        <p className="text-sm text-gray-600">Use the main entrance and approach the front desk area</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Take Elevator</p>
                        <p className="text-sm text-gray-600">
                          Go to Floor {Math.floor(parseInt(order.deliveryAddress.replace(/\D/g, '')) / 100) || 'X'}
                          {order.deliveryAddress.includes('0') && ' (Ground Floor)'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Follow Room Numbers</p>
                        <p className="text-sm text-gray-600">Look for room number signs in the hallway</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">4</div>
                      <div>
                        <p className="font-medium text-gray-900">Knock & Deliver</p>
                        <p className="text-sm text-gray-600">Announce "Room service delivery" and complete the order</p>
                      </div>
                    </div>
                  </div>

                  {/* Room Number Highlight */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-3">
                      <span className="text-2xl font-bold text-white">
                        {order.deliveryAddress.replace(/\D/g, '') || '###'}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Delivering to {order.deliveryAddress}</h4>
                  </div>

                  {/* Navigation Tips */}
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h5 className="font-medium text-amber-900 mb-2">💡 Navigation Tips</h5>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Room numbers ending in 01-20 are usually on the left side</li>
                      <li>• Room numbers ending in 21-40 are usually on the right side</li>
                      <li>• Look for directional arrows near elevators</li>
                      <li>• Ask front desk staff if you need assistance</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>

            {/* Customer & Order Details Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Delivery For</h3>
                  <Button 
                    className="font-medium text-white"
                    style={{ backgroundColor: '#29b6f6' }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e88e5'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#29b6f6'}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={order.customer.avatar} />
                    <AvatarFallback>GB</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-foreground">{order.customer.name}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Order Details</h3>
                
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="font-semibold text-foreground">${item.price}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.modifications}</p>
                      </div>
                    </div>
                  ))}

                  {order.specialNotes && (
                    <div className="bg-warning/10 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-warning/20 rounded-full flex items-center justify-center">
                          <span className="text-warning">📝</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Special Notes</p>
                          <p className="text-sm text-muted-foreground">{order.specialNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span className="text-foreground">+${order.processingFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Delivery Tips</span>
                      <span className="text-success">+${order.deliveryTips}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">+${order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation started - Show drawer for order details */}
        {navigationStarted && <OrderDetailsDrawer order={order} />}

      </div>

      {/* Full Screen Navigation Modal */}
      <Dialog open={showNavigationModal} onOpenChange={setShowNavigationModal}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 m-0 border-0">
          <DeliveryNavigation 
            destination={order.deliveryAddress}
            deliveryType={order.deliveryType}
            onComplete={handleNavigationComplete}
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

      {/* Room Delivery Status Bar */}
      {showRoomStatus && (
        <RoomDeliveryStatus 
          destination={order.deliveryAddress}
          onComplete={handleRoomDeliveryComplete}
        />
      )}
    </>
  );
};

export default OrderDetail;