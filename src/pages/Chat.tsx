import { useState } from "react";
import ChatList from "@/components/ChatList";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useIsPWA } from "@/hooks/use-is-pwa";

const Chat = () => {
  const isPWA = useIsPWA();
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
    <div className={`min-h-screen bg-background ${isPWA ? 'pt-[110px] lg:pt-[64px]' : 'pt-[64px] lg:pt-[48px]'}`}>
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <div className={`px-4 sm:px-5 space-y-4 sm:space-y-5 lg:px-6 ${isPWA ? 'py-6 lg:pt-6 lg:pb-4' : 'py-6 lg:pt-6 lg:pb-4'}`}>
          <div className="px-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 lg:text-3xl">Customer Messages</h1>
            <p className="text-sm sm:text-base text-muted-foreground lg:text-lg">Communicate with customers about their deliveries</p>
          </div>

          {/* Mobile: Full screen chat or list */}
          {selectedChat ? (
            <div className="fixed inset-0 z-50 bg-background pt-[100px] lg:hidden">
              <div className="h-full flex flex-col">
                <div className="px-4 py-2 border-b border-border">
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
            </div>
          ) : (
            <div className="lg:hidden -mx-4 sm:-mx-5 lg:-mx-6">
              <ChatList onSelectChat={handleSelectChat} />
            </div>
          )}

          {/* Desktop: Side by side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            <div className="-mx-6 border-x bg-card">
              <ChatList onSelectChat={handleSelectChat} />
            </div>

            <div>
              {selectedChat ? (
                <ChatInterface
                  orderId={selectedChat.orderId}
                  customerName={selectedChat.customerName}
                  deliveryStatus={selectedChat.status}
                  deliveryCompletedAt={selectedChat.deliveryCompletedAt}
                  onClose={() => setSelectedChat(null)}
                />
              ) : (
                <div className="flex items-center justify-center h-[600px] border-2 border-dashed border-border rounded-lg">
                  <div className="text-center text-muted-foreground">
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
  );
};

export default Chat;