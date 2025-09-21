import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, User, Mail, MessageSquare, CheckSquare, Package2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import margaritaMamasLogo from '@/assets/margarita-mamas-logo.png';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifications?: string[];
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantLogo: string;
  status: 'delivered' | 'cancelled' | 'pending';
  deliveryAddress: string;
  roomNumber: string;
  deliveryTime: string;
  deliveryDate: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  items: OrderItem[];
  subtotal: number;
  processingFee: number;
  deliveryTips: number;
  total: number;
  specialNotes?: string;
}

const OrderHistoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Sample order detail data based on Figma
  const orderDetail: OrderDetail = {
    id: orderId || '1',
    orderNumber: '861959',
    restaurantName: "Margarita Mama's",
    restaurantLogo: margaritaMamasLogo,
    status: 'delivered',
    deliveryAddress: 'Room Delivery',
    roomNumber: 'Room N°12345',
    deliveryTime: '11:36AM',
    deliveryDate: 'Tuesday, July 21, 2021',
    customer: {
      name: 'Gretchen Bergson',
      email: 'gretchenberg50@daze.com'
    },
    items: [
      {
        id: '1',
        name: 'Fried Rice',
        price: 13.90,
        quantity: 1,
        modifications: ['Choice of Protein: Chicken ($2.00)']
      },
      {
        id: '2',
        name: 'Ham & Cheese Croissant',
        price: 22.00,
        quantity: 2,
        modifications: ['Extra slices of cheese ($1.00)']
      }
    ],
    subtotal: 35.90,
    processingFee: 4.00,
    deliveryTips: 4.00,
    total: 39.90,
    specialNotes: 'Make sure to include free samples on every Order.'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">✗ Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⏳ Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
          {/* Back Button and Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/order-history')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to History
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Order #{orderDetail.orderNumber}</h1>
          </div>

          {/* Restaurant Info Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <img 
                    src={orderDetail.restaurantLogo} 
                    alt={orderDetail.restaurantName}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Order from {orderDetail.restaurantName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                      🏨 Room Delivery
                    </Badge>
                    {getStatusBadge(orderDetail.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Info - Combined Card */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Delivery Address */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
                      <p className="font-semibold">{orderDetail.roomNumber}</p>
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Delivery Time</p>
                      <p className="font-semibold">{orderDetail.deliveryDate}</p>
                      <p className="text-sm text-muted-foreground">{orderDetail.deliveryTime}</p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                      {orderDetail.customer.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Customer</p>
                      <p className="font-semibold">{orderDetail.customer.name}</p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{orderDetail.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package2 className="w-5 h-5" />
                    <span>Order Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderDetail.items.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckSquare className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                      {item.modifications && item.modifications.map((mod, index) => (
                        <p key={index} className="text-sm text-muted-foreground ml-6">
                          {mod}
                        </p>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {orderDetail.specialNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>Special Notes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-accent/20 border border-accent/30 rounded-lg p-3">
                      <p className="text-sm">{orderDetail.specialNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Summary */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderDetail.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span>+${orderDetail.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span>Delivery Tips</span>
                    <span>+${orderDetail.deliveryTips.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>+${orderDetail.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryDetail;