import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Package, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import margaritaMamasLogo from '@/assets/margarita-mamas-logo.png';
import salDeMarLogo from '@/assets/sal-de-mar-logo.png';
import oceanBreezeLogo from '@/assets/ocean-breeze-logo.png';
import sunsetGrillLogo from '@/assets/sunset-grill-logo.png';

interface Order {
  id: string;
  restaurantName: string;
  restaurantLogo: string;
  status: 'delivered' | 'cancelled' | 'pending';
  orderId: string;
  customer: string;
  deliveryFee: number;
  date: string;
  time: string;
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('May 8, 2021 - Oct 8, 2021');

  // Sample order data based on the Figma design
  const orders: Order[] = [
    {
      id: '1',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '1234646',
      customer: 'Johny Smith',
      deliveryFee: 12.50,
      date: 'May 6, 2021',
      time: '17:30 PM'
    },
    {
      id: '2',
      restaurantName: 'Souvla-NoPa',
      restaurantLogo: salDeMarLogo,
      status: 'cancelled',
      orderId: '1234646',
      customer: 'Aaron Smith',
      deliveryFee: 9.10,
      date: 'May 6, 2021',
      time: '17:30 PM'
    },
    {
      id: '3',
      restaurantName: 'Cheese Kitchen',
      restaurantLogo: oceanBreezeLogo,
      status: 'cancelled',
      orderId: '1234646',
      customer: 'Aaron Smith',
      deliveryFee: 9.10,
      date: 'May 6, 2021',
      time: '17:30 PM'
    }
  ];

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

  const handleOrderClick = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 flex items-center justify-center">
        <Package className="w-16 h-16 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No deliveries yet</h3>
      <p className="text-muted-foreground text-center max-w-sm">
        Go ahead, order some items from menu and enjoy.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Order History</h1>
            <p className="text-muted-foreground lg:text-lg">View your past delivery assignments</p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order History
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateRange}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleOrderClick(order.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          <img 
                            src={order.restaurantLogo} 
                            alt={order.restaurantName}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{order.restaurantName}</h4>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>#{order.orderId}</span>
                            <span>{order.customer}</span>
                            <span>${order.deliveryFee.toFixed(2)}</span>
                            <span>{order.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;