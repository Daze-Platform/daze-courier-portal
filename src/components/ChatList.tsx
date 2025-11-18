import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

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
    <div className="w-full h-full">
      <ScrollArea className="h-[calc(100vh-180px)] lg:h-[calc(100vh-180px)] w-full">
        <div className="w-full">
          {chats.map((chat, index) => (
            <div key={chat.orderId}>
              <div
                onClick={() => onSelectChat(chat.orderId, chat.customerName, chat.status, chat.deliveryCompletedAt)}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-accent/50 cursor-pointer transition-all duration-200 active:bg-accent/70 w-full"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-background">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg sm:text-xl font-semibold">
                      {chat.customerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full ${getStatusColor(chat.status)} border-[3px] border-background`} />
                </div>
                
                <div className="flex-1 min-w-0 overflow-hidden pt-1">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-semibold text-base sm:text-lg lg:text-xl truncate flex-1 min-w-0">{chat.customerName}</h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm min-w-[1.5rem] h-6 px-2 rounded-full font-semibold">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base lg:text-lg text-foreground/70 truncate mb-2.5 leading-relaxed">
                    {chat.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap px-2.5 py-0.5 rounded-full font-medium">
                        {getStatusText(chat.status)}
                      </Badge>
                      <span className="truncate text-xs sm:text-sm">#{chat.orderId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="font-medium">{formatTime(chat.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {index < chats.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;