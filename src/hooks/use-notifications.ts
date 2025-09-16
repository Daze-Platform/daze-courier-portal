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
    message: 'Order #23456789 to Room N°12345 was successfully delivered',
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