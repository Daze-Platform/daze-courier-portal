import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'tip' | 'bonus' | 'payout' | 'system' | 'update' | 'rating';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  amount?: number;
  priority?: 'low' | 'medium' | 'high';
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Order Available',
    message: 'Order #23456792 from Ocean Breeze Café is ready for pickup',
    type: 'order',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: '/order/23456792',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Delivery Earnings Posted',
    message: 'Your earnings of $18.90 from 3 deliveries have been posted',
    type: 'payment',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    amount: 18.90,
    actionUrl: '/earnings',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Delivery Completed',
    message: 'Order #23456789 to Room #1234 was successfully delivered',
    type: 'order',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    actionUrl: '/order-history'
  },
  {
    id: '4',
    title: 'Weekly Bonus Unlocked! 🎉',
    message: 'You\'ve completed 15 deliveries this week! Bonus: $25.00',
    type: 'bonus',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    amount: 25.00,
    actionUrl: '/earnings',
    priority: 'high'
  },
  {
    id: '5',
    title: 'App Update Available',
    message: 'Version 2.1.0 is now available with improved navigation',
    type: 'update',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    priority: 'low'
  },
  {
    id: '6',
    title: 'New Order Available',
    message: 'Order #23456793 from Sunset Grill is ready for pickup at Pool Deck',
    type: 'order',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false,
    actionUrl: '/order/23456793',
    priority: 'high'
  },
  {
    id: '7',
    title: 'Tip Received! 💰',
    message: 'Customer added a $5.00 tip for your excellent service on Order #23456789',
    type: 'tip',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    amount: 5.00,
    actionUrl: '/earnings',
    priority: 'medium'
  },
  {
    id: '8',
    title: 'Order Cancelled',
    message: 'Order #23456791 has been cancelled by the customer. No penalty applied.',
    type: 'order',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: true
  },
  {
    id: '9',
    title: 'Daily Goal Achieved! 🏆',
    message: 'Congratulations! You\'ve completed 10 deliveries today. Keep it up!',
    type: 'system',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    priority: 'medium'
  },
  {
    id: '10',
    title: 'New Order Available',
    message: 'Order #23456794 from Margarita Mama\'s is ready for Beach Service',
    type: 'order',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    read: false,
    actionUrl: '/order/23456794',
    priority: 'high'
  },
  {
    id: '11',
    title: 'Payout Scheduled',
    message: 'Your weekly payout of $245.50 will be processed tomorrow',
    type: 'payout',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: true,
    amount: 245.50,
    actionUrl: '/payouts',
    priority: 'medium'
  },
  {
    id: '12',
    title: 'Peak Hours Bonus Active',
    message: 'Earn 1.5x base pay during peak hours (12-2 PM and 6-8 PM)',
    type: 'bonus',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: true,
    actionUrl: '/earnings',
    priority: 'high'
  },
  {
    id: '13',
    title: 'New 5-Star Rating! ⭐',
    message: 'Customer rated your service 5 stars with positive feedback',
    type: 'rating',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    read: true,
    actionUrl: '/ratings',
    priority: 'medium'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notifications
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
      className: "border-l-4 border-l-primary bg-card shadow-lg",
    });
  }, [toast]);

  // Simulate receiving new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to receive a new order notification
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const orderNumber = Math.floor(Math.random() * 1000000);
        const restaurants = ['Ocean Breeze Café', 'Sunset Grill', 'Margarita Mama\'s'];
        const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
        
        addNotification({
          title: 'New Order Available',
          message: `Order #${orderNumber} from ${restaurant} is ready for pickup`,
          type: 'order',
          read: false,
          actionUrl: `/order/${orderNumber}`
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification
  };
};