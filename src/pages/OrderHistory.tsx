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
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20 text-xs px-2 py-0">🏨 Room</Badge>;
      case 'Pool Service':
        return <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/20 text-xs px-2 py-0">🏊 Pool</Badge>;
      case 'Beach Service':
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20 border-orange-500/20 text-xs px-2 py-0">🏖️ Beach</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-success/20 text-xs px-2 py-0">✓ Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 text-xs px-2 py-0">✗ Cancelled</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20 border-warning/20 text-xs px-2 py-0">⏳ Pending</Badge>;
      default:
        return null;
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  // Empty state component
  const EmptyState = () => (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No orders found</h3>
        <p className="text-muted-foreground text-center max-w-sm text-sm">
          No deliveries match your selected date range. Try adjusting your filters.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen bg-primary ${isPWA ? 'pt-[120px] sm:pt-[115px] lg:pt-[72px]' : 'pt-[64px] sm:pt-[60px] lg:pt-[56px]'}`}>
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 bg-background">
        <div className={`container mx-auto px-4 space-y-4 lg:px-6 ${isPWA ? 'py-6 lg:pt-6 lg:pb-4' : 'py-6 lg:pt-6 lg:pb-4'}`}>
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
              <p className="text-muted-foreground text-sm">View your past deliveries</p>
            </div>
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Select dates"
            />
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <Card 
                  key={order.id} 
                  className="group cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  onClick={() => handleOrderClick(order.orderId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Restaurant Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center ring-1 ring-border/50 group-hover:ring-primary/30 transition-all duration-200">
                          <img 
                            src={order.restaurantLogo} 
                            alt={order.restaurantName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="space-y-1.5">
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors duration-200">{order.restaurantName}</h3>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {getStatusBadge(order.status)}
                              {getDeliveryTypeBadge(order.deliveryType)}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>#{order.orderId}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="font-semibold">${order.deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{order.date} at {order.time} • {order.deliveryAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;