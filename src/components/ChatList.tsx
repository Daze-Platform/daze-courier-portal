import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Clock } from "lucide-react";

interface ChatPreview {
  orderId: string;
  customerName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  status: 'active' | 'pending' | 'delivered';
  deliveryCompletedAt?: Date;
}

interface ChatListProps {
  onSelectChat: (orderId: string, customerName: string, status: 'active' | 'pending' | 'delivered', deliveryCompletedAt?: Date) => void;
}

const ChatList = ({ onSelectChat }: ChatListProps) => {
  const [chats] = useState<ChatPreview[]>([
    {
      orderId: "ORD-1234",
      customerName: "Sarah Johnson",
      lastMessage: "I'm at the pool deck, blue umbrella on the left side",
      timestamp: new Date(Date.now() - 180000),
      unreadCount: 0,
      status: 'active'
    },
    {
      orderId: "ORD-1235", 
      customerName: "Mike Chen",
      lastMessage: "Room 305, please leave it outside the door",
      timestamp: new Date(Date.now() - 600000),
      unreadCount: 2,
      status: 'pending'
    },
    {
      orderId: "ORD-1236",
      customerName: "Emma Davis",
      lastMessage: "Perfect timing! Food was still hot 👍",
      timestamp: new Date(Date.now() - 1800000),
      unreadCount: 0,
      status: 'delivered',
      deliveryCompletedAt: new Date(Date.now() - 1800000)
    },
    {
      orderId: "ORD-1237",
      customerName: "Alex Rodriguez",
      lastMessage: "I'm on the beach, white cabana near the water",
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 1,
      status: 'active'
    },
    {
      orderId: "ORD-1238",
      customerName: "Jessica Martinez",
      lastMessage: "Can you bring extra napkins? Thanks!",
      timestamp: new Date(Date.now() - 7200000),
      unreadCount: 0,
      status: 'delivered',
      deliveryCompletedAt: new Date(Date.now() - 7200000)
    }
  ]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'delivered': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'In Progress';
      case 'pending': return 'Pending';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <Card className="h-auto max-h-[calc(100vh-250px)] lg:max-h-[600px] lg:h-[600px]">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
          <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5" />
          Customer Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-330px)] lg:h-[500px]">
          <div className="space-y-2 p-3 lg:p-4">
            {chats.map((chat) => (
              <div
                key={chat.orderId}
                onClick={() => onSelectChat(chat.orderId, chat.customerName, chat.status, chat.deliveryCompletedAt)}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {chat.customerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getStatusColor(chat.status)} border-2 border-background`} />
                </div>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start justify-between gap-1.5 mb-1">
                    <h4 className="font-medium text-sm truncate flex-1 min-w-0 pr-1">{chat.customerName}</h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap px-1.5 sm:px-2 py-0.5 leading-tight">
                        {getStatusText(chat.status)}
                      </Badge>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-[10px] sm:text-xs min-w-[1.125rem] sm:min-w-[1.25rem] h-4 sm:h-5 px-1 leading-tight">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1 pr-1">
                    {chat.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground gap-1.5">
                    <span className="truncate flex-1 min-w-0">Order #{chat.orderId}</span>
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {formatTime(chat.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatList;