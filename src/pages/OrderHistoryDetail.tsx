import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, User, Mail, MessageSquare, CheckSquare, Package2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useIsPWA } from "@/hooks/use-is-pwa";
import margaritaMamasLogo from '@/assets/margarita-mamas-logo.png';
import salDeMarLogo from '@/assets/sal-de-mar-logo.png';
import oceanBreezeLogo from '@/assets/ocean-breeze-logo.png';
import sunsetGrillLogo from '@/assets/sunset-grill-logo.png';

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
  const isPWA = useIsPWA();
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Mock order details database - each order ID maps to specific details
  const getOrderDetails = (orderNumber: string): OrderDetail => {
    const orderDetailsMap: Record<string, OrderDetail> = {
      // December orders
      '1234646': {
        id: '1',
        orderNumber: '1234646',
        restaurantName: "Margarita Mama's",
        restaurantLogo: margaritaMamasLogo,
        status: 'delivered',
        deliveryAddress: 'Room Delivery',
        roomNumber: 'Room N°245',
        deliveryTime: '5:30 PM',
        deliveryDate: 'Thursday, December 6, 2024',
        customer: {
          name: 'Johny Smith',
          email: 'johnysmith@email.com'
        },
        items: [
          {
            id: '1',
            name: 'Chicken Burrito Bowl',
            price: 14.50,
            quantity: 1,
            modifications: ['Extra guacamole (+$2.00)', 'No beans']
          },
          {
            id: '2',
            name: 'Chips & Salsa',
            price: 4.50,
            quantity: 1,
            modifications: []
          }
        ],
        subtotal: 19.00,
        processingFee: 2.50,
        deliveryTips: 3.50,
        total: 25.00,
        specialNotes: 'Please knock softly - baby sleeping in room.'
      },
      '1234647': {
        id: '2',
        orderNumber: '1234647',
        restaurantName: 'Souvla-NoPa',
        restaurantLogo: salDeMarLogo,
        status: 'cancelled',
        deliveryAddress: 'Room Delivery',
        roomNumber: 'Room N°156',
        deliveryTime: '2:20 PM',
        deliveryDate: 'Sunday, December 15, 2024',
        customer: {
          name: 'Aaron Smith',
          email: 'aaron.smith@gmail.com'
        },
        items: [
          {
            id: '1',
            name: 'Greek Salad',
            price: 12.90,
            quantity: 1,
            modifications: ['Add grilled chicken (+$4.00)']
          }
        ],
        subtotal: 16.90,
        processingFee: 1.50,
        deliveryTips: 2.00,
        total: 20.40,
        specialNotes: 'Order was cancelled by customer due to dietary restrictions.'
      },
      '1234648': {
        id: '3',
        orderNumber: '1234648',
        restaurantName: 'Sal De Mar',
        restaurantLogo: oceanBreezeLogo,
        status: 'delivered',
        deliveryAddress: 'Room Delivery',
        roomNumber: 'Room N°789',
        deliveryTime: '7:45 PM',
        deliveryDate: 'Tuesday, December 3, 2024',
        customer: {
          name: 'Sarah Johnson',
          email: 'sarah.j@outlook.com'
        },
        items: [
          {
            id: '1',
            name: 'Truffle Mac & Cheese',
            price: 18.75,
            quantity: 1,
            modifications: ['Extra truffle (+$3.00)']
          },
          {
            id: '2',
            name: 'Caesar Salad',
            price: 11.50,
            quantity: 1,
            modifications: ['No croutons', 'Dressing on side']
          },
          {
            id: '3',
            name: 'Chocolate Lava Cake',
            price: 9.25,
            quantity: 1,
            modifications: []
          }
        ],
        subtotal: 42.50,
        processingFee: 3.25,
        deliveryTips: 8.50,
        total: 54.25,
        specialNotes: 'Anniversary dinner - please include complimentary dessert if available.'
      },
      // September orders
      '2340001': {
        id: '8',
        orderNumber: '2340001',
        restaurantName: "Margarita Mama's",
        restaurantLogo: margaritaMamasLogo,
        status: 'delivered',
        deliveryAddress: 'Pool Service',
        roomNumber: 'Pool Deck - Cabana 12',
        deliveryTime: '11:30 AM',
        deliveryDate: 'Sunday, September 1, 2025',
        customer: {
          name: 'Alex Rodriguez',
          email: 'alex.rodriguez@yahoo.com'
        },
        items: [
          {
            id: '1',
            name: 'Fish Tacos',
            price: 16.90,
            quantity: 3,
            modifications: ['Corn tortillas', 'Extra lime']
          },
          {
            id: '2',
            name: 'Frozen Margarita',
            price: 12.00,
            quantity: 2,
            modifications: ['Salt rim', 'On the rocks']
          }
        ],
        subtotal: 74.70,
        processingFee: 4.50,
        deliveryTips: 12.00,
        total: 91.20,
        specialNotes: 'Pool party order - please bring extra napkins and ice.'
      },
      '2340002': {
        id: '9',
        orderNumber: '2340002',
        restaurantName: 'Sunset Grill',
        restaurantLogo: sunsetGrillLogo,
        status: 'delivered',
        deliveryAddress: 'Beach Service',
        roomNumber: 'Beach - Umbrella B15',
        deliveryTime: '6:45 PM',
        deliveryDate: 'Sunday, September 1, 2025',
        customer: {
          name: 'Maria Garcia',
          email: 'maria.garcia@email.com'
        },
        items: [
          {
            id: '1',
            name: 'Grilled Salmon',
            price: 28.50,
            quantity: 1,
            modifications: ['Medium doneness', 'Lemon butter sauce']
          },
          {
            id: '2',
            name: 'Roasted Vegetables',
            price: 14.25,
            quantity: 1,
            modifications: ['No bell peppers']
          },
          {
            id: '3',
            name: 'White Wine',
            price: 15.00,
            quantity: 1,
            modifications: ['Chilled', 'Sauvignon Blanc']
          }
        ],
        subtotal: 57.75,
        processingFee: 4.25,
        deliveryTips: 11.50,
        total: 73.50,
        specialNotes: 'Sunset dinner by the beach - please deliver before 7 PM.'
      },
      '2340003': {
        id: '10',
        orderNumber: '2340003',
        restaurantName: 'Ocean Breeze',
        restaurantLogo: oceanBreezeLogo,
        status: 'delivered',
        deliveryAddress: 'Room Delivery',
        roomNumber: 'Room N°102',
        deliveryTime: '12:15 PM',
        deliveryDate: 'Monday, September 2, 2025',
        customer: {
          name: 'David Thompson',
          email: 'david.t@protonmail.com'
        },
        items: [
          {
            id: '1',
            name: 'Seafood Chowder',
            price: 16.75,
            quantity: 1,
            modifications: ['Extra bread roll']
          },
          {
            id: '2',
            name: 'Club Sandwich',
            price: 13.50,
            quantity: 1,
            modifications: ['Whole wheat bread', 'No mayo']
          },
          {
            id: '3',
            name: 'Fresh Fruit Bowl',
            price: 8.90,
            quantity: 1,
            modifications: []
          }
        ],
        subtotal: 39.15,
        processingFee: 3.00,
        deliveryTips: 6.25,
        total: 48.40,
        specialNotes: 'Lunch meeting - please deliver quietly.'
      },
      '2340004': {
        id: '11',
        orderNumber: '2340004',
        restaurantName: 'Sal de Mar',
        restaurantLogo: salDeMarLogo,
        status: 'cancelled',
        deliveryAddress: 'Room Delivery',
        roomNumber: 'Room N°567',
        deliveryTime: '7:20 PM',
        deliveryDate: 'Monday, September 2, 2025',
        customer: {
          name: 'Jennifer Lee',
          email: 'jlee@company.com'
        },
        items: [
          {
            id: '1',
            name: 'Paella Valenciana',
            price: 32.00,
            quantity: 1,
            modifications: ['No seafood', 'Extra saffron']
          }
        ],
        subtotal: 32.00,
        processingFee: 2.50,
        deliveryTips: 5.00,
        total: 39.50,
        specialNotes: 'Order cancelled - customer had to leave hotel unexpectedly.'
      },
      '2340005': {
        id: '12',
        orderNumber: '2340005',
        restaurantName: "Margarita Mama's",
        restaurantLogo: margaritaMamasLogo,
        status: 'delivered',
        deliveryAddress: 'Room Delivery',
        roomNumber: 'Room N°890',
        deliveryTime: '1:30 PM',
        deliveryDate: 'Tuesday, September 3, 2025',
        customer: {
          name: 'Robert Brown',
          email: 'rob.brown@webmail.com'
        },
        items: [
          {
            id: '1',
            name: 'Carnitas Quesadilla',
            price: 15.90,
            quantity: 2,
            modifications: ['Extra cheese', 'Sour cream on side']
          },
          {
            id: '2',
            name: 'Mexican Beer',
            price: 6.50,
            quantity: 3,
            modifications: ['Corona', 'With lime']
          }
        ],
        subtotal: 51.30,
        processingFee: 3.75,
        deliveryTips: 8.00,
        total: 63.05,
        specialNotes: 'Watching the game - please deliver during halftime if possible.'
      },
      '2340006': {
        id: '13',
        orderNumber: '2340006',
        restaurantName: 'Sunset Grill',
        restaurantLogo: sunsetGrillLogo,
        status: 'delivered',
        deliveryAddress: 'Beach Service',
        roomNumber: 'Beach - Umbrella D8',
        deliveryTime: '8:10 PM',
        deliveryDate: 'Tuesday, September 3, 2025',
        customer: {
          name: 'Lisa Wilson',
          email: 'lisa.wilson@email.com'
        },
        items: [
          {
            id: '1',
            name: 'Grilled Mahi-Mahi',
            price: 26.50,
            quantity: 1,
            modifications: ['Grilled, not fried', 'Extra lemon']
          },
          {
            id: '2',
            name: 'Tropical Salad',
            price: 14.75,
            quantity: 1,
            modifications: ['No onions', 'Mango dressing']
          },
          {
            id: '3',
            name: 'Coconut Water',
            price: 4.50,
            quantity: 2,
            modifications: []
          }
        ],
        subtotal: 50.25,
        processingFee: 3.75,
        deliveryTips: 10.00,
        total: 64.00,
        specialNotes: 'Beach sunset dinner - please deliver before dark.'
      },
      '2340007': {
        id: '14',
        orderNumber: '2340007',
        restaurantName: 'Ocean Breeze',
        restaurantLogo: oceanBreezeLogo,
        status: 'delivered',
        deliveryAddress: 'Pool Service',
        roomNumber: 'Pool Deck - Cabana 9',
        deliveryTime: '2:45 PM',
        deliveryDate: 'Wednesday, September 4, 2025',
        customer: {
          name: 'Michael Johnson',
          email: 'mjohnson@company.com'
        },
        items: [
          {
            id: '1',
            name: 'Pool Burger',
            price: 18.90,
            quantity: 1,
            modifications: ['Medium rare', 'No pickles']
          },
          {
            id: '2',
            name: 'Sweet Potato Fries',
            price: 8.50,
            quantity: 1,
            modifications: ['Extra crispy']
          },
          {
            id: '3',
            name: 'Ice Cold Beer',
            price: 6.75,
            quantity: 2,
            modifications: ['IPA', 'Extra cold']
          }
        ],
        subtotal: 41.40,
        processingFee: 3.25,
        deliveryTips: 7.50,
        total: 52.15,
        specialNotes: 'Pool party - please bring extra napkins.'
      },
      '2340008': {
        id: '15',
        orderNumber: '2340008',
        restaurantName: 'Sal de Mar',
        restaurantLogo: salDeMarLogo,
        status: 'delivered',
        deliveryAddress: 'Beach Service',
        roomNumber: 'Beach - Umbrella A12',
        deliveryTime: '7:55 PM',
        deliveryDate: 'Wednesday, September 4, 2025',
        customer: {
          name: 'Ashley Davis',
          email: 'ashley.davis@email.com'
        },
        items: [
          {
            id: '1',
            name: 'Seafood Paella',
            price: 34.00,
            quantity: 1,
            modifications: ['Extra saffron', 'No mussels']
          },
          {
            id: '2',
            name: 'Sangria Pitcher',
            price: 28.50,
            quantity: 1,
            modifications: ['Red sangria', 'Extra fruit']
          }
        ],
        subtotal: 62.50,
        processingFee: 4.75,
        deliveryTips: 12.50,
        total: 79.75,
        specialNotes: 'Romantic beach dinner - please include candles if available.'
      }
    };

    // Return specific order details or fallback to first order
    return orderDetailsMap[orderNumber] || orderDetailsMap['1234646'];
  };

  const orderDetail = getOrderDetails(orderId || '1');

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
      <div className={`lg:ml-64 bg-primary ${isPWA ? 'pt-[110px] lg:pt-[64px]' : 'pt-[90px] lg:pt-[48px]'}`}>
        <div className={`bg-background container mx-auto px-4 space-y-6 lg:px-3 ${isPWA ? 'py-4 lg:pt-4 lg:pb-4' : 'py-2 lg:pt-2 lg:pb-4'}`}>
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
                    <Badge className={`${
                      orderDetail.deliveryAddress.includes('Room') 
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' 
                        : orderDetail.deliveryAddress.includes('Pool')
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        : 'bg-green-100 text-green-800 hover:bg-green-100'
                    }`}>
                      {orderDetail.deliveryAddress.includes('Room') 
                        ? '🏨 Room Delivery' 
                        : orderDetail.deliveryAddress.includes('Pool')
                        ? '🏊 Pool Service'
                        : '🏖️ Beach Service'}
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