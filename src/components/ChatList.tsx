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
    <Card className="h-auto max-h-[calc(100vh-200px)] lg:max-h-[600px] lg:h-[600px] w-full overflow-hidden border-none shadow-sm">
      <CardHeader className="pb-3 px-3 sm:px-4 lg:px-5 border-b">
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-semibold">
          <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
          <span className="truncate">Customer Messages</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-270px)] lg:h-[500px] w-full">
          <div className="space-y-0 p-2 sm:p-2 lg:p-3 w-full">
            {chats.map((chat) => (
              <div
                key={chat.orderId}
                onClick={() => onSelectChat(chat.orderId, chat.customerName, chat.status, chat.deliveryCompletedAt)}
                className="flex items-start gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl hover:bg-accent/50 cursor-pointer transition-all duration-200 active:scale-[0.98] w-full"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-base sm:text-lg font-semibold">
                      {chat.customerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${getStatusColor(chat.status)} border-[3px] border-background shadow-sm`} />
                </div>
                
                <div className="flex-1 min-w-0 overflow-hidden pt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-base sm:text-lg truncate flex-1 min-w-0">{chat.customerName}</h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs min-w-[1.25rem] h-5 px-1.5 rounded-full font-semibold shadow-sm">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-muted-foreground truncate mb-2 leading-snug">
                    {chat.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground/80 gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap px-2 py-0.5 rounded-full font-medium">
                        {getStatusText(chat.status)}
                      </Badge>
                      <span className="truncate">#{chat.orderId}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="font-medium">{formatTime(chat.timestamp)}</span>
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