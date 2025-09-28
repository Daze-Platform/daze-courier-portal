import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  User, 
  Package, 
  ArrowLeft, 
  MessageCircle,
  Check,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UnifiedHeader from '@/components/UnifiedHeader';
import DesktopSidebar from '@/components/DesktopSidebar';
import DeliveryNavigation from '@/components/DeliveryNavigation';
import OrderDetailsDrawer from '@/components/OrderDetailsDrawer';
import ResortImageView from '@/components/ResortImageView';
import RoomDeliveryStatus from '@/components/RoomDeliveryStatus';
import ChatInterface from '@/components/ChatInterface';
import margaritaMamasLogo from '@/assets/margarita-mamas-logo.png';
import sunsetGrillLogo from '@/assets/sunset-grill-logo.png';
import oceanBreezeLogo from '@/assets/ocean-breeze-logo.png';
import salDeMarLogo from '@/assets/sal-de-mar-logo.png';
import { useToast } from '@/hooks/use-toast';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get order data from navigation state or use fallback
  const orderFromState = location.state;
  
  // Modal states
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [showRoomStatus, setShowRoomStatus] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Navigation and delivery state
  const [navigationStarted, setNavigationStarted] = useState(false);

  // Mock order data as fallback
  const mockOrders = [
    {
      orderId: "12345678",
      restaurant: "Margarita Mama's",
      deliveryAddress: "Beach - Umbrella B7",
      deliveryTime: "2:45 PM",
      deliveryType: "Beach Service",
      customer: {
        name: "Grace Bennett",
        avatar: "/api/placeholder/40/40",
        phone: "+1 (555) 123-4567"
      },
      items: [
        { name: "Fish Tacos (2x)", price: 18.50, modifications: "Extra lime, No cilantro" },
        { name: "Frozen Margarita", price: 10.00, modifications: "Extra salt rim" },
      ],
      specialNotes: "Please knock loudly - customer is poolside and may not hear doorbell.",
      total: 28.50,
      earnings: {
        basePay: 8.50,
        customerTip: 5.75,
        additionalPay: 2.25,
        total: 16.50
      }
    }
  ];

  // Use order from state if available, otherwise use mock data
  const order = orderFromState || mockOrders.find(o => o.orderId === orderId) || mockOrders[0];

  // Update document title
  useLayoutEffect(() => {
    const originalTitle = document.title;
    document.title = `Order ${order.orderId} - Courier Portal`;
    return () => {
      document.title = originalTitle;
    };
  }, [order.orderId]);

  const handleStartDelivery = () => {
    if (order.deliveryType === "Room Delivery") {
      setNavigationStarted(true);
      setShowRoomStatus(true);
    } else {
      // For Beach/Pool deliveries, show navigation modal
      setNavigationStarted(true);
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
      variant: "success"
    });
    navigate("/");
  };

  const handleOpenChat = () => {
    setShowChatModal(true);
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

  const restaurantLogo = getRestaurantLogo(order.restaurant);

  return (
    <>
      <UnifiedHeader />
      <DesktopSidebar />

      {/* Main Content - Universal Browser Compatible */}
      <div className="bg-background lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 pb-32">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Order {order.orderId}</h1>
              <p className="text-muted-foreground">Delivery details and customer information</p>
            </div>
          </div>

          {/* Order Content - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Restaurant Info Card */}
              <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm flex-shrink-0">
                    {restaurantLogo ? (
                      <img src={restaurantLogo} alt={`${order.restaurant} logo`} className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <Package className="h-6 w-6 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-foreground">Order from {order.restaurant}</h2>
                    <div className="mt-1">
                      <Badge className="bg-accent text-white font-medium border-0">
                        {order.deliveryType}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="font-medium text-foreground">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{order.deliveryTime}</span>
                  </div>
                </div>

                {/* Start Delivery Button - Universal Fix */}
                <div className="pt-4">
                  <Button 
                    className="w-full font-medium text-white h-14 text-lg"
                    style={{ 
                      backgroundColor: navigationStarted && order.deliveryType === "Room Delivery" ? '#94a3b8' : '#29b6f6'
                    }}
                    onMouseEnter={(e) => {
                      if (!(navigationStarted && order.deliveryType === "Room Delivery")) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1e88e5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(navigationStarted && order.deliveryType === "Room Delivery")) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#29b6f6';
                      }
                    }}
                    onClick={handleStartDelivery}
                    disabled={navigationStarted && order.deliveryType === "Room Delivery"}
                  >
                    {navigationStarted && order.deliveryType === "Room Delivery" 
                      ? 'Delivery In Progress...' 
                      : 'Start Delivery'
                    }
                  </Button>
                </div>
              </div>

              {/* Customer Location Map - Only for Beach and Pool deliveries */}
              {(order.deliveryType === "Beach Service" || order.deliveryType === "Poolside Service") && (
                <div className="bg-card shadow-soft border border-border rounded-lg overflow-hidden">
                  <div className="p-6 pb-0">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Customer Location</h3>
                  </div>
                  <div className="relative aspect-video max-h-[300px] w-full overflow-hidden">
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
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">1</div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Enter Main Lobby</p>
                        <p className="text-sm text-gray-600">Use the main entrance and approach the front desk area</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">2</div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Take Elevator</p>
                         <p className="text-sm text-gray-600">
                           Go to Floor {Math.floor(parseInt(order.deliveryAddress.replace(/\D/g, '')) / 1000) || 1}
                         </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">3</div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Follow Room Numbers</p>
                        <p className="text-sm text-gray-600">Look for room number signs in the hallway</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="relative">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">4</div>
                      </div>
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
                    onClick={handleOpenChat}
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
                      <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-accent">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        {item.modifications && (
                          <div className="mt-1">
                            <span className="inline-block text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {item.modifications}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {order.specialNotes && (
                  <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                    <p className="text-sm font-medium text-amber-800 mb-1">Special Notes:</p>
                    <p className="text-sm text-amber-700">{order.specialNotes}</p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="font-semibold text-foreground">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Earnings</span>
                    <span className="font-semibold text-success">${order.earnings.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

      {/* Room Delivery Status Bar */}
      {showRoomStatus && (
        <RoomDeliveryStatus 
          destination={order.deliveryAddress}
          onComplete={handleRoomDeliveryComplete}
        />
      )}

      {/* Chat Modal */}
      <Dialog open={showChatModal} onOpenChange={(open) => !open && setShowChatModal(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <ChatInterface
            orderId={order.orderId}
            customerName={order.customer.name}
            onClose={() => setShowChatModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderDetail;