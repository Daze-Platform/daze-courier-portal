import React, { useState, useEffect } from 'react';
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
import { useIsPWA } from "@/hooks/use-is-pwa";
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
  deliveryAddress: string;
  deliveryType: 'Room Delivery' | 'Pool Service' | 'Beach Service';
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const isPWA = useIsPWA();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 8, 1), // September 1, 2025
    to: new Date(2025, 8, 20), // September 20, 2025
  });

  // Scroll to top when component mounts
  useEffect(() => {
    // Use setTimeout to ensure component is fully rendered
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Immediate scroll
    scrollToTop();
    
    // Delayed scroll to ensure layout is complete
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

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
      dateTime: new Date(2024, 11, 6, 17, 30),
      deliveryAddress: 'Room N°245',
      deliveryType: 'Room Delivery'
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
      dateTime: new Date(2024, 11, 15, 14, 20),
      deliveryAddress: 'Room N°156',
      deliveryType: 'Room Delivery'
    },
    {
      id: '3',
      restaurantName: 'Sal De Mar',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '1234648',
      customer: 'Sarah Johnson',
      deliveryFee: 15.75,
      date: 'Dec 3, 2024',
      time: '19:45 PM',
      dateTime: new Date(2024, 11, 3, 19, 45),
      deliveryAddress: 'Room N°789',
      deliveryType: 'Room Delivery'
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
      dateTime: new Date(2024, 11, 22, 12, 15),
      deliveryAddress: 'Pool Deck - Cabana 3',
      deliveryType: 'Pool Service'
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
      dateTime: new Date(2024, 11, 18, 18, 0),
      deliveryAddress: 'Beach - Umbrella A5',
      deliveryType: 'Beach Service'
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
      dateTime: new Date(2024, 11, 20, 16, 30),
      deliveryAddress: 'Pool Deck - Cabana 7',
      deliveryType: 'Pool Service'
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
      dateTime: new Date(2024, 11, 21, 13, 45),
      deliveryAddress: 'Beach - Umbrella C2',
      deliveryType: 'Beach Service'
    },
    
    // September orders (Sep 1-20, 2025)
    {
      id: '8',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340001',
      customer: 'Alex Rodriguez',
      deliveryFee: 14.50,
      date: 'Sep 1, 2025',
      time: '11:30 AM',
      dateTime: new Date(2025, 8, 1, 11, 30),
      deliveryAddress: 'Pool Deck - Cabana 12',
      deliveryType: 'Pool Service'
    },
    {
      id: '9',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340002',
      customer: 'Maria Garcia',
      deliveryFee: 16.75,
      date: 'Sep 1, 2025',
      time: '18:45 PM',
      dateTime: new Date(2025, 8, 1, 18, 45),
      deliveryAddress: 'Beach - Umbrella B15',
      deliveryType: 'Beach Service'
    },
    {
      id: '10',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340003',
      customer: 'David Thompson',
      deliveryFee: 12.25,
      date: 'Sep 2, 2025',
      time: '12:15 PM',
      dateTime: new Date(2025, 8, 2, 12, 15),
      deliveryAddress: 'Room N°102',
      deliveryType: 'Room Delivery'
    },
    {
      id: '11',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'cancelled',
      orderId: '2340004',
      customer: 'Jennifer Lee',
      deliveryFee: 9.50,
      date: 'Sep 2, 2025',
      time: '19:20 PM',
      dateTime: new Date(2025, 8, 2, 19, 20),
      deliveryAddress: 'Room N°567',
      deliveryType: 'Room Delivery'
    },
    {
      id: '12',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340005',
      customer: 'Robert Brown',
      deliveryFee: 13.75,
      date: 'Sep 3, 2025',
      time: '13:30 PM',
      dateTime: new Date(2025, 8, 3, 13, 30),
      deliveryAddress: 'Room N°890',
      deliveryType: 'Room Delivery'
    },
    {
      id: '13',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340006',
      customer: 'Lisa Wilson',
      deliveryFee: 15.00,
      date: 'Sep 3, 2025',
      time: '20:10 PM',
      dateTime: new Date(2025, 8, 3, 20, 10),
      deliveryAddress: 'Beach - Umbrella D8',
      deliveryType: 'Beach Service'
    },
    {
      id: '14',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340007',
      customer: 'Michael Johnson',
      deliveryFee: 11.25,
      date: 'Sep 4, 2025',
      time: '14:45 PM',
      dateTime: new Date(2025, 8, 4, 14, 45),
      deliveryAddress: 'Pool Deck - Cabana 9',
      deliveryType: 'Pool Service'
    },
    {
      id: '15',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340008',
      customer: 'Ashley Davis',
      deliveryFee: 17.25,
      date: 'Sep 4, 2025',
      time: '19:55 PM',
      dateTime: new Date(2025, 8, 4, 19, 55),
      deliveryAddress: 'Beach - Umbrella A12',
      deliveryType: 'Beach Service'
    },
    {
      id: '16',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340009',
      customer: 'Christopher Miller',
      deliveryFee: 10.50,
      date: 'Sep 5, 2025',
      time: '12:00 PM',
      dateTime: new Date(2025, 8, 5, 12, 0),
      deliveryAddress: 'Room N°334',
      deliveryType: 'Room Delivery'
    },
    {
      id: '17',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340010',
      customer: 'Amanda Clark',
      deliveryFee: 14.75,
      date: 'Sep 5, 2025',
      time: '18:30 PM',
      dateTime: new Date(2025, 8, 5, 18, 30),
      deliveryAddress: 'Beach - Umbrella C9',
      deliveryType: 'Beach Service'
    },
    {
      id: '18',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'cancelled',
      orderId: '2340011',
      customer: 'Kevin Rodriguez',
      deliveryFee: 8.75,
      date: 'Sep 6, 2025',
      time: '11:45 AM',
      dateTime: new Date(2025, 8, 6, 11, 45),
      deliveryAddress: 'Pool Deck - Cabana 15',
      deliveryType: 'Pool Service'
    },
    {
      id: '19',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340012',
      customer: 'Nicole White',
      deliveryFee: 16.50,
      date: 'Sep 6, 2025',
      time: '19:15 PM',
      dateTime: new Date(2025, 8, 6, 19, 15),
      deliveryAddress: 'Beach - Umbrella B7',
      deliveryType: 'Beach Service'
    },
    {
      id: '20',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340013',
      customer: 'Daniel Martinez',
      deliveryFee: 12.00,
      date: 'Sep 7, 2025',
      time: '13:20 PM',
      dateTime: new Date(2025, 8, 7, 13, 20),
      deliveryAddress: 'Pool Deck - Cabana 4',
      deliveryType: 'Pool Service'
    },
    {
      id: '21',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340014',
      customer: 'Rachel Thompson',
      deliveryFee: 13.25,
      date: 'Sep 7, 2025',
      time: '20:00 PM',
      dateTime: new Date(2025, 8, 7, 20, 0),
      deliveryAddress: 'Beach - Umbrella E3',
      deliveryType: 'Beach Service'
    },
    {
      id: '22',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340015',
      customer: 'Brian Anderson',
      deliveryFee: 15.75,
      date: 'Sep 8, 2025',
      time: '12:30 PM',
      dateTime: new Date(2025, 8, 8, 12, 30),
      deliveryAddress: 'Room N°445',
      deliveryType: 'Room Delivery'
    },
    {
      id: '23',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340016',
      customer: 'Stephanie Taylor',
      deliveryFee: 11.75,
      date: 'Sep 8, 2025',
      time: '18:45 PM',
      dateTime: new Date(2025, 8, 8, 18, 45),
      deliveryAddress: 'Beach - Umbrella F11',
      deliveryType: 'Beach Service'
    },
    {
      id: '24',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340017',
      customer: 'Gregory Wilson',
      deliveryFee: 14.00,
      date: 'Sep 9, 2025',
      time: '11:15 AM',
      dateTime: new Date(2025, 8, 9, 11, 15),
      deliveryAddress: 'Pool Deck - Cabana 18',
      deliveryType: 'Pool Service'
    },
    {
      id: '25',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'cancelled',
      orderId: '2340018',
      customer: 'Heather Moore',
      deliveryFee: 9.25,
      date: 'Sep 9, 2025',
      time: '19:30 PM',
      dateTime: new Date(2025, 8, 9, 19, 30),
      deliveryAddress: 'Beach - Umbrella A8',
      deliveryType: 'Beach Service'
    },
    {
      id: '26',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340019',
      customer: 'Justin Jackson',
      deliveryFee: 16.25,
      date: 'Sep 10, 2025',
      time: '14:00 PM',
      dateTime: new Date(2025, 8, 10, 14, 0),
      deliveryAddress: 'Room N°678',
      deliveryType: 'Room Delivery'
    },
    {
      id: '27',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340020',
      customer: 'Melissa White',
      deliveryFee: 12.75,
      date: 'Sep 10, 2025',
      time: '20:15 PM',
      dateTime: new Date(2025, 8, 10, 20, 15),
      deliveryAddress: 'Beach - Umbrella D5',
      deliveryType: 'Beach Service'
    },
    {
      id: '28',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340021',
      customer: 'Ryan Harris',
      deliveryFee: 13.50,
      date: 'Sep 11, 2025',
      time: '12:45 PM',
      dateTime: new Date(2025, 8, 11, 12, 45),
      deliveryAddress: 'Pool Deck - Cabana 22',
      deliveryType: 'Pool Service'
    },
    {
      id: '29',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340022',
      customer: 'Kimberly Martin',
      deliveryFee: 15.50,
      date: 'Sep 11, 2025',
      time: '18:20 PM',
      dateTime: new Date(2025, 8, 11, 18, 20),
      deliveryAddress: 'Beach - Umbrella C14',
      deliveryType: 'Beach Service'
    },
    {
      id: '30',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340023',
      customer: 'Jonathan Lee',
      deliveryFee: 10.25,
      date: 'Sep 12, 2025',
      time: '11:00 AM',
      dateTime: new Date(2025, 8, 12, 11, 0),
      deliveryAddress: 'Room N°823',
      deliveryType: 'Room Delivery'
    },
    {
      id: '31',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340024',
      customer: 'Laura Garcia',
      deliveryFee: 17.75,
      date: 'Sep 12, 2025',
      time: '19:45 PM',
      dateTime: new Date(2025, 8, 12, 19, 45),
      deliveryAddress: 'Beach - Umbrella B9',
      deliveryType: 'Beach Service'
    },
    {
      id: '32',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340025',
      customer: 'Mark Robinson',
      deliveryFee: 11.50,
      date: 'Sep 13, 2025',
      time: '13:10 PM',
      dateTime: new Date(2025, 8, 13, 13, 10),
      deliveryAddress: 'Pool Deck - Cabana 11',
      deliveryType: 'Pool Service'
    },
    {
      id: '33',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340026',
      customer: 'Patricia Clark',
      deliveryFee: 14.25,
      date: 'Sep 13, 2025',
      time: '20:30 PM',
      dateTime: new Date(2025, 8, 13, 20, 30),
      deliveryAddress: 'Beach - Umbrella F6',
      deliveryType: 'Beach Service'
    },
    {
      id: '34',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'cancelled',
      orderId: '2340027',
      customer: 'Eric Lewis',
      deliveryFee: 7.75,
      date: 'Sep 14, 2025',
      time: '12:20 PM',
      dateTime: new Date(2025, 8, 14, 12, 20),
      deliveryAddress: 'Room N°912',
      deliveryType: 'Room Delivery'
    },
    {
      id: '35',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340028',
      customer: 'Samantha Walker',
      deliveryFee: 16.00,
      date: 'Sep 14, 2025',
      time: '18:55 PM',
      dateTime: new Date(2025, 8, 14, 18, 55),
      deliveryAddress: 'Beach - Umbrella A16',
      deliveryType: 'Beach Service'
    },
    {
      id: '36',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340029',
      customer: 'Thomas Hall',
      deliveryFee: 12.25,
      date: 'Sep 15, 2025',
      time: '11:40 AM',
      dateTime: new Date(2025, 8, 15, 11, 40),
      deliveryAddress: 'Pool Deck - Cabana 6',
      deliveryType: 'Pool Service'
    },
    {
      id: '37',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340030',
      customer: 'Nancy Allen',
      deliveryFee: 15.25,
      date: 'Sep 15, 2025',
      time: '19:10 PM',
      dateTime: new Date(2025, 8, 15, 19, 10),
      deliveryAddress: 'Beach - Umbrella E12',
      deliveryType: 'Beach Service'
    },
    {
      id: '38',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340031',
      customer: 'Steven Young',
      deliveryFee: 13.75,
      date: 'Sep 16, 2025',
      time: '14:25 PM',
      dateTime: new Date(2025, 8, 16, 14, 25),
      deliveryAddress: 'Room N°567',
      deliveryType: 'Room Delivery'
    },
    {
      id: '39',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340032',
      customer: 'Karen Hernandez',
      deliveryFee: 11.00,
      date: 'Sep 16, 2025',
      time: '20:40 PM',
      dateTime: new Date(2025, 8, 16, 20, 40),
      deliveryAddress: 'Beach - Umbrella C18',
      deliveryType: 'Beach Service'
    },
    {
      id: '40',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340033',
      customer: 'Paul King',
      deliveryFee: 14.75,
      date: 'Sep 17, 2025',
      time: '12:55 PM',
      dateTime: new Date(2025, 8, 17, 12, 55),
      deliveryAddress: 'Pool Deck - Cabana 25',
      deliveryType: 'Pool Service'
    },
    {
      id: '41',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340034',
      customer: 'Betty Wright',
      deliveryFee: 16.75,
      date: 'Sep 17, 2025',
      time: '18:05 PM',
      dateTime: new Date(2025, 8, 17, 18, 5),
      deliveryAddress: 'Beach - Umbrella D12',
      deliveryType: 'Beach Service'
    },
    {
      id: '42',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340035',
      customer: 'Harold Lopez',
      deliveryFee: 9.75,
      date: 'Sep 18, 2025',
      time: '11:25 AM',
      dateTime: new Date(2025, 8, 18, 11, 25),
      deliveryAddress: 'Room N°734',
      deliveryType: 'Room Delivery'
    },
    {
      id: '43',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'cancelled',
      orderId: '2340036',
      customer: 'Donna Hill',
      deliveryFee: 8.50,
      date: 'Sep 18, 2025',
      time: '19:35 PM',
      dateTime: new Date(2025, 8, 18, 19, 35),
      deliveryAddress: 'Beach - Umbrella F4',
      deliveryType: 'Beach Service'
    },
    {
      id: '44',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      status: 'delivered',
      orderId: '2340037',
      customer: 'Gary Scott',
      deliveryFee: 13.00,
      date: 'Sep 19, 2025',
      time: '13:50 PM',
      dateTime: new Date(2025, 8, 19, 13, 50),
      deliveryAddress: 'Pool Deck - Cabana 8',
      deliveryType: 'Pool Service'
    },
    {
      id: '45',
      restaurantName: 'Sunset Grill',
      restaurantLogo: sunsetGrillLogo,
      status: 'delivered',
      orderId: '2340038',
      customer: 'Sandra Green',
      deliveryFee: 15.75,
      date: 'Sep 19, 2025',
      time: '20:25 PM',
      dateTime: new Date(2025, 8, 19, 20, 25),
      deliveryAddress: 'Beach - Umbrella A21',
      deliveryType: 'Beach Service'
    },
    {
      id: '46',
      restaurantName: 'Ocean Breeze',
      restaurantLogo: oceanBreezeLogo,
      status: 'delivered',
      orderId: '2340039',
      customer: 'Edward Adams',
      deliveryFee: 12.50,
      date: 'Sep 20, 2025',
      time: '12:10 PM',
      dateTime: new Date(2025, 8, 20, 12, 10),
      deliveryAddress: 'Room N°456',
      deliveryType: 'Room Delivery'
    },
    {
      id: '47',
      restaurantName: 'Sal de Mar',
      restaurantLogo: salDeMarLogo,
      status: 'delivered',
      orderId: '2340040',
      customer: 'Cynthia Baker',
      deliveryFee: 17.00,
      date: 'Sep 20, 2025',
      time: '18:40 PM',
      dateTime: new Date(2025, 8, 20, 18, 40),
      deliveryAddress: 'Beach - Umbrella E9',
      deliveryType: 'Beach Service'
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

  const getDeliveryTypeBadge = (deliveryType: string) => {
    switch (deliveryType) {
      case 'Room Delivery':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">🏨 Room</Badge>;
      case 'Pool Service':
        return <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">🏊 Pool</Badge>;
      case 'Beach Service':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">🏖️ Beach</Badge>;
      default:
        return null;
    }
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
    <div className={`min-h-screen bg-primary ${isPWA ? 'pt-[110px] lg:pt-[64px]' : 'pt-[70px] lg:pt-[48px]'}`}>
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 bg-background">
        <div className={`container mx-auto px-4 space-y-6 lg:px-3 ${isPWA ? 'py-4 lg:pt-4 lg:pb-4' : 'py-2 lg:pt-2 lg:pb-4'}`}>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Order History</h1>
            <p className="text-muted-foreground lg:text-lg">View your past delivery assignments</p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
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
                  <div className="space-y-2 sm:space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors gap-3 sm:gap-4"
                        onClick={() => handleOrderClick(order.orderId)}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                            <img 
                              src={order.restaurantLogo} 
                              alt={order.restaurantName}
                              className="h-full w-full object-cover rounded-full"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Restaurant name and badges row */}
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground truncate text-sm sm:text-base">{order.restaurantName}</h4>
                              <div className="flex gap-1 sm:gap-2">
                                {getStatusBadge(order.status)}
                                {getDeliveryTypeBadge(order.deliveryType)}
                              </div>
                            </div>
                            
                            {/* Order details */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                              <span className="font-mono">#{order.orderId}</span>
                              <span className="truncate max-w-[100px] sm:max-w-none">{order.customer}</span>
                              <span className="font-medium text-green-600">${order.deliveryFee.toFixed(2)}</span>
                              <span className="whitespace-nowrap">{order.date}</span>
                            </div>
                            
                            {/* Delivery address - more compact on mobile */}
                            <div className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                              <span className="inline-flex items-center gap-1">
                                📍 <span className="truncate">{order.deliveryAddress}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
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