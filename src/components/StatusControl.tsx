import { Switch } from "@/components/ui/switch";
import { MapPin, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusControlProps {
  isOnline: boolean;
  onStatusChange: (status: boolean) => void;
  selectedDeliveryType?: string;
  onDeliveryTypeChange?: (type: string) => void;
}

const StatusControl = ({ isOnline, onStatusChange, selectedDeliveryType = "all", onDeliveryTypeChange }: StatusControlProps) => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-soft border border-border lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Account Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Account status</label>
          <div className="flex items-center gap-3">
            <Switch 
              checked={isOnline}
              onCheckedChange={onStatusChange}
              className="data-[state=checked]:bg-success data-[state=unchecked]:bg-input scale-[1.04] sm:scale-[1.02]"
            />
            <span className="text-sm font-medium text-foreground">{isOnline ? 'On' : 'Off'}</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Location</label>
          <Select defaultValue="hilton-barbados">
            <SelectTrigger className="w-full [&>span]:font-bold [&>span]:text-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <SelectValue placeholder="Select location" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border border-border shadow-lg z-50">
              <SelectItem value="hilton-barbados" className="font-bold">Hilton Barbados</SelectItem>
              <SelectItem value="sandals-royal" className="font-bold">Sandals Royal Caribbean</SelectItem>
              <SelectItem value="beaches-negril" className="font-bold">Beaches Negril</SelectItem>
              <SelectItem value="hyatt-zilara" className="font-bold">Hyatt Zilara Rose Hall</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Type */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground">Delivery type</label>
          <Select value={selectedDeliveryType} onValueChange={onDeliveryTypeChange}>
            <SelectTrigger className="w-full [&>span]:font-bold [&>span]:text-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border border-border shadow-lg z-50">
              <SelectItem value="all" className="font-bold">All Deliveries</SelectItem>
              <SelectItem value="room-delivery" className="font-bold">Room Service</SelectItem>
              <SelectItem value="poolside" className="font-bold">Poolside Service</SelectItem>
              <SelectItem value="beach-service" className="font-bold">Beach Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StatusControl;