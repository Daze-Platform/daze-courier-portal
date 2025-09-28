import { useState, useEffect } from "react";
import { CheckCircle, Clock, MapPin, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface RoomDeliveryStatusProps {
  destination: string;
  onComplete: () => void;
}

const RoomDeliveryStatus = ({ destination, onComplete }: RoomDeliveryStatusProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'walking' | 'approaching' | 'arrived'>('walking');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  // Auto-progress simulation for room delivery
  useEffect(() => {
    if (isPaused || status === 'arrived') return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(100, prev + 5); // Changed from +2 to +5 for 20s total (100/5 = 20s)
        
        // Status transitions
        if (newProgress >= 80 && status === 'walking') {
          setStatus('approaching');
          toast({
            title: "🚶 Getting Close",
            description: `Almost at ${destination}. Get ready to knock!`,
            className: "border-l-4 border-l-yellow-500",
          });
        } else if (newProgress >= 100 && status === 'approaching') {
          setStatus('arrived');
          toast({
            title: "🎯 Arrived!",
            description: `You've reached ${destination}. Complete the delivery!`,
            variant: "success"
          });
        }
        
        return newProgress;
      });
      
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, destination, toast, isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "🚀 Delivery Resumed" : "⏸️ Delivery Paused",
      description: isPaused ? "Continuing delivery..." : "Delivery is now paused",
      className: `border-l-4 ${isPaused ? 'border-l-green-500' : 'border-l-orange-500'}`,
    });
  };

  const getStatusMessage = () => {
    if (isPaused) return `Delivery paused at ${destination}`;
    
    switch (status) {
      case 'walking':
        return `Walking to ${destination}...`;
      case 'approaching':
        return `Approaching ${destination} - Get ready!`;
      case 'arrived':
        return `Arrived at ${destination}!`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'walking':
        return 'bg-blue-500';
      case 'approaching':
        return 'bg-yellow-500';
      case 'arrived':
        return 'bg-green-500';
    }
  };

  const roomNumber = (destination.replace(/\D/g, '') || '000').slice(-3).padStart(3, '0');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-40 lg:left-64 safe-area-inset-bottom">
      <div className="container mx-auto px-4 sm:px-6 py-4 pb-safe">
        {/* Status Header */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${getStatusColor()} flex-shrink-0`}>
              <span className="font-bold text-lg">{roomNumber}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Room Delivery</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{getStatusMessage()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-mono">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
              </div>
              <Badge variant={isPaused ? 'outline' : status === 'arrived' ? 'default' : 'secondary'} className="mt-1 text-xs whitespace-nowrap">
                {isPaused ? 'Paused' : status === 'walking' ? 'Active' : status === 'approaching' ? 'Close' : 'Arrived'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {status !== 'arrived' && (
                <Button 
                  onClick={togglePause}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                >
                  {isPaused ? <Play className="h-3 w-3 sm:h-4 sm:w-4" /> : <Pause className="h-3 w-3 sm:h-4 sm:w-4" />}
                  <span className="hidden xs:inline">{isPaused ? 'Resume' : 'Pause'}</span>
                </Button>
              )}
              
              {status === 'arrived' && (
                <Button 
                  onClick={onComplete}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Complete</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className={`h-2 ${status === 'arrived' ? '[&>div]:bg-green-500' : status === 'approaching' ? '[&>div]:bg-yellow-500' : ''}`} 
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Lobby</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {destination}
            </span>
          </div>
        </div>

        {/* Quick Instructions */}
        {status === 'approaching' && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 font-medium">
              💡 Ready to deliver? Knock softly and announce "Room service delivery"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDeliveryStatus;