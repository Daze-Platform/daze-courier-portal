import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, ArrowRight, CheckCircle, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface NavigationStep {
  id: number;
  instruction: string;
  distance: string;
  type: 'start' | 'turn' | 'straight' | 'destination';
  completed: boolean;
}

interface DeliveryNavigationProps {
  destination: string;
  onComplete: () => void;
}

const DeliveryNavigation = ({ destination, onComplete }: DeliveryNavigationProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [eta, setEta] = useState(8); // minutes
  const [totalDistance, setTotalDistance] = useState("0.7 mi");
  
  // Mock navigation steps based on destination
  const getNavigationSteps = (dest: string): NavigationStep[] => {
    if (dest.includes("Room")) {
      return [
        { id: 1, instruction: "Start from Kitchen - Main Building", distance: "0.0 mi", type: 'start', completed: false },
        { id: 2, instruction: "Head north toward Main Lobby", distance: "0.1 mi", type: 'straight', completed: false },
        { id: 3, instruction: "Take elevator to Floor 12", distance: "0.1 mi", type: 'turn', completed: false },
        { id: 4, instruction: "Turn right down hallway", distance: "0.2 mi", type: 'turn', completed: false },
        { id: 5, instruction: "Continue straight to room corridor", distance: "0.2 mi", type: 'straight', completed: false },
        { id: 6, instruction: `Arrive at ${dest}`, distance: "0.1 mi", type: 'destination', completed: false }
      ];
    } else if (dest.includes("Pool")) {
      return [
        { id: 1, instruction: "Start from Kitchen - Main Building", distance: "0.0 mi", type: 'start', completed: false },
        { id: 2, instruction: "Exit through Pool Terrace doors", distance: "0.1 mi", type: 'straight', completed: false },
        { id: 3, instruction: "Walk along poolside path", distance: "0.3 mi", type: 'straight', completed: false },
        { id: 4, instruction: "Turn left toward cabana area", distance: "0.2 mi", type: 'turn', completed: false },
        { id: 5, instruction: `Arrive at ${dest}`, distance: "0.1 mi", type: 'destination', completed: false }
      ];
    } else if (dest.includes("Beach")) {
      return [
        { id: 1, instruction: "Start from Kitchen - Main Building", distance: "0.0 mi", type: 'start', completed: false },
        { id: 2, instruction: "Head toward Beach Access Path", distance: "0.2 mi", type: 'straight', completed: false },
        { id: 3, instruction: "Take beach walkway", distance: "0.3 mi", type: 'straight', completed: false },
        { id: 4, instruction: "Turn right along shoreline", distance: "0.1 mi", type: 'turn', completed: false },
        { id: 5, instruction: `Arrive at ${dest}`, distance: "0.1 mi", type: 'destination', completed: false }
      ];
    }
    
    return [
      { id: 1, instruction: "Start from Kitchen", distance: "0.0 mi", type: 'start', completed: false },
      { id: 2, instruction: `Navigate to ${dest}`, distance: "0.5 mi", type: 'straight', completed: false },
      { id: 3, instruction: `Arrive at ${dest}`, distance: "0.2 mi", type: 'destination', completed: false }
    ];
  };

  const [steps, setSteps] = useState<NavigationStep[]>(getNavigationSteps(destination));

  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  const getStepIcon = (type: NavigationStep['type']) => {
    switch (type) {
      case 'start':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'turn':
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      case 'straight':
        return <ArrowRight className="h-4 w-4 text-gray-600" />;
      case 'destination':
        return <MapPin className="h-4 w-4 text-red-600" />;
      default:
        return <Navigation className="h-4 w-4 text-gray-600" />;
    }
  };

  const startNavigation = () => {
    setIsNavigating(true);
  };

  const pauseNavigation = () => {
    setIsNavigating(false);
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const newSteps = [...steps];
      newSteps[currentStepIndex].completed = true;
      setSteps(newSteps);
      setCurrentStepIndex(currentStepIndex + 1);
      setEta(eta - 1);
      
      if (currentStepIndex === steps.length - 2) {
        // Reached destination
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }
  };

  // Auto-advance steps when navigating
  useEffect(() => {
    if (isNavigating && currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        nextStep();
      }, 3000); // 3 seconds per step for demo

      return () => clearTimeout(timer);
    }
  }, [isNavigating, currentStepIndex]);

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
              <h3 className="font-semibold text-foreground">Delivery Navigation</h3>
              <p className="text-sm text-muted-foreground">To: {destination}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{eta} min</span>
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

      {/* Current Step */}
      {currentStepIndex < steps.length && (
        <Card className="p-4 border-l-4 border-l-primary bg-primary/5">
          <div className="flex items-center gap-3">
            {getStepIcon(steps[currentStepIndex].type)}
            <div className="flex-1">
              <p className="font-medium text-foreground">
                Step {currentStepIndex + 1}: {steps[currentStepIndex].instruction}
              </p>
              <p className="text-sm text-muted-foreground">
                Distance: {steps[currentStepIndex].distance}
              </p>
            </div>
            <Badge variant="secondary">Current</Badge>
          </div>
        </Card>
      )}

      {/* Navigation Controls */}
      <div className="flex gap-2">
        {!isNavigating ? (
          <Button onClick={startNavigation} className="flex-1" disabled={currentStepIndex >= steps.length - 1}>
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
          onClick={nextStep} 
          variant="outline"
          disabled={currentStepIndex >= steps.length - 1}
        >
          Next Step
        </Button>
      </div>

      {/* All Steps List */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-3">All Steps</h4>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                index === currentStepIndex 
                  ? 'bg-primary/10 border border-primary/20' 
                  : step.completed 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-muted/30'
              }`}
            >
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  getStepIcon(step.type)
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.completed ? 'text-green-700 line-through' : 'text-foreground'
                }`}>
                  {step.instruction}
                </p>
                <p className="text-xs text-muted-foreground">{step.distance}</p>
              </div>
              
              <Badge variant={
                index === currentStepIndex ? 'default' : 
                step.completed ? 'secondary' : 'outline'
              } className="text-xs">
                {index === currentStepIndex ? 'Current' : 
                 step.completed ? 'Done' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DeliveryNavigation;