import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, MapPin, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Mock order data - in real app would fetch based on orderId
  const order = {
    orderId: "#867899",
    restaurant: "Margarita Mama's",
    deliveryAddress: "Room N°12",
    deliveryTime: "July 21, 11:36AM",
    deliveryType: "Room Delivery",
    customer: {
      name: "Gretche Bergson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
    },
    items: [
      {
        name: "1x Fried Rice",
        price: 13.90,
        modifications: "Choice of Protein: Chicken ($2.00)"
      },
      {
        name: "2x Ham & Cheese Croissant", 
        price: 22.00,
        modifications: "Extra slices of cheese ($1.00)"
      }
    ],
    specialNotes: "Make sure to include free samples on every Order.",
    subtotal: 35.90,
    processingFee: 4.00,
    deliveryTips: 4.00,
    total: 39.90,
    earnings: {
      basePay: 10.80,
      customerTip: 24.80,
      additionalPay: 1.50,
      total: 39.90
    }
  };

  const handleStartDelivery = () => {
    // In real app, would update order status to "in progress"
    console.log("Starting delivery for", orderId);
  };

  const handleCompleteDelivery = () => {
    setShowCompletionModal(true);
  };

  const handleCompletionConfirm = () => {
    setShowCompletionModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-medium sticky top-0 z-50">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary-foreground">Order {order.orderId}</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Restaurant Info */}
        <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-accent">🍳</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">Order from {order.restaurant}</h2>
              <Badge variant="secondary" className="bg-accent/10 text-accent-foreground mt-1">
                {order.deliveryType}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="font-medium text-foreground">{order.deliveryAddress}</span>
              <span className="text-muted-foreground">•</span>
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-foreground">{order.deliveryTime}</span>
            </div>

            <Button 
              className="w-full bg-gradient-accent hover:bg-accent-hover text-accent-foreground font-medium"
              onClick={handleStartDelivery}
            >
              Start Delivery
            </Button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={order.customer.avatar} 
                alt={order.customer.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery For</p>
                <p className="font-semibold text-foreground">{order.customer.name}</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-accent/10 text-accent-foreground">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
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
                <span className="text-accent">Delivery Tips</span>
                <span className="text-accent">+${order.deliveryTips}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">+${order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Delivery Button */}
        <Button 
          className="w-full bg-success hover:bg-success/90 text-white font-medium"
          onClick={handleCompleteDelivery}
        >
          Complete Delivery
        </Button>
      </main>

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
                <span className="text-xl font-bold text-success">+${order.earnings.total}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Pay</span>
                  <span className="text-foreground">${order.earnings.basePay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Tip</span>
                  <span className="text-foreground">${order.earnings.customerTip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Additional Pay</span>
                  <span className="text-foreground">${order.earnings.additionalPay}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-accent hover:bg-accent-hover text-accent-foreground font-medium"
              onClick={handleCompletionConfirm}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;