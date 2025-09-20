import { CheckCircle, Phone, MessageCircle, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface OrderDetailsDrawerProps {
  order: {
    orderId: string;
    restaurant: string;
    deliveryAddress: string;
    deliveryTime: string;
    deliveryType: string;
    customer: {
      name: string;
      avatar: string;
      phone: string;
    };
    items: Array<{
      name: string;
      price: number;
      modifications: string;
    }>;
    specialNotes?: string;
    total: number;
    earnings: {
      basePay: number;
      customerTip: number;
      additionalPay: number;
      total: number;
    };
  };
}

const OrderDetailsDrawer = ({ order }: OrderDetailsDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-white/95 backdrop-blur-sm border-t border-border p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={order.customer.avatar} />
                  <AvatarFallback>GB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white">
                  ${order.earnings.total}
                </Badge>
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="pb-4 flex-shrink-0">
          <DrawerTitle className="text-xl font-semibold">Order Details</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-6 pb-40 space-y-6 overflow-y-auto flex-1 min-h-0">
          {/* Customer Info */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Delivery For</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button 
                  className="font-medium text-white bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={order.customer.avatar} />
                <AvatarFallback>GB</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Delivery Address:</p>
              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Items ({order.items.length})</h3>
            
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
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-400 rounded-lg p-3 shadow-sm mt-4">
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 text-sm">💬</span>
                    </div>
                    <div>
                      <p className="font-medium text-amber-800 text-sm">Special Instructions</p>
                      <p className="text-sm text-amber-700 leading-relaxed font-medium bg-white/60 p-2 rounded border border-amber-200 mt-1">
                        {order.specialNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Total */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="text-foreground">${order.total}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                  <span className="text-foreground">Your Earnings</span>
                  <span className="text-success">+${order.earnings.total}</span>
                </div>
                
                <div className="space-y-1 text-sm mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Pay</span>
                    <span className="text-foreground">${order.earnings.basePay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer Tip</span>
                    <span className="text-success font-medium">${order.earnings.customerTip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Additional Pay</span>
                    <span className="text-foreground">${order.earnings.additionalPay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderDetailsDrawer;