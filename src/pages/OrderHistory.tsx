import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Package, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO, startOfMonth } from 'date-fns';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import DateRangePicker from "@/components/DateRangePicker";
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
  dateTime: Date; // Add datetime for filtering
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 8, 1), // September 1, 2024
    to: new Date(2024, 8, 20), // September 20, 2024
  });

  // Sample order data with actual datetime objects for filtering
  const allOrders: Order[] = [
    // December orders
    {
      id: '1',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '1234646',
      customer: 'Johny Smith',
      deliveryFee: 12.50,
      date: 'Dec 6, 2024',
      time: '17:30 PM',
      dateTime: new Date(2024, 11, 6, 17, 30)
    },
    {
      id: '2',
      restaurantName: 'Souvla-NoPa',
      restaurantLogo: salDeMarLogo,
      status: 'cancelled',
      orderId: '1234647',
      customer: 'Aaron Smith',
      deliveryFee: 9.10,
      date: 'Dec 15, 2024',
      time: '14:20 PM',
      dateTime: new Date(2024, 11, 15, 14, 20)
    },
    {
      id: '3',
      restaurantName: 'Cheese Kitchen',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '1234648',
      customer: 'Sarah Johnson',
      deliveryFee: 15.75,
      date: 'Dec 3, 2024',
      time: '19:45 PM',
      dateTime: new Date(2024, 11, 3, 19, 45)
    },
    {
      id: '4',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '1234649',
      customer: 'Mike Wilson',
      deliveryFee: 11.25,
      date: 'Dec 22, 2024',
      time: '12:15 PM',
      dateTime: new Date(2024, 11, 22, 12, 15)
    },
    {
      id: '5',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'pending',
      orderId: '1234650',
      customer: 'Emma Davis',
      deliveryFee: 13.00,
      date: 'Dec 18, 2024',
      time: '18:00 PM',
      dateTime: new Date(2024, 11, 18, 18, 0)
    },
    {
      id: '6',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '1234651',
      customer: 'John Doe',
      deliveryFee: 14.25,
      date: 'Dec 20, 2024',
      time: '16:30 PM',
      dateTime: new Date(2024, 11, 20, 16, 30)
    },
    {
      id: '7',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '1234652',
      customer: 'Jane Smith',
      deliveryFee: 10.75,
      date: 'Dec 21, 2024',
      time: '13:45 PM',
      dateTime: new Date(2024, 11, 21, 13, 45)
    },
    
    // September orders (Sep 1-20)
    {
      id: '8',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340001',
      customer: 'Alex Rodriguez',
      deliveryFee: 14.50,
      date: 'Sep 1, 2024',
      time: '11:30 AM',
      dateTime: new Date(2024, 8, 1, 11, 30)
    },
    {
      id: '9',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340002',
      customer: 'Maria Garcia',
      deliveryFee: 16.75,
      date: 'Sep 1, 2024',
      time: '18:45 PM',
      dateTime: new Date(2024, 8, 1, 18, 45)
    },
    {
      id: '10',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340003',
      customer: 'David Thompson',
      deliveryFee: 12.25,
      date: 'Sep 2, 2024',
      time: '12:15 PM',
      dateTime: new Date(2024, 8, 2, 12, 15)
    },
    {
      id: '11',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'cancelled',
      orderId: '2340004',
      customer: 'Jennifer Lee',
      deliveryFee: 9.50,
      date: 'Sep 2, 2024',
      time: '19:20 PM',
      dateTime: new Date(2024, 8, 2, 19, 20)
    },
    {
      id: '12',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340005',
      customer: 'Robert Brown',
      deliveryFee: 13.75,
      date: 'Sep 3, 2024',
      time: '13:30 PM',
      dateTime: new Date(2024, 8, 3, 13, 30)
    },
    {
      id: '13',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340006',
      customer: 'Lisa Wilson',
      deliveryFee: 15.00,
      date: 'Sep 3, 2024',
      time: '20:10 PM',
      dateTime: new Date(2024, 8, 3, 20, 10)
    },
    {
      id: '14',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340007',
      customer: 'Michael Johnson',
      deliveryFee: 11.25,
      date: 'Sep 4, 2024',
      time: '14:45 PM',
      dateTime: new Date(2024, 8, 4, 14, 45)
    },
    {
      id: '15',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340008',
      customer: 'Ashley Davis',
      deliveryFee: 17.25,
      date: 'Sep 4, 2024',
      time: '19:55 PM',
      dateTime: new Date(2024, 8, 4, 19, 55)
    },
    {
      id: '16',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340009',
      customer: 'Christopher Miller',
      deliveryFee: 10.50,
      date: 'Sep 5, 2024',
      time: '12:00 PM',
      dateTime: new Date(2024, 8, 5, 12, 0)
    },
    {
      id: '17',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340010',
      customer: 'Amanda Clark',
      deliveryFee: 14.75,
      date: 'Sep 5, 2024',
      time: '18:30 PM',
      dateTime: new Date(2024, 8, 5, 18, 30)
    },
    {
      id: '18',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'cancelled',
      orderId: '2340011',
      customer: 'Kevin Rodriguez',
      deliveryFee: 8.75,
      date: 'Sep 6, 2024',
      time: '11:45 AM',
      dateTime: new Date(2024, 8, 6, 11, 45)
    },
    {
      id: '19',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340012',
      customer: 'Nicole White',
      deliveryFee: 16.50,
      date: 'Sep 6, 2024',
      time: '19:15 PM',
      dateTime: new Date(2024, 8, 6, 19, 15)
    },
    {
      id: '20',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340013',
      customer: 'Daniel Martinez',
      deliveryFee: 12.00,
      date: 'Sep 7, 2024',
      time: '13:20 PM',
      dateTime: new Date(2024, 8, 7, 13, 20)
    },
    {
      id: '21',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340014',
      customer: 'Rachel Thompson',
      deliveryFee: 13.25,
      date: 'Sep 7, 2024',
      time: '20:00 PM',
      dateTime: new Date(2024, 8, 7, 20, 0)
    },
    {
      id: '22',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340015',
      customer: 'Brian Anderson',
      deliveryFee: 15.75,
      date: 'Sep 8, 2024',
      time: '12:30 PM',
      dateTime: new Date(2024, 8, 8, 12, 30)
    },
    {
      id: '23',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340016',
      customer: 'Stephanie Taylor',
      deliveryFee: 11.75,
      date: 'Sep 8, 2024',
      time: '18:45 PM',
      dateTime: new Date(2024, 8, 8, 18, 45)
    },
    {
      id: '24',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340017',
      customer: 'Gregory Wilson',
      deliveryFee: 14.00,
      date: 'Sep 9, 2024',
      time: '11:15 AM',
      dateTime: new Date(2024, 8, 9, 11, 15)
    },
    {
      id: '25',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'cancelled',
      orderId: '2340018',
      customer: 'Heather Moore',
      deliveryFee: 9.25,
      date: 'Sep 9, 2024',
      time: '19:30 PM',
      dateTime: new Date(2024, 8, 9, 19, 30)
    },
    {
      id: '26',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340019',
      customer: 'Justin Jackson',
      deliveryFee: 16.25,
      date: 'Sep 10, 2024',
      time: '14:00 PM',
      dateTime: new Date(2024, 8, 10, 14, 0)
    },
    {
      id: '27',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340020',
      customer: 'Melissa White',
      deliveryFee: 12.75,
      date: 'Sep 10, 2024',
      time: '20:15 PM',
      dateTime: new Date(2024, 8, 10, 20, 15)
    },
    {
      id: '28',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340021',
      customer: 'Ryan Harris',
      deliveryFee: 13.50,
      date: 'Sep 11, 2024',
      time: '12:45 PM',
      dateTime: new Date(2024, 8, 11, 12, 45)
    },
    {
      id: '29',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340022',
      customer: 'Kimberly Martin',
      deliveryFee: 15.50,
      date: 'Sep 11, 2024',
      time: '18:20 PM',
      dateTime: new Date(2024, 8, 11, 18, 20)
    },
    {
      id: '30',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340023',
      customer: 'Jonathan Lee',
      deliveryFee: 10.25,
      date: 'Sep 12, 2024',
      time: '11:00 AM',
      dateTime: new Date(2024, 8, 12, 11, 0)
    },
    {
      id: '31',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340024',
      customer: 'Laura Garcia',
      deliveryFee: 17.75,
      date: 'Sep 12, 2024',
      time: '19:45 PM',
      dateTime: new Date(2024, 8, 12, 19, 45)
    },
    {
      id: '32',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340025',
      customer: 'Mark Robinson',
      deliveryFee: 11.50,
      date: 'Sep 13, 2024',
      time: '13:10 PM',
      dateTime: new Date(2024, 8, 13, 13, 10)
    },
    {
      id: '33',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340026',
      customer: 'Patricia Clark',
      deliveryFee: 14.25,
      date: 'Sep 13, 2024',
      time: '20:30 PM',
      dateTime: new Date(2024, 8, 13, 20, 30)
    },
    {
      id: '34',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'cancelled',
      orderId: '2340027',
      customer: 'Eric Lewis',
      deliveryFee: 7.75,
      date: 'Sep 14, 2024',
      time: '12:20 PM',
      dateTime: new Date(2024, 8, 14, 12, 20)
    },
    {
      id: '35',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340028',
      customer: 'Samantha Walker',
      deliveryFee: 16.00,
      date: 'Sep 14, 2024',
      time: '18:55 PM',
      dateTime: new Date(2024, 8, 14, 18, 55)
    },
    {
      id: '36',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340029',
      customer: 'Thomas Hall',
      deliveryFee: 12.25,
      date: 'Sep 15, 2024',
      time: '11:40 AM',
      dateTime: new Date(2024, 8, 15, 11, 40)
    },
    {
      id: '37',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340030',
      customer: 'Nancy Allen',
      deliveryFee: 15.25,
      date: 'Sep 15, 2024',
      time: '19:10 PM',
      dateTime: new Date(2024, 8, 15, 19, 10)
    },
    {
      id: '38',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340031',
      customer: 'Steven Young',
      deliveryFee: 13.75,
      date: 'Sep 16, 2024',
      time: '14:25 PM',
      dateTime: new Date(2024, 8, 16, 14, 25)
    },
    {
      id: '39',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340032',
      customer: 'Karen Hernandez',
      deliveryFee: 11.00,
      date: 'Sep 16, 2024',
      time: '20:40 PM',
      dateTime: new Date(2024, 8, 16, 20, 40)
    },
    {
      id: '40',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340033',
      customer: 'Paul King',
      deliveryFee: 14.75,
      date: 'Sep 17, 2024',
      time: '12:55 PM',
      dateTime: new Date(2024, 8, 17, 12, 55)
    },
    {
      id: '41',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340034',
      customer: 'Betty Wright',
      deliveryFee: 16.75,
      date: 'Sep 17, 2024',
      time: '18:05 PM',
      dateTime: new Date(2024, 8, 17, 18, 5)
    },
    {
      id: '42',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340035',
      customer: 'Harold Lopez',
      deliveryFee: 9.75,
      date: 'Sep 18, 2024',
      time: '11:25 AM',
      dateTime: new Date(2024, 8, 18, 11, 25)
    },
    {
      id: '43',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'cancelled',
      orderId: '2340036',
      customer: 'Donna Hill',
      deliveryFee: 8.50,
      date: 'Sep 18, 2024',
      time: '19:35 PM',
      dateTime: new Date(2024, 8, 18, 19, 35)
    },
    {
      id: '44',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340037',
      customer: 'Gary Scott',
      deliveryFee: 13.00,
      date: 'Sep 19, 2024',
      time: '13:50 PM',
      dateTime: new Date(2024, 8, 19, 13, 50)
    },
    {
      id: '45',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340038',
      customer: 'Sandra Green',
      deliveryFee: 15.75,
      date: 'Sep 19, 2024',
      time: '20:25 PM',
      dateTime: new Date(2024, 8, 19, 20, 25)
    },
    {
      id: '46',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340039',
      customer: 'Edward Adams',
      deliveryFee: 12.50,
      date: 'Sep 20, 2024',
      time: '12:10 PM',
      dateTime: new Date(2024, 8, 20, 12, 10)
    },
    {
      id: '47',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340040',
      customer: 'Cynthia Baker',
      deliveryFee: 17.00,
      date: 'Sep 20, 2024',
      time: '18:40 PM',
      dateTime: new Date(2024, 8, 20, 18, 40)
    }
  ];

  // Filter orders based on date range
  const filteredOrders = allOrders.filter((order) => {
    if (!dateRange?.from) return true;
    
    // Debug logging
    console.log('Date range:', { from: dateRange?.from, to: dateRange?.to });
    console.log('Order date:', order.dateTime);
    
    if (dateRange.to) {
      const isWithin = isWithinInterval(order.dateTime, {
        start: dateRange.from,
        end: dateRange.to,
      });
      console.log('Order within interval:', isWithin, order.orderId);
      return isWithin;
    }
    
    return order.dateTime >= dateRange.from;
  });

  const orders = filteredOrders;

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
                <DateRangePicker
                  date={dateRange}
                  onDateChange={setDateRange}
                  placeholder="Select date range"
                />
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