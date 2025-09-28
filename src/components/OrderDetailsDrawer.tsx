import { CheckCircle, Phone, MessageCircle, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer } from "vaul";
import { useState } from "react";

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
  customTrigger?: React.ReactNode;
}

const OrderDetailsDrawer = ({ order, customTrigger }: OrderDetailsDrawerProps) => {
  const [activeSnapPoint, setActiveSnapPoint] = useState<number | string | null>(customTrigger ? 0.3 : null);

  return (
    <Drawer.Root 
      snapPoints={[0.3, 0.7, 1]}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      dismissible={true}
      modal={false}
    >
      <Drawer.Trigger asChild>
        {customTrigger || (
          <div className="fixed bottom-0 left-0 right-0 z-60 cursor-pointer">
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
        )}
      </Drawer.Trigger>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-50 h-[100dvh] max-h-[100dvh]">
          {/* Drawer Handle */}
          <div className="flex-shrink-0 p-4 bg-background rounded-t-[10px] border-b border-border">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-4" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="text-xl font-semibold mb-2 text-foreground">Order Details</Drawer.Title>
              <p className="text-muted-foreground text-sm">
                {activeSnapPoint === 0.3 ? "Swipe up for more details" : activeSnapPoint === 0.7 ? "Swipe up for full details" : activeSnapPoint === 1 ? "Full order details" : ""}
              </p>
            </div>
          </div>
          
          {/* SCROLLABLE CONTENT - CRITICAL: This must scroll independently */}
          <div 
            className="flex-1 overflow-hidden"
            style={{
              height: 'calc(100dvh - 120px)',
              maxHeight: 'calc(100dvh - 120px)'
            }}
          >
            <div
              className="h-full px-4 py-4 overflow-y-scroll"
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                overscrollBehavior: 'contain'
              }}
            >
            {/* Customer Info */}
            <div className="bg-card rounded-lg p-4 border border-border mb-6">
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
            <div className="bg-card rounded-lg p-4 border border-border mb-6">
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

            {/* Additional Content for Full Scroll Test */}
            <div className="bg-card rounded-lg p-4 border border-border mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm">Order confirmed at {order.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-sm">Preparing order</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <span className="text-sm">Ready for pickup</span>
                </div>
              </div>
            </div>

            {/* Large bottom padding to ensure scrolling past earnings */}
            <div style={{ height: '200px', minHeight: '200px' }}></div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default OrderDetailsDrawer;