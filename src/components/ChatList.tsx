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
}

interface ChatListProps {
  onSelectChat: (orderId: string, customerName: string) => void;
}

const ChatList = ({ onSelectChat }: ChatListProps) => {
  const [chats] = useState<ChatPreview[]>([
    {
      orderId: "ORD-1234",
      customerName: "Sarah Johnson",
      lastMessage: "Great! I'll call when I arrive.",
      timestamp: new Date(Date.now() - 180000),
      unreadCount: 0,
      status: 'active'
    },
    {
      orderId: "ORD-1235", 
      customerName: "Mike Chen",
      lastMessage: "Can you add extra sauce?",
      timestamp: new Date(Date.now() - 600000),
      unreadCount: 2,
      status: 'pending'
    },
    {
      orderId: "ORD-1236",
      customerName: "Emma Davis",
      lastMessage: "Thank you for the delivery!",
      timestamp: new Date(Date.now() - 1800000),
      unreadCount: 0,
      status: 'delivered'
    },
    {
      orderId: "ORD-1237",
      customerName: "Alex Rodriguez",
      lastMessage: "I'm in room 505",
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 1,
      status: 'active'
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
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Customer Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2 p-4">
            {chats.map((chat) => (
              <div
                key={chat.orderId}
                onClick={() => onSelectChat(chat.orderId, chat.customerName)}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {chat.customerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(chat.status)} border-2 border-white`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{chat.customerName}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getStatusText(chat.status)}
                      </Badge>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs min-w-[1.25rem] h-5">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate pr-2">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatTime(chat.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">Order #{chat.orderId}</p>
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