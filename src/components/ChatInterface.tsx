import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Phone, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: 'runner' | 'customer';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatInterfaceProps {
  orderId: string;
  customerName: string;
  onClose?: () => void;
}

const ChatInterface = ({ orderId, customerName, onClose }: ChatInterfaceProps) => {
  // Generate realistic messages based on customer name
  const getInitialMessages = (): Message[] => {
    // Pool delivery scenario
    if (customerName.includes('Sarah')) {
      return [
        {
          id: '1',
          text: 'Hi Sarah! I have your order from Ocean Breeze. Heading to the pool deck now.',
          sender: 'runner',
          timestamp: new Date(Date.now() - 420000),
          status: 'read'
        },
        {
          id: '2',
          text: 'Great! I\'m at the pool deck, blue umbrella on the left side near the bar.',
          sender: 'customer',
          timestamp: new Date(Date.now() - 360000),
          status: 'read'
        },
        {
          id: '3',
          text: 'Perfect! I see the blue umbrella. Be there in 2 minutes.',
          sender: 'runner',
          timestamp: new Date(Date.now() - 180000),
          status: 'read'
        }
      ];
    }
    // Room delivery scenario
    if (customerName.includes('Mike')) {
      return [
        {
          id: '1',
          text: 'Hi Mike! On my way with your Margarita Mama\'s order. Should be there in 10 minutes.',
          sender: 'runner',
          timestamp: new Date(Date.now() - 600000),
          status: 'read'
        },
        {
          id: '2',
          text: 'Room 305. Can you please leave it outside the door? Baby is sleeping.',
          sender: 'customer',
          timestamp: new Date(Date.now() - 540000),
          status: 'read'
        },
        {
          id: '3',
          text: 'Absolutely! I\'ll place it gently by your door and text you when it\'s there.',
          sender: 'runner',
          timestamp: new Date(Date.now() - 480000),
          status: 'read'
        },
        {
          id: '4',
          text: 'Also, could you add extra hot sauce packets?',
          sender: 'customer',
          timestamp: new Date(Date.now() - 420000),
          status: 'read'
        }
      ];
    }
    // Beach delivery scenario
    if (customerName.includes('Alex')) {
      return [
        {
          id: '1',
          text: 'Hey Alex! Got your Sunset Grill order. Making my way to the beach.',
          sender: 'runner',
          timestamp: new Date(Date.now() - 480000),
          status: 'read'
        },
        {
          id: '2',
          text: 'Awesome! I\'m on the beach at the white cabana closest to the water. You\'ll see a red cooler.',
          sender: 'customer',
          timestamp: new Date(Date.now() - 420000),
          status: 'read'
        },
        {
          id: '3',
          text: 'I see the white cabana! Walking over now.',
          sender: 'runner',
          timestamp: new Date(Date.now() - 240000),
          status: 'read'
        },
        {
          id: '4',
          text: 'Perfect, I can see you!',
          sender: 'customer',
          timestamp: new Date(Date.now() - 180000),
          status: 'read'
        }
      ];
    }
    // Default scenario
    return [
      {
        id: '1',
        text: 'Hi! I\'m on my way with your order. ETA: 15 minutes.',
        sender: 'runner',
        timestamp: new Date(Date.now() - 300000),
        status: 'read'
      },
      {
        id: '2',
        text: 'Thanks for the update!',
        sender: 'customer',
        timestamp: new Date(Date.now() - 240000),
        status: 'read'
      }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'runner',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate delivery status update
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    // Simulate customer response (for demo)
    if (Math.random() > 0.7) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const customerMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Thanks for the update!",
            sender: 'customer',
            timestamp: new Date(),
            status: 'sent'
          };
          setMessages(prev => [...prev, customerMessage]);
        }, 2000);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{customerName}</CardTitle>
            <p className="text-sm text-muted-foreground">Order #{orderId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'runner' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'runner'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`flex items-center justify-between mt-1 text-xs ${
                      message.sender === 'runner' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    {message.sender === 'runner' && (
                      <span className={`ml-2 ${message.status === 'read' ? 'text-blue-200' : 'text-blue-300'}`}>
                        {getMessageStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{customerName} is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;