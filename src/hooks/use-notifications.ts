import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'system' | 'update';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
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
    actionUrl: '/order/23456792'
  },
  {
    id: '2',
    title: 'Payment Processed',
    message: 'Your earnings of $18.90 have been processed successfully',
    type: 'payment',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false
  },
  {
    id: '3',
    title: 'Delivery Completed',
    message: 'Order #23456789 to Room #1234 was successfully delivered',
    type: 'order',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true
  },
  {
    id: '4',
    title: 'Weekly Bonus Unlocked',
    message: 'You\'ve completed 15 deliveries this week! Bonus: $25.00',
    type: 'payment',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true
  },
  {
    id: '5',
    title: 'App Update Available',
    message: 'Version 2.1.0 is now available with improved navigation',
    type: 'update',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true
  },
  {
    id: '6',
    title: 'New Order Available',
    message: 'Order #23456793 from Sunset Grill is ready for pickup at Pool Deck',
    type: 'order',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false,
    actionUrl: '/order/23456793'
  },
  {
    id: '7',
    title: 'Tip Received',
    message: 'Customer added a $5.00 tip for your excellent service!',
    type: 'payment',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true
  },
  {
    id: '8',
    title: 'Order Cancelled',
    message: 'Order #23456791 has been cancelled by the customer',
    type: 'order',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: true
  },
  {
    id: '9',
    title: 'Daily Goal Achieved',
    message: 'Congratulations! You\'ve completed 10 deliveries today',
    type: 'system',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true
  },
  {
    id: '10',
    title: 'New Order Available',
    message: 'Order #23456794 from Margarita Mama\'s is ready for Beach Service',
    type: 'order',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    read: false,
    actionUrl: '/order/23456794'
  },
  {
    id: '11',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM',
    type: 'system',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: true
  },
  {
    id: '12',
    title: 'Peak Hours Bonus',
    message: 'Earn 1.5x during peak hours (12-2 PM and 6-8 PM)',
    type: 'payment',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: true
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