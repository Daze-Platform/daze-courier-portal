import { Switch } from "@/components/ui/switch";
import { MapPin, Truck } from "lucide-react";
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
}

const StatusControl = ({ isOnline, onStatusChange }: StatusControlProps) => {
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
              className="data-[state=checked]:bg-success data-[state=unchecked]:bg-input"
            />
            <span className="text-sm font-medium text-foreground">{isOnline ? 'On' : 'Off'}</span>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Location</label>
          <Select defaultValue="hilton-barbados">
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border border-border shadow-lg z-50">
              <SelectItem value="hilton-barbados">Hilton Barbados</SelectItem>
              <SelectItem value="sandals-royal">Sandals Royal Caribbean</SelectItem>
              <SelectItem value="beaches-negril">Beaches Negril</SelectItem>
              <SelectItem value="hyatt-zilara">Hyatt Zilara Rose Hall</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Type */}
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground">Delivery type</label>
          <Select defaultValue="room-delivery">
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border border-border shadow-lg z-50">
              <SelectItem value="room-delivery">Room Delivery</SelectItem>
              <SelectItem value="poolside">Poolside Service</SelectItem>
              <SelectItem value="beach-service">Beach Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StatusControl;