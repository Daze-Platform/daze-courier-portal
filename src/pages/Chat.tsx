import { useState } from "react";
import ChatList from "@/components/ChatList";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<{ 
    orderId: string; 
    customerName: string; 
    status: 'active' | 'pending' | 'delivered';
    deliveryCompletedAt?: Date;
  } | null>(null);

  const handleSelectChat = (orderId: string, customerName: string, status: 'active' | 'pending' | 'delivered', deliveryCompletedAt?: Date) => {
    setSelectedChat({ orderId, customerName, status, deliveryCompletedAt });
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <UnifiedHeader />
      <div className="flex min-h-screen w-full pt-[100px] lg:pt-[56px]">
        <DesktopSidebar />
        <div className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
            <div className="mb-4 lg:mb-6">
              <h1 className="text-2xl font-bold text-foreground">Customer Messages</h1>
              <p className="text-muted-foreground mt-1">Communicate with customers about their deliveries</p>
            </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mobile: Show either list or chat */}
        <div className={`${selectedChat ? 'hidden lg:block' : 'block'}`}>
          <ChatList onSelectChat={handleSelectChat} />
        </div>

        {/* Chat Interface */}
        <div className={`${selectedChat ? 'block' : 'hidden lg:block'}`}>
          {selectedChat ? (
            <div className="space-y-4">
              <div className="lg:hidden">
                <Button variant="ghost" size="sm" onClick={handleBackToList}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Messages
                </Button>
              </div>
              <ChatInterface
                orderId={selectedChat.orderId}
                customerName={selectedChat.customerName}
                deliveryStatus={selectedChat.status}
                deliveryCompletedAt={selectedChat.deliveryCompletedAt}
                onClose={() => setSelectedChat(null)}
              />
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center h-[600px] border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a customer to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;