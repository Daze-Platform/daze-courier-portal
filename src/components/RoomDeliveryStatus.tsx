import { useState, useEffect } from "react";
import { CheckCircle, Clock, MapPin } from "lucide-react";
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
  const { toast } = useToast();

  // Auto-progress simulation for room delivery
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(100, prev + 2);
        
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
            className: "border-l-4 border-l-green-500",
          });
        }
        
        return newProgress;
      });
      
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, destination, toast]);

  const getStatusMessage = () => {
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

  const roomNumber = destination.replace(/\D/g, '') || '###';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 lg:left-64">
      <div className="container mx-auto px-4 py-4">
        {/* Status Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${getStatusColor()}`}>
              <span className="font-bold text-lg">{roomNumber}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Room Delivery</h3>
              <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
              </div>
              <Badge variant={status === 'arrived' ? 'default' : 'secondary'} className="mt-1">
                {status === 'walking' ? 'En Route' : status === 'approaching' ? 'Almost There' : 'Arrived'}
              </Badge>
            </div>
            
            {status === 'arrived' && (
              <Button 
                onClick={onComplete}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Delivery
              </Button>
            )}
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