import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Play, Pause, Target, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import luxuryPoolDeckMap from "@/assets/luxury-pool-deck-map.jpg";

interface DeliveryNavigationProps {
  destination: string;
  onComplete: () => void;
}

interface Position {
  top: string;
  left: string;
}

const DeliveryNavigation = ({ destination, onComplete }: DeliveryNavigationProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [courierPosition, setCourierPosition] = useState<Position>({ top: "85%", left: "10%" });
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(8);
  const [totalDistance] = useState("0.7 mi");
  const [hasReachedDestination, setHasReachedDestination] = useState(false);

  // Get destination position based on delivery location
  const getDestinationPosition = (dest: string): Position => {
    if (dest.includes("Room")) {
      return { top: "20%", left: "85%" };
    } else if (dest.includes("Pool") || dest.includes("Cabana")) {
      return { top: "33%", left: "66%" };
    } else if (dest.includes("Beach")) {
      return { top: "70%", left: "90%" };
    } else {
      return { top: "40%", left: "60%" };
    }
  };

  const destinationPos = getDestinationPosition(destination);

  // Calculate progress based on courier position relative to destination
  const calculateProgress = () => {
    const courierTop = parseFloat(courierPosition.top);
    const courierLeft = parseFloat(courierPosition.left);
    const destTop = parseFloat(destinationPos.top);
    const destLeft = parseFloat(destinationPos.left);
    
    const startTop = 85;
    const startLeft = 10;
    
    const totalDistance = Math.sqrt(
      Math.pow(destTop - startTop, 2) + Math.pow(destLeft - startLeft, 2)
    );
    
    const currentDistance = Math.sqrt(
      Math.pow(destTop - courierTop, 2) + Math.pow(destLeft - courierLeft, 2)
    );
    
    const newProgress = Math.min(99, ((totalDistance - currentDistance) / totalDistance) * 100);
    setProgress(newProgress);
  };

  const startNavigation = () => {
    setIsNavigating(true);
  };

  const pauseNavigation = () => {
    setIsNavigating(false);
  };

  const completeDelivery = () => {
    onComplete();
  };

  const resetPosition = () => {
    setCourierPosition({ top: "85%", left: "10%" });
    setEta(8);
    setProgress(0);
    setHasReachedDestination(false);
  };

  // Auto-move courier when navigating
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      setCourierPosition(current => {
        const currentTop = parseFloat(current.top);
        const currentLeft = parseFloat(current.left);
        const destTop = parseFloat(destinationPos.top);
        const destLeft = parseFloat(destinationPos.left);
        
        const dx = destLeft - currentLeft;
        const dy = destTop - currentTop;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 3) {
          // Reached destination
          setIsNavigating(false);
          setHasReachedDestination(true);
          return current;
        }
        
        // Move towards destination
        const speed = 1.5;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;
        
        setEta(prev => Math.max(0, prev - 0.1));
        
        return {
          top: `${currentTop + moveY}%`,
          left: `${currentLeft + moveX}%`
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isNavigating, destinationPos, onComplete]);

  // Update progress when courier position changes
  useEffect(() => {
    calculateProgress();
  }, [courierPosition, destinationPos]);

  return (
    <div className="flex flex-col h-screen">
      {/* Compact Navigation Header */}
      <div className="bg-background border-b border-border p-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Navigation className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">To: {destination}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{eta.toFixed(1)} min</span>
                <span>•</span>
                <span>{totalDistance}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium">
            <Badge variant={isNavigating ? "default" : "secondary"} className="text-xs">
              {isNavigating ? "Navigating" : "Ready"}
            </Badge>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Full Screen Interactive Resort Map */}
      <div className="flex-1 relative bg-accent/5 overflow-hidden">
        {/* Map Legend - Top Right */}
        <div className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs font-medium">Destination</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator - Top Left */}
        <div className="absolute top-4 left-4 z-40 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="text-xs font-medium text-foreground">
            {Math.round(progress)}% Complete
          </div>
        </div>
        
        <img 
          src={luxuryPoolDeckMap} 
          alt="Luxury resort map with navigation" 
          className="w-full h-full object-cover"
        />
        
        {/* Destination Pin */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ top: destinationPos.top, left: destinationPos.left }}
        >
          <div className="relative">
            <MapPin className="h-10 w-10 text-red-500 fill-red-500 drop-shadow-lg" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Courier Position */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200 ease-linear"
          style={{ top: courierPosition.top, left: courierPosition.left }}
        >
          <div className="relative">
            <div className="h-8 w-8 bg-blue-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            
            {/* Pulse effect when navigating */}
            {isNavigating && (
              <div className="absolute inset-0 h-8 w-8 bg-blue-500 rounded-full animate-ping opacity-30"></div>
            )}
            
            {/* Direction indicator - arrow pointing to destination */}
            {isNavigating && (
              <div 
                className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-blue-500 origin-left transform -translate-y-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${Math.atan2(
                    parseFloat(destinationPos.top) - parseFloat(courierPosition.top),
                    parseFloat(destinationPos.left) - parseFloat(courierPosition.left)
                  ) * (180 / Math.PI)}deg)`,
                }}
              />
            )}
          </div>
        </div>
        
        {/* Route Path (dashed line when navigating) */}
        {isNavigating && (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <pattern id="dashed" patternUnits="userSpaceOnUse" width="8" height="2">
                <rect width="4" height="2" fill="#10b981" />
              </pattern>
            </defs>
            <line
              x1={`${parseFloat(courierPosition.left)}%`}
              y1={`${parseFloat(courierPosition.top)}%`}
              x2={`${parseFloat(destinationPos.left)}%`}
              y2={`${parseFloat(destinationPos.top)}%`}
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="8,6"
              opacity="0.7"
            />
          </svg>
        )}
        
        {/* Location Labels */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground shadow-xl z-30">
          📍 {destination}
        </div>
        
        <div 
          className="absolute bg-blue-500/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white shadow-xl z-30"
          style={{ 
            top: `calc(${courierPosition.top} + 50px)`, 
            left: `calc(${courierPosition.left} - 25px)`
          }}
        >
          🚶 You
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="bg-background border-t border-border p-4 flex-shrink-0">
        <div className="flex gap-3">
          {!isNavigating && !hasReachedDestination ? (
            <Button onClick={startNavigation} className="flex-1 h-12 text-base" disabled={progress >= 95}>
              <Play className="h-5 w-5 mr-2" />
              Start Navigation
            </Button>
          ) : hasReachedDestination ? (
            <Button onClick={completeDelivery} className="flex-1 h-12 text-base bg-success hover:bg-success/90 text-white">
              <Target className="h-5 w-5 mr-2" />
              Complete Delivery
            </Button>
          ) : (
            <Button onClick={pauseNavigation} variant="outline" className="flex-1 h-12 text-base">
              <Pause className="h-5 w-5 mr-2" />
              Pause Navigation
            </Button>
          )}
          
          <Button 
            onClick={resetPosition}
            variant="outline"
            disabled={isNavigating}
            className="h-12 px-6"
          >
            <Zap className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-3 text-center">
          <span className="text-sm text-muted-foreground">
            {hasReachedDestination 
              ? `Arrived at ${destination}! Ready to complete delivery.`
              : isNavigating 
                ? `Moving to ${destination}...` 
                : `Ready to navigate to ${destination}`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryNavigation;