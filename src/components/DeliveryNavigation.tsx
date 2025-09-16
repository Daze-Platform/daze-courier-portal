import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Clock, Play, Pause, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DeliveryNavigationProps {
  destination: string;
  onComplete: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface MapLocation {
  id: string;
  name: string;
  position: Position;
  type: 'start' | 'destination' | 'landmark';
}

const DeliveryNavigation = ({ destination, onComplete }: DeliveryNavigationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [courierPosition, setCourierPosition] = useState<Position>({ x: 50, y: 350 });
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(8);
  const [totalDistance, setTotalDistance] = useState("0.7 mi");

  // Map locations based on destination
  const getMapLocations = (dest: string): { locations: MapLocation[], route: Position[] } => {
    const baseLocations: MapLocation[] = [
      { id: 'kitchen', name: 'Kitchen', position: { x: 50, y: 350 }, type: 'start' },
      { id: 'lobby', name: 'Main Lobby', position: { x: 200, y: 250 }, type: 'landmark' },
      { id: 'elevator', name: 'Elevator', position: { x: 300, y: 200 }, type: 'landmark' },
      { id: 'pool', name: 'Pool Area', position: { x: 450, y: 300 }, type: 'landmark' },
      { id: 'beach', name: 'Beach Access', position: { x: 500, y: 450 }, type: 'landmark' },
    ];

    let destinationLocation: MapLocation;
    let route: Position[];

    if (dest.includes("Room")) {
      destinationLocation = { id: 'room', name: dest, position: { x: 400, y: 150 }, type: 'destination' };
      route = [
        { x: 50, y: 350 },   // Kitchen
        { x: 200, y: 250 },  // Lobby  
        { x: 300, y: 200 },  // Elevator
        { x: 400, y: 150 }   // Room
      ];
    } else if (dest.includes("Pool")) {
      destinationLocation = { id: 'poolside', name: dest, position: { x: 450, y: 300 }, type: 'destination' };
      route = [
        { x: 50, y: 350 },   // Kitchen
        { x: 200, y: 250 },  // Lobby
        { x: 450, y: 300 }   // Pool
      ];
    } else if (dest.includes("Beach")) {
      destinationLocation = { id: 'beachside', name: dest, position: { x: 500, y: 450 }, type: 'destination' };
      route = [
        { x: 50, y: 350 },   // Kitchen
        { x: 200, y: 250 },  // Lobby
        { x: 500, y: 450 }   // Beach
      ];
    } else {
      destinationLocation = { id: 'other', name: dest, position: { x: 350, y: 200 }, type: 'destination' };
      route = [
        { x: 50, y: 350 },   // Kitchen
        { x: 350, y: 200 }   // Destination
      ];
    }

    return {
      locations: [...baseLocations, destinationLocation],
      route
    };
  };

  const { locations, route } = getMapLocations(destination);
  const destinationPos = locations.find(loc => loc.type === 'destination')?.position || { x: 350, y: 200 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw buildings/areas
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;

    // Main building
    ctx.fillRect(20, 100, 250, 300);
    ctx.strokeRect(20, 100, 250, 300);
    
    // Pool area
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(400, 250, 120, 100);
    ctx.strokeRect(400, 250, 120, 100);
    
    // Beach area
    ctx.fillStyle = '#eab308';
    ctx.fillRect(450, 400, 100, 80);
    ctx.strokeRect(450, 400, 100, 80);

    // Draw route path
    if (route.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(route[0].x, route[0].y);
      for (let i = 1; i < route.length; i++) {
        ctx.lineTo(route[i].x, route[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw locations
    locations.forEach((location) => {
      const { x, y } = location.position;
      
      if (location.type === 'start') {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.fillText(location.name, x + 12, y + 4);
      } else if (location.type === 'destination') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.fillText(location.name, x - 30, y - 15);
      } else {
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '10px sans-serif';
        ctx.fillText(location.name, x + 10, y + 3);
      }
    });

    // Draw courier position
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(courierPosition.x, courierPosition.y, 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Add courier pulse effect when navigating
    if (isNavigating) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(courierPosition.x, courierPosition.y, 20, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw distance line to destination
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(courierPosition.x, courierPosition.y);
    ctx.lineTo(destinationPos.x, destinationPos.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate distance for display
    const distance = Math.sqrt(
      Math.pow(destinationPos.x - courierPosition.x, 2) + 
      Math.pow(destinationPos.y - courierPosition.y, 2)
    );
    const totalRouteDistance = Math.sqrt(
      Math.pow(destinationPos.x - route[0].x, 2) + 
      Math.pow(destinationPos.y - route[0].y, 2)
    );
    
    setProgress(((totalRouteDistance - distance) / totalRouteDistance) * 100);

  }, [courierPosition, locations, route, isNavigating, destinationPos]);

  const startNavigation = () => {
    setIsNavigating(true);
  };

  const pauseNavigation = () => {
    setIsNavigating(false);
  };

  // Auto-move courier when navigating
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      setCourierPosition(current => {
        const dx = destinationPos.x - current.x;
        const dy = destinationPos.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 15) {
          // Reached destination
          setIsNavigating(false);
          onComplete();
          return current;
        }
        
        // Move towards destination
        const speed = 2;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;
        
        setEta(prev => Math.max(0, prev - 0.1));
        
        return {
          x: current.x + moveX,
          y: current.y + moveY
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isNavigating, destinationPos, onComplete]);

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

      {/* Interactive Map */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Resort Map
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Start</span>
            </div>
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
        
        <div className="border rounded-lg overflow-hidden bg-background">
          <canvas 
            ref={canvasRef}
            width={560}
            height={500}
            className="w-full h-auto max-w-full"
          />
        </div>
      </Card>

      {/* Navigation Controls */}
      <div className="flex gap-2">
        {!isNavigating ? (
          <Button onClick={startNavigation} className="flex-1" disabled={progress >= 99}>
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
          onClick={() => setCourierPosition({ x: 50, y: 350 })}
          variant="outline"
          disabled={isNavigating}
        >
          <Zap className="h-4 w-4 mr-2" />
          Reset Position
        </Button>
      </div>
    </div>
  );
};

export default DeliveryNavigation;