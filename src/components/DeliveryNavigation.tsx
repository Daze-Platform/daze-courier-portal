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
  const [courierPosition, setCourierPosition] = useState<Position>({ top: "85%", left: "10%" });
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(8);
  const [totalDistance] = useState("0.7 mi");
  const [hasReachedDestination, setHasReachedDestination] = useState(false);
  const [hasShownCloseNotification, setHasShownCloseNotification] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [routeWaypoints, setRouteWaypoints] = useState<Position[]>([]);
  const [mapTransform, setMapTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  // Generate realistic waypoints that follow concrete walkways around the pool (NEVER through water)
  const generateRouteWaypoints = (destination: Position): Position[] => {
    const startPos = { top: "85%", left: "10%" };
    const waypoints = [startPos];
    
    // For pool/cabana destinations, route around the pool following the wide concrete perimeter path
    if (destination.top === "33%" && destination.left === "66%") {
      // Follow the wide concrete walkway that curves around the LEFT side of pool (staying well away from water)
      waypoints.push({ top: "82%", left: "12%" }); // Move slightly from kitchen
      waypoints.push({ top: "78%", left: "16%" }); // Start moving toward pool area
      waypoints.push({ top: "72%", left: "20%" }); // Move along bottom walkway
      waypoints.push({ top: "65%", left: "24%" }); // Continue on concrete path
      waypoints.push({ top: "58%", left: "28%" }); // Start curving left around pool
      waypoints.push({ top: "50%", left: "30%" }); // Mid-left side of pool (on concrete)
      waypoints.push({ top: "42%", left: "32%" }); // Upper left curve (staying on walkway)
      waypoints.push({ top: "35%", left: "36%" }); // Top left corner curve
      waypoints.push({ top: "30%", left: "42%" }); // Top side of pool (on concrete)
      waypoints.push({ top: "28%", left: "50%" }); // Top center of pool walkway
      waypoints.push({ top: "29%", left: "58%" }); // Top right curve
      waypoints.push({ top: "32%", left: "64%" }); // Final approach to cabana (staying on concrete)
    } else if (destination.top === "20%" && destination.left === "85%") {
      // Room destinations - go up the RIGHT side avoiding pool completely
      waypoints.push({ top: "82%", left: "15%" });
      waypoints.push({ top: "78%", left: "25%" });
      waypoints.push({ top: "72%", left: "35%" });
      waypoints.push({ top: "65%", left: "45%" });
      waypoints.push({ top: "55%", left: "55%" });
      waypoints.push({ top: "45%", left: "65%" });
      waypoints.push({ top: "35%", left: "75%" });
      waypoints.push({ top: "25%", left: "82%" });
    } else if (destination.top === "70%" && destination.left === "90%") {
      // Beach destinations - follow RIGHT side walkway around pool
      waypoints.push({ top: "82%", left: "15%" });
      waypoints.push({ top: "78%", left: "25%" });
      waypoints.push({ top: "74%", left: "35%" });
      waypoints.push({ top: "70%", left: "45%" });
      waypoints.push({ top: "68%", left: "55%" });
      waypoints.push({ top: "67%", left: "65%" });
      waypoints.push({ top: "68%", left: "75%" });
      waypoints.push({ top: "69%", left: "85%" });
    } else {
      // Default routing following wide concrete perimeter (LEFT side route)
      waypoints.push({ top: "80%", left: "15%" });
      waypoints.push({ top: "70%", left: "22%" });
      waypoints.push({ top: "55%", left: "28%" });
      waypoints.push({ top: "40%", left: "35%" });
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
    setCourierPosition({ top: "85%", left: "10%" });
    setEta(8);
    setProgress(0);
    setHasReachedDestination(false);
    setHasShownCloseNotification(false);
    setCurrentWaypointIndex(0);
    setMapTransform({ scale: 1, translateX: 0, translateY: 0 });
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

      {/* Full Screen Interactive Resort Map - Pokemon Go style on mobile */}
      <div 
        className={`flex-1 relative bg-accent/5 overflow-hidden ${isMobile ? 'cursor-grab active:cursor-grabbing' : ''}`}
        {...(isMobile ? {
          onMouseDown: (e) => {
            setIsDragging(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
          },
          onMouseMove: (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - lastMousePos.x;
            const deltaY = e.clientY - lastMousePos.y;
            setMapTransform(prev => ({
              ...prev,
              translateX: prev.translateX + deltaX / mapTransform.scale,
              translateY: prev.translateY + deltaY / mapTransform.scale
            }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
          },
          onMouseUp: () => setIsDragging(false),
          onMouseLeave: () => setIsDragging(false),
          onWheel: (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(0.8, Math.min(3, mapTransform.scale * delta));
            setMapTransform(prev => ({
              ...prev,
              scale: newScale
            }));
          },
          onTouchStart: (e) => {
            if (e.touches.length === 1) {
              setIsDragging(true);
              setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            }
          },
          onTouchMove: (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - lastMousePos.x;
            const deltaY = e.touches[0].clientY - lastMousePos.y;
            setMapTransform(prev => ({
              ...prev,
              translateX: prev.translateX + deltaX / mapTransform.scale,
              translateY: prev.translateY + deltaY / mapTransform.scale
            }));
            setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
          },
          onTouchEnd: () => setIsDragging(false)
        } : {})}
      >
        {/* Map Container with Transform - Oversized for continuous panning */}
        <div 
          className="absolute transition-transform duration-100"
          style={{
            width: '300%',
            height: '300%',
            top: '-100%',
            left: '-100%',
            transform: isMobile 
              ? `scale(${mapTransform.scale}) translate(${mapTransform.translateX}px, ${mapTransform.translateY}px)`
              : 'none',
            transformOrigin: 'center center'
          }}
        >
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
            <div className={`text-xs font-medium ${progress >= 100 ? 'text-green-600' : 'text-foreground'}`}>
              {progress >= 100 ? 'Complete!' : `${Math.round(progress)}% Complete`}
            </div>
          </div>
          
          <img 
            src={luxuryPoolDeckMap} 
            alt="Luxury resort map with navigation" 
            className="w-full h-full object-cover pointer-events-none"
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
                    strokeWidth="3"
                    strokeDasharray="8,6"
                    opacity={index <= currentWaypointIndex + 1 ? "0.7" : "0.3"}
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
                  strokeWidth="3"
                  strokeDasharray="8,6"
                  opacity="0.7"
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