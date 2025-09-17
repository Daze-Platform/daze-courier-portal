import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Play, Pause, Target, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import luxuryPoolDeckMap from "@/assets/luxury-pool-deck-hd.jpg";

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
  const [courierPosition, setCourierPosition] = useState<Position>({ top: "35%", left: "50%" }); // Pool Bar starting position
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(8);
  const [totalDistance] = useState("0.7 mi");
  const [hasReachedDestination, setHasReachedDestination] = useState(false);
  const [hasShownCloseNotification, setHasShownCloseNotification] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [routeWaypoints, setRouteWaypoints] = useState<Position[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Get destination position based on delivery location - positioned at actual umbrellas
  const getDestinationPosition = (dest: string): Position => {
    if (dest.includes("Room")) {
      return { top: "20%", left: "85%" };
    } else if (dest.includes("Pool") || dest.includes("Cabana")) {
      // Position precisely on an umbrella on the top-right concrete deck area
      return { top: "30%", left: "75%" };
    } else if (dest.includes("Beach")) {
      return { top: "70%", left: "90%" };
    } else {
      // Default to umbrella position on concrete deck
      return { top: "30%", left: "75%" };
    }
  };

  // Generate realistic waypoints that follow concrete walkways around the pool (NEVER through water)
  const generateRouteWaypoints = (destination: Position): Position[] => {
    const startPos = { top: "35%", left: "50%" }; // Pool Bar starting position
    const waypoints = [startPos];
    
    // For pool/umbrella destinations, route around the pool on concrete walkways
    if (destination.top === "30%" && destination.left === "75%") {
      // Route to umbrella area following concrete walkways around pool
      waypoints.push({ top: "35%", left: "60%" }); // Move from pool bar toward umbrella
      waypoints.push({ top: "30%", left: "70%" }); // Approach umbrella area on concrete deck
    } else if (destination.top === "20%" && destination.left === "85%") {
      // Room destinations - go toward rooms from center pool bar
      waypoints.push({ top: "30%", left: "60%" }); // Move from pool bar toward rooms
      waypoints.push({ top: "25%", left: "70%" }); // Continue toward rooms
      waypoints.push({ top: "20%", left: "80%" }); // Final approach to rooms
    } else if (destination.top === "70%" && destination.left === "90%") {
      // Beach destinations - route toward beach area
      waypoints.push({ top: "45%", left: "60%" }); // Move from pool bar toward beach
      waypoints.push({ top: "60%", left: "75%" }); // Continue toward beach
      waypoints.push({ top: "70%", left: "85%" }); // Approach beach area
    } else {
      // Default routing from center pool bar to umbrella area
      waypoints.push({ top: "40%", left: "55%" }); // Move from pool bar
      waypoints.push({ top: "50%", left: "60%" }); // Approach destination
    }
    
    waypoints.push(destination);
    return waypoints;
  };

  const destinationPos = getDestinationPosition(destination);

  // Initialize route waypoints when destination changes
  useEffect(() => {
    const waypoints = generateRouteWaypoints(destinationPos);
    setRouteWaypoints(waypoints);
    setCurrentWaypointIndex(0);
  }, [destination]);

  // Calculate progress based on waypoint progression
  const calculateProgress = () => {
    if (routeWaypoints.length === 0) return;
    
    const totalWaypoints = routeWaypoints.length - 1;
    const waypointProgress = currentWaypointIndex / totalWaypoints;
    
    // Add sub-progress within current waypoint segment
    if (currentWaypointIndex < routeWaypoints.length - 1) {
      const currentWaypoint = routeWaypoints[currentWaypointIndex];
      const nextWaypoint = routeWaypoints[currentWaypointIndex + 1];
      
      const courierTop = parseFloat(courierPosition.top);
      const courierLeft = parseFloat(courierPosition.left);
      const currentTop = parseFloat(currentWaypoint.top);
      const currentLeft = parseFloat(currentWaypoint.left);
      const nextTop = parseFloat(nextWaypoint.top);
      const nextLeft = parseFloat(nextWaypoint.left);
      
      const segmentDistance = Math.sqrt(
        Math.pow(nextTop - currentTop, 2) + Math.pow(nextLeft - currentLeft, 2)
      );
      
      const progressInSegment = Math.sqrt(
        Math.pow(courierTop - currentTop, 2) + Math.pow(courierLeft - currentLeft, 2)
      );
      
      const segmentProgress = Math.min(1, progressInSegment / segmentDistance);
      const totalProgress = ((currentWaypointIndex + segmentProgress) / totalWaypoints) * 100;
      
      setProgress(hasReachedDestination ? 100 : Math.min(99, totalProgress));
    } else {
      setProgress(hasReachedDestination ? 100 : 95);
    }
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
    setCourierPosition({ top: "35%", left: "50%" }); // Reset to Pool Bar
    setEta(8);
    setProgress(0);
    setHasReachedDestination(false);
    setHasShownCloseNotification(false);
    setCurrentWaypointIndex(0);
  };

  // Auto-move courier when navigating using waypoints
  useEffect(() => {
    if (!isNavigating || routeWaypoints.length === 0) return;

    const interval = setInterval(() => {
      setCourierPosition(current => {
        const currentTop = parseFloat(current.top);
        const currentLeft = parseFloat(current.left);
        
        // Get the current target waypoint
        const targetWaypoint = routeWaypoints[currentWaypointIndex];
        if (!targetWaypoint) return current;
        
        const targetTop = parseFloat(targetWaypoint.top);
        const targetLeft = parseFloat(targetWaypoint.left);
        
        const dx = targetLeft - currentLeft;
        const dy = targetTop - currentTop;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if we've reached the current waypoint
        if (distance < 2) {
          if (currentWaypointIndex < routeWaypoints.length - 1) {
            // Move to next waypoint
            setCurrentWaypointIndex(prev => prev + 1);
            return current;
          } else {
            // Reached final destination
            const finalDistance = Math.sqrt(
              Math.pow(parseFloat(destinationPos.top) - currentTop, 2) + 
              Math.pow(parseFloat(destinationPos.left) - currentLeft, 2)
            );
            
            // Show notification when within ~10ft of customer
            if (finalDistance < 8 && !hasShownCloseNotification && !hasReachedDestination) {
              setHasShownCloseNotification(true);
              toast({
                variant: "warning",
                title: "🎯 Almost there!",
                description: "You're within 10ft of the customer. Get ready to complete delivery!",
                duration: 4000,
                className: "border-l-4 border-l-yellow-400",
              });
            }
            
            if (finalDistance < 3) {
              setIsNavigating(false);
              setHasReachedDestination(true);
              setProgress(100);
              return current;
            }
          }
        }
        
        // Move towards current target waypoint
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
  }, [isNavigating, routeWaypoints, currentWaypointIndex, destinationPos, hasShownCloseNotification, hasReachedDestination]);

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
            <Badge variant={isNavigating ? "default" : "secondary"} className="text-xs">
              {isNavigating ? "Navigating" : "Ready"}
            </Badge>
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
            {/* Space for close icon */}
          </div>
        </div>

        {/* Compact Progress Bar */}
        <Progress 
          value={progress} 
          className={`h-1.5 ${progress >= 100 ? '[&>div]:bg-green-500' : ''}`} 
        />
      </div>

      {/* Resort Map - Static Display */}
      <div className="flex-1 relative overflow-hidden bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: `url(${luxuryPoolDeckMap})` }}>
        <div className="absolute inset-0 bg-black/10"></div> {/* Slight overlay for better contrast */}
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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-medium">Pool Bar</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator - Top Left */}
          <div className="absolute top-4 left-4 z-40 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className={`text-xs font-medium ${progress >= 100 ? 'text-green-600' : 'text-foreground'}`}>
              {progress >= 100 ? 'Complete!' : `${Math.round(progress)}% Complete`}
            </div>
          </div>
          {/* Pool Bar Marker */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25"
            style={{ top: "35%", left: "50%" }}
          >
            <div className="relative">
              <MapPin className="h-8 w-8 text-amber-500 fill-amber-500 drop-shadow-lg" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                Pool Bar
              </div>
            </div>
          </div>

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
          
          {/* Route Path (curved path through waypoints when navigating) */}
          {isNavigating && routeWaypoints.length > 0 && (
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <pattern id="dashed" patternUnits="userSpaceOnUse" width="8" height="2">
                  <rect width="4" height="2" fill="#10b981" />
                </pattern>
              </defs>
              {/* Draw path through all waypoints */}
              {routeWaypoints.map((waypoint, index) => {
                if (index === 0) return null;
                const prevWaypoint = routeWaypoints[index - 1];
                return (
                  <line
                    key={`route-${index}`}
                    x1={`${parseFloat(prevWaypoint.left)}%`}
                    y1={`${parseFloat(prevWaypoint.top)}%`}
                    x2={`${parseFloat(waypoint.left)}%`}
                    y2={`${parseFloat(waypoint.top)}%`}
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeDasharray="12,8"
                    opacity={index <= currentWaypointIndex + 1 ? "0.9" : "0.4"}
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Current segment from courier to next waypoint */}
              {currentWaypointIndex < routeWaypoints.length - 1 && (
                <line
                  x1={`${parseFloat(courierPosition.left)}%`}
                  y1={`${parseFloat(courierPosition.top)}%`}
                  x2={`${parseFloat(routeWaypoints[currentWaypointIndex + 1].left)}%`}
                  y2={`${parseFloat(routeWaypoints[currentWaypointIndex + 1].top)}%`}
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeDasharray="12,8"
                  opacity="0.9"
                  strokeLinecap="round"
                />
              )}
            </svg>
          )}
          
          {/* Location Labels */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground shadow-xl z-30 max-w-[calc(100vw-140px)] truncate">
            📍 {destination}
          </div>
          
          <div 
            className="absolute bg-blue-500/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white shadow-xl z-30 whitespace-nowrap"
            style={{ 
              top: (() => {
                const courierTopPercent = parseFloat(courierPosition.top);
                const courierLeftPercent = parseFloat(courierPosition.left);
                
                // Check if courier is near bottom-left where destination label is
                const isNearDestinationLabel = courierTopPercent > 70 && courierLeftPercent < 40;
                
                if (isNearDestinationLabel) {
                  // Position above the courier when near destination label
                  return `calc(${courierPosition.top} - 40px)`;
                } else {
                  // Default position below courier
                  return `calc(${courierPosition.top} + 50px)`;
                }
              })(),
              left: (() => {
                const courierLeftPercent = parseFloat(courierPosition.left);
                
                if (courierLeftPercent > 85) {
                  // Far right - position to the left of courier
                  return `calc(${courierPosition.left} - 60px)`;
                } else if (courierLeftPercent < 15) {
                  // Far left - position to the right of courier  
                  return `calc(${courierPosition.left} + 30px)`;
                } else {
                  // Center - position normally
                  return `calc(${courierPosition.left} - 25px)`;
                }
              })(),
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