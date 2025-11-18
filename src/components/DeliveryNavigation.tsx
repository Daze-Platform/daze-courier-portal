import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Play, Pause, Target, Info, User, UtensilsCrossed, ChefHat, PersonStanding, ChevronUp, ChevronDown, Phone, MessageCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import luxuryPoolDeckMap from "@/assets/luxury-pool-deck-hd.jpg";
import ResortImageView from "@/components/ResortImageView";
import OrderDetailsDrawer from "@/components/OrderDetailsDrawer";
import ChatInterface from "@/components/ChatInterface";

interface DeliveryNavigationProps {
  destination: string;
  deliveryType?: string;
  onComplete: () => void;
  order?: {
    orderId: string;
    restaurant: string;
    deliveryAddress: string;
    deliveryTime: string;
    deliveryType: string;
    customer: {
      name: string;
      avatar: string;
      phone: string;
    };
    items: Array<{
      name: string;
      price: number;
      modifications: string;
    }>;
    specialNotes?: string;
    total: number;
    earnings: {
      basePay: number;
      customerTip: number;
      additionalPay: number;
      total: number;
    };
  };
}

interface Position {
  top: string;
  left: string;
}

const DeliveryNavigation = ({ destination, deliveryType = "Room Delivery", onComplete, order }: DeliveryNavigationProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [courierPosition, setCourierPosition] = useState<Position>({ top: "85%", left: "25%" }); // Beach Bar starting position
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(8);
  const [totalDistance] = useState("0.7 mi");
  const [hasReachedDestination, setHasReachedDestination] = useState(false);
  const [hasShownCloseNotification, setHasShownCloseNotification] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [routeWaypoints, setRouteWaypoints] = useState<Position[]>([]);
  const [navigationStartTime, setNavigationStartTime] = useState<number>(0);
  const [totalEstimatedTime] = useState(8); // 8 seconds total navigation time
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [modalState, setModalState] = useState<'closed' | 'half' | 'full'>('closed');
  const [touchStartY, setTouchStartY] = useState(0);
  const [isScrollingModal, setIsScrollingModal] = useState(false);
  const [hasStartedNavigation, setHasStartedNavigation] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Simple click-based state management
  const handleModalAreaClick = () => {
    console.log('Modal area clicked, current state:', modalState);
    if (modalState === 'closed') {
      setModalState('half');
    } else if (modalState === 'half') {
      setModalState('full');
    } else {
      setModalState('half');
    }
  };

  // Touch handlers for mobile scroll detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setIsScrollingModal(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) return;
    
    const touchCurrentY = e.touches[0].clientY;
    const touchDiff = touchStartY - touchCurrentY;
    const element = e.currentTarget as HTMLElement;
    const isAtTop = element.scrollTop <= 5;
    
    // Only handle modal state changes, not normal scrolling
    if (Math.abs(touchDiff) > 50) { // Minimum swipe distance
      if (touchDiff > 0 && isAtTop && modalState === 'half') {
        // Swiping up at top - expand to full
        e.preventDefault();
        setModalState('full');
        setIsScrollingModal(true);
      } else if (touchDiff < 0 && isAtTop && modalState === 'full') {
        // Swiping down at top - collapse to half  
        e.preventDefault();
        setModalState('half');
        setIsScrollingModal(true);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(0);
    setIsScrollingModal(false);
  };
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Modal snap point handlers
  const getModalHeight = (state: 'closed' | 'half' | 'full') => {
    switch (state) {
      case 'closed': return '0%';
      case 'half': return '45%';
      case 'full': return '90%';
      default: return '0%';
    }
  };

  const handleModalToggle = () => {
    console.log('Modal toggle clicked, current state:', modalState);
    if (modalState === 'closed') {
      setModalState('half');
    } else {
      setModalState('closed');
    }
  };

  const handleScrollUp = () => {
    console.log('Scroll up detected, current state:', modalState);
    if (modalState === 'half') {
      setModalState('full');
    }
  };

  const handleScrollDown = () => {
    console.log('Scroll down detected, current state:', modalState);
    if (modalState === 'full') {
      setModalState('half');
    } else if (modalState === 'half') {
      setModalState('closed');
    }
  };

  // Delivery type detection - handle exact string matching
  const isBeachDelivery = deliveryType?.toLowerCase() === 'beach service';
  const isPoolDelivery = deliveryType?.toLowerCase() === 'poolside service';
  const isRoomDelivery = deliveryType?.toLowerCase() === 'room delivery';

  // Determine which map to show based on delivery type
  const getMapType = () => {
    if (isBeachDelivery) return 'beach';
    if (isPoolDelivery) return 'pool'; 
    if (isRoomDelivery) return 'room';
    return null;
  };

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
    const startPos = { top: "85%", left: "25%" }; // Beach Bar starting position
    const waypoints = [startPos];
    
    // For pool/umbrella destinations, route from beach bar to destination
    if (destination.top === "30%" && destination.left === "75%") {
      // Route to umbrella area from beach bar
      waypoints.push({ top: "70%", left: "40%" }); // Move up from beach bar
      waypoints.push({ top: "50%", left: "60%" }); // Continue toward pool area
      waypoints.push({ top: "30%", left: "70%" }); // Approach umbrella area on concrete deck
    } else if (destination.top === "20%" && destination.left === "85%") {
      // Room destinations - go toward rooms from beach bar
      waypoints.push({ top: "70%", left: "40%" }); // Move up from beach bar
      waypoints.push({ top: "40%", left: "60%" }); // Continue toward center
      waypoints.push({ top: "25%", left: "70%" }); // Continue toward rooms
      waypoints.push({ top: "20%", left: "80%" }); // Final approach to rooms
    } else if (destination.top === "70%" && destination.left === "90%") {
      // Beach destinations - route along beach from beach bar
      waypoints.push({ top: "80%", left: "40%" }); // Move slightly along beach
      waypoints.push({ top: "75%", left: "60%" }); // Continue along beach
      waypoints.push({ top: "70%", left: "85%" }); // Approach beach destination
    } else {
      // Default routing from beach bar to destination
      waypoints.push({ top: "70%", left: "40%" }); // Move up from beach bar
      waypoints.push({ top: "50%", left: "50%" }); // Move toward center
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

  // Calculate progress based on waypoint progression - smooth and consistent
  const calculateProgress = () => {
    if (routeWaypoints.length === 0) return;
    
    const totalWaypoints = routeWaypoints.length - 1;
    if (totalWaypoints === 0) return;
    
    // Simple, smooth progress calculation
    let baseProgress = (currentWaypointIndex / totalWaypoints) * 100;
    
    // Add smooth sub-progress for current segment
    if (currentWaypointIndex < routeWaypoints.length - 1) {
      const currentWaypoint = routeWaypoints[currentWaypointIndex];
      const nextWaypoint = routeWaypoints[currentWaypointIndex + 1];
      
      if (currentWaypoint && nextWaypoint) {
        const courierTop = parseFloat(courierPosition.top);
        const courierLeft = parseFloat(courierPosition.left);
        const currentTop = parseFloat(currentWaypoint.top);
        const currentLeft = parseFloat(currentWaypoint.left);
        const nextTop = parseFloat(nextWaypoint.top);
        const nextLeft = parseFloat(nextWaypoint.left);
        
        // Calculate distances
        const totalSegmentDistance = Math.sqrt(
          Math.pow(nextTop - currentTop, 2) + Math.pow(nextLeft - currentLeft, 2)
        );
        
        const remainingDistance = Math.sqrt(
          Math.pow(nextTop - courierTop, 2) + Math.pow(nextLeft - courierLeft, 2)
        );
        
        // Calculate segment completion (0-1) - progress within current segment
        const segmentCompletion = Math.max(0, Math.min(1, 
          (totalSegmentDistance - remainingDistance) / totalSegmentDistance
        ));
        
        // Add segment progress to base progress
        const segmentProgressContribution = (segmentCompletion / totalWaypoints) * 100;
        baseProgress += segmentProgressContribution;
      }
    }
    
    // Ensure progress only increases and never exceeds limits
    const newProgress = Math.max(progress, Math.min(hasReachedDestination ? 100 : 98, baseProgress));
    setProgress(newProgress);
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setNavigationStartTime(Date.now());
    setHasStartedNavigation(true);
  };

  const pauseNavigation = () => {
    setIsNavigating(false);
  };

  const completeDelivery = () => {
    onComplete();
  };

  const resetPosition = () => {
    setCourierPosition({ top: "85%", left: "25%" }); // Reset to Beach Bar
    setEta(8);
    setProgress(0);
    setHasReachedDestination(false);
    setHasShownCloseNotification(false);
    setCurrentWaypointIndex(0);
    setNavigationStartTime(0);
    // Only reset hasStartedNavigation for non-room deliveries to allow restart
    if (!isRoomDelivery) {
      setHasStartedNavigation(false);
    }
  };

  // Handle automatic completion based on time
  useEffect(() => {
    if (!isNavigating || navigationStartTime === 0) return;

    const completionTimer = setTimeout(() => {
      if (isNavigating && !hasReachedDestination) {
        setIsNavigating(false);
        setHasReachedDestination(true);
        setProgress(100);
      }
    }, totalEstimatedTime * 1000);

    return () => clearTimeout(completionTimer);
  }, [isNavigating, navigationStartTime, hasReachedDestination, totalEstimatedTime]);

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
            
            // Check for 3-second notification (time-based)
            const elapsedTime = (Date.now() - navigationStartTime) / 1000;
            const timeRemaining = totalEstimatedTime - elapsedTime;
            
            if (timeRemaining <= 3 && timeRemaining > 2.8 && !hasShownCloseNotification && !hasReachedDestination) {
              setHasShownCloseNotification(true);
              toast({
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
    <div className="min-h-screen min-h-dvh flex flex-col pb-24" style={{ 
      WebkitOverflowScrolling: 'touch',
      overflowY: 'auto',
      overscrollBehavior: 'auto',
      // Enable browser UI fade on scroll
      touchAction: 'manipulation',
      position: 'relative',
      // Ensure smooth scrolling that triggers browser UI hiding
      scrollBehavior: 'smooth'
    }}>
      {/* Compact Navigation Header */}
      <div 
        className="bg-background border-b border-border p-3 flex-shrink-0 sticky top-0 z-50"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="h-8 w-8 p-0"
              title="Exit Navigation"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <Progress 
          value={progress} 
          className={`h-1.5 ${progress >= 100 ? '[&>div]:bg-green-500' : ''}`} 
        />
      </div>

      {/* Resort Map - Show based on delivery type */}
      {isBeachDelivery || isPoolDelivery ? (
        <div className="flex-1 min-h-0 relative">
          <div 
            className="h-full w-full overflow-auto"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'auto', // Changed from 'contain' to 'auto' to allow browser UI fade
              minHeight: '50vh',
              touchAction: 'pan-y', // Allow vertical scrolling for browser UI fade
              position: 'relative'
            }}
          >
            <ResortImageView 
              destination={destination} 
              isDelivering={isNavigating}
              focusArea={getMapType()}
            />
          </div>
          

          {/* Order Details Panel - Smooth Bottom Sheet */}
          <div 
            className={`fixed bottom-0 left-0 right-0 z-20 bg-background rounded-t-xl shadow-2xl transition-all duration-700 ease-out ${
              modalState === 'closed' 
                ? 'transform translate-y-full opacity-0' 
                : 'transform translate-y-0 opacity-100'
            }`}
            style={{
              height: modalState === 'closed' ? '0%' : getModalHeight(modalState),
              maxHeight: '90vh'
            }}
          >
            {/* Header - Clickable to expand with drag handle */}
            <div 
              className="bg-background rounded-t-xl shadow-lg cursor-pointer hover:bg-muted/50 transition-colors animate-fade-in"
              onClick={handleModalAreaClick}
            >
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-muted-foreground/40 rounded-full hover:bg-muted-foreground/60 transition-colors" />
              </div>
              
              {/* Header - Always visible */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Order Details</h2>
                  <div className="flex items-center gap-2">
                    {modalState === 'half' && (
                      <ChevronUp className="h-5 w-5 text-muted-foreground animate-pulse" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalState('closed');
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Quick Summary for half state */}
                {modalState === 'half' && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span>Scroll up to see full details</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content - Only show for half/full states */}
            {(modalState === 'half' || modalState === 'full') && (
              <div 
                className={`bg-background flex-1 overflow-y-auto ${modalState === 'half' ? 'animate-fade-in' : 'animate-scale-in'}`}
                onWheel={(e) => {
                  const element = e.currentTarget;
                  const isAtTop = element.scrollTop <= 5;
                  const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 5;
                  
                  // Only prevent default and change states at content boundaries
                  if (e.deltaY < -30 && isAtTop && modalState === 'half') {
                    // Strong scroll up at top - expand to full
                    e.preventDefault();
                    console.log('Expanding to full via wheel');
                    setModalState('full');
                  } else if (e.deltaY > 30 && isAtTop && modalState === 'full') {
                    // Strong scroll down at top - collapse to half
                    e.preventDefault();
                    console.log('Collapsing to half via wheel');
                    setModalState('half');
                  }
                  // Otherwise allow normal scrolling within content
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  maxHeight: modalState === 'full' ? 'calc(100vh - 120px)' : 'calc(50vh - 120px)',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
                  scrollBehavior: 'smooth',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="px-6 pb-6 space-y-4">
                  {/* Customer Info Card */}
                  {order && (
                    <Card className="p-4 border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Delivery For</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button 
                            className="font-medium text-primary-foreground bg-primary hover:bg-primary/90 h-8 px-3"
                            size="sm"
                            onClick={() => setShowChatModal(true)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Delivery Address:</p>
                        <p className="text-muted-foreground">{destination}</p>
                      </div>
                    </Card>
                  )}

                  {/* Order Items Card */}
                  {order && (
                    <Card className="p-4 border border-border">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Items ({order.items.length})</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground">{item.name}</p>
                                  {item.modifications && (
                                    <p className="text-sm text-muted-foreground mt-0.5">{item.modifications}</p>
                                  )}
                                </div>
                                <p className="font-semibold text-foreground flex-shrink-0">${item.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-border mt-4 pt-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-foreground">Order Total</span>
                          <span className="text-foreground">${order.total}</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Special Instructions Card */}
                  {order?.specialNotes && (
                    <Card className="border-l-4 border-l-amber-400 bg-amber-50/50 border border-amber-200">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-600 text-sm">💬</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-amber-800 mb-2">Special Instructions</h4>
                            <p className="text-amber-700 leading-relaxed">{order.specialNotes}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Delivery Status Card */}
                  <Card className="p-4 border border-border">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Delivery Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="font-medium text-foreground">
                          {hasReachedDestination ? "Ready to Complete" : `${Math.round(progress)}%`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ETA</p>
                        <p className="font-medium text-foreground">{eta.toFixed(1)} min</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-medium text-foreground">{totalDistance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <Badge variant="outline" className="text-xs">{deliveryType}</Badge>
                      </div>
                    </div>
                   </Card>
                 </div>
               </div>
             )}
           </div>
         </div>
        ) : isRoomDelivery ? (
        <div className="flex-1 min-h-0 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-6" 
             style={{ 
               WebkitOverflowScrolling: 'touch', 
               paddingBottom: 'env(safe-area-inset-bottom, 20px)',
               overscrollBehavior: 'auto', // Allow browser UI fade
               touchAction: 'pan-y' // Enable vertical scrolling for browser UI
             }}>
          <div className="max-w-2xl mx-auto space-y-6 pb-6">
            {/* Room Number Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500 rounded-full mb-4">
                <span className="text-3xl font-bold text-white">
                  {destination.replace(/\D/g, '') || '###'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Room {destination}</h2>
              <p className="text-gray-600">Follow the instructions below to complete your delivery</p>
            </div>

            {/* Delivery Instructions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Delivery Instructions</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <p className="font-medium text-gray-900">Enter Main Lobby</p>
                    <p className="text-sm text-gray-600">Use the main entrance and approach the front desk area</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <p className="font-medium text-gray-900">Take Elevator</p>
                     <p className="text-sm text-gray-600">
                       Go to Floor {Math.floor(parseInt(destination.replace(/\D/g, '')) / 1000) || 1}
                       {destination.includes('0') && parseInt(destination.replace(/\D/g, '')) < 1000 && ' (Ground Floor)'}
                     </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <p className="font-medium text-gray-900">Follow Room Numbers</p>
                    <p className="text-sm text-gray-600">Look for room number signs in the hallway</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                  <div>
                    <p className="font-medium text-gray-900">Knock & Deliver</p>
                    <p className="text-sm text-gray-600">Announce "Room service delivery" and complete the order</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Type:</span>
                  <Badge variant="outline">{deliveryType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={hasReachedDestination ? "default" : "secondary"}>
                    {hasReachedDestination ? "Ready to Complete" : "In Progress"}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Navigation Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">💡 Navigation Tips</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Room numbers ending in 01-20 are usually on the left side</li>
                <li>• Room numbers ending in 21-40 are usually on the right side</li>
                <li>• Look for directional arrows near elevators</li>
                <li>• Ask front desk staff if you need assistance</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 relative bg-cover bg-center bg-no-repeat overflow-auto" 
             style={{ 
               backgroundImage: `url(${luxuryPoolDeckMap})`,
               WebkitOverflowScrolling: 'touch',
               minHeight: '50vh',
               paddingBottom: 'env(safe-area-inset-bottom, 20px)',
               overscrollBehavior: 'auto', // Allow browser UI fade
               touchAction: 'pan-y' // Enable vertical scrolling for browser UI
             }}>
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
                  <span className="text-xs font-medium">Beach Bar</span>
                </div>
              </div>
            </div>

            {/* Progress Indicator - Top Left */}
            <div className="absolute top-4 left-4 z-40 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className={`text-xs font-medium ${progress >= 100 ? 'text-green-600' : 'text-foreground'}`}>
                {progress >= 100 ? 'Complete!' : `${Math.round(progress)}% Complete`}
              </div>
            </div>
            {/* Beach Bar Marker */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25"
              style={{ top: "85%", left: "25%" }}
            >
              <div className="relative">
                <MapPin className="h-8 w-8 text-amber-500 fill-amber-500 drop-shadow-lg" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                  Beach Bar
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
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
            
            {/* Courier Position */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200 ease-linear"
              style={{ top: courierPosition.top, left: courierPosition.left }}
            >
               <div className="relative">
                 {/* Food Runner Avatar with Visual Elements */}
                 <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-3 border-white shadow-xl flex items-center justify-center relative overflow-hidden">
                   {/* Background pattern */}
                   <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full"></div>
                   
                    {/* Food delivery walking icon */}
                    <div className="relative z-10 flex items-center justify-center">
                      <PersonStanding className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                    
                    {/* Food delivery indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-blue-500 flex items-center justify-center">
                      <UtensilsCrossed className="h-1.5 w-1.5 text-blue-500" strokeWidth={3} />
                    </div>
                  </div>
                  
                  {/* "You" Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-lg">
                    🚶 You
                  </div>
                 
                  {/* GPS-style Navigation Arrow */}
                 {isNavigating && (
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                     <div 
                       className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center shadow-lg"
                       style={{
                         transform: `rotate(${Math.atan2(
                           parseFloat(destinationPos.top) - parseFloat(courierPosition.top),
                           parseFloat(destinationPos.left) - parseFloat(courierPosition.left)
                         ) * (180 / Math.PI)}deg)`,
                       }}
                     >
                       <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent border-b-white"></div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
            
            {/* Route Path - Professional GPS-style routing */}
            {isNavigating && routeWaypoints.length > 0 && (
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  {/* Professional gradient for route line */}
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                
                {/* Main route path through waypoints */}
                {routeWaypoints.map((waypoint, index) => {
                  if (index === 0) return null;
                  const prevWaypoint = routeWaypoints[index - 1];
                  const isCompleted = index <= currentWaypointIndex;
                  
                  return (
                    <g key={`route-segment-${index}`}>
                      {/* Background route line */}
                      <line
                        x1={`${parseFloat(prevWaypoint.left)}%`}
                        y1={`${parseFloat(prevWaypoint.top)}%`}
                        x2={`${parseFloat(waypoint.left)}%`}
                        y2={`${parseFloat(waypoint.top)}%`}
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      {/* Active route line */}
                      <line
                        x1={`${parseFloat(prevWaypoint.left)}%`}
                        y1={`${parseFloat(prevWaypoint.top)}%`}
                        x2={`${parseFloat(waypoint.left)}%`}
                        y2={`${parseFloat(waypoint.top)}%`}
                        stroke={isCompleted ? "#10b981" : "url(#routeGradient)"}
                        strokeWidth="4"
                        strokeDasharray={isCompleted ? "none" : "8,4"}
                        strokeDashoffset="0"
                        opacity={isCompleted ? "1" : "0.8"}
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
                
                {/* Current active segment */}
                {currentWaypointIndex < routeWaypoints.length - 1 && (
                  <g>
                    {/* Background */}
                    <line
                      x1={`${parseFloat(courierPosition.left)}%`}
                      y1={`${parseFloat(courierPosition.top)}%`}
                      x2={`${parseFloat(routeWaypoints[currentWaypointIndex + 1].left)}%`}
                      y2={`${parseFloat(routeWaypoints[currentWaypointIndex + 1].top)}%`}
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Active line */}
                    <line
                      x1={`${parseFloat(courierPosition.left)}%`}
                      y1={`${parseFloat(courierPosition.top)}%`}
                      x2={`${parseFloat(routeWaypoints[currentWaypointIndex + 1].left)}%`}
                      y2={`${parseFloat(routeWaypoints[currentWaypointIndex + 1].top)}%`}
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray="8,4"
                      strokeDashoffset="0"
                      opacity="1"
                      strokeLinecap="round"
                    />
                  </g>
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
      )}

      {/* Bottom Navigation Controls - Fixed positioning for all screen sizes */}
      <div className="bg-background border-t border-border p-4 mb-safe fixed bottom-0 left-0 right-0 z-50">
        <div className="flex gap-3 items-center">
          {!hasReachedDestination ? (
            <Button 
              onClick={startNavigation} 
              className="flex-1 h-12 text-base" 
              disabled={progress >= 95 || isNavigating || (isRoomDelivery && hasStartedNavigation)}
            >
              <Play className="h-5 w-5 mr-2" />
              {(isRoomDelivery && hasStartedNavigation) 
                ? 'Delivery Started' 
                : ((isBeachDelivery || isPoolDelivery) && hasStartedNavigation && !isNavigating)
                ? 'Resume Delivery'
                : 'Start Delivery'}
            </Button>
          ) : (
            <Button onClick={completeDelivery} className="flex-1 h-12 text-base bg-success hover:bg-success/90 text-white">
              <Target className="h-5 w-5 mr-2" />
              Complete Delivery
            </Button>
          )}
          
          {isNavigating && !hasReachedDestination && (
            <Button onClick={pauseNavigation} variant="outline" className="h-12 px-6">
              <Pause className="h-5 w-5" />
            </Button>
          )}
          {order && (
            <OrderDetailsDrawer 
              order={order}
              customTrigger={
                <Button 
                  variant="outline"
                  className="h-12 px-6"
                  title="View order details"
                >
                  <Info className="h-5 w-5" />
                </Button>
              }
            />
          )}
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

      {/* Chat Modal */}
      {order && (
        <Dialog open={showChatModal} onOpenChange={(open) => !open && setShowChatModal(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            <ChatInterface
              orderId={order.orderId}
              customerName={order.customer.name}
              deliveryStatus="active"
              onClose={() => setShowChatModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DeliveryNavigation;