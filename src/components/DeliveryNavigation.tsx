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

  const resetPosition = () => {
    setCourierPosition({ top: "85%", left: "10%" });
    setEta(8);
    setProgress(0);
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
          onComplete();
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
    <div className="space-y-4">
      {/* Navigation Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Interactive Navigation</h3>
              <p className="text-sm text-muted-foreground">To: {destination}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{eta.toFixed(1)} min</span>
            </div>
            <p className="text-xs text-muted-foreground">{totalDistance}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Interactive Resort Map */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Resort Navigation Map
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">You</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Destination</span>
            </div>
          </div>
        </div>
        
        <div className="relative aspect-video bg-accent/5 rounded-lg border border-border overflow-hidden">
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
              <MapPin className="h-8 w-8 text-red-500 fill-red-500 drop-shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Courier Position */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200 ease-linear"
            style={{ top: courierPosition.top, left: courierPosition.left }}
          >
            <div className="relative">
              <div className="h-6 w-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              
              {/* Pulse effect when navigating */}
              {isNavigating && (
                <div className="absolute inset-0 h-6 w-6 bg-blue-500 rounded-full animate-ping opacity-30"></div>
              )}
              
              {/* Direction indicator - arrow pointing to destination */}
              {isNavigating && (
                <div 
                  className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-500 origin-left transform -translate-y-1/2"
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
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.6"
              />
            </svg>
          )}
          
          {/* Location Labels */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground shadow-lg z-30">
            {destination}
          </div>
          
          <div 
            className="absolute bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white shadow-lg z-30"
            style={{ 
              top: `calc(${courierPosition.top} + 40px)`, 
              left: `calc(${courierPosition.left} - 20px)`
            }}
          >
            You
          </div>
        </div>
      </Card>

      {/* Navigation Controls */}
      <div className="flex gap-2">
        {!isNavigating ? (
          <Button onClick={startNavigation} className="flex-1" disabled={progress >= 95}>
            <Play className="h-4 w-4 mr-2" />
            Start Navigation
          </Button>
        ) : (
          <Button onClick={pauseNavigation} variant="outline" className="flex-1">
            <Pause className="h-4 w-4 mr-2" />
            Pause Navigation
          </Button>
        )}
        
        <Button 
          onClick={resetPosition}
          variant="outline"
          disabled={isNavigating}
        >
          <Zap className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Navigation Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={isNavigating ? "default" : "secondary"}>
              {isNavigating ? "Navigating" : "Ready"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isNavigating 
                ? `Moving to ${destination}...` 
                : `Tap "Start Navigation" to begin`
              }
            </span>
          </div>
          <div className="text-sm font-medium text-foreground">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeliveryNavigation;