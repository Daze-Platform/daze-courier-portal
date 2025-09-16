import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/NotificationDropdown";
import ferdinandProfile from "@/assets/ferdinand-profile.jpg";
import dazeLogo from "@/assets/daze-logo.png";

const UnifiedHeader = () => {
  return (
    <header className="bg-gradient-primary shadow-medium sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Left: Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src={dazeLogo} alt="Daze" className="h-8 w-8 object-contain" />
          </div>
          <div className="h-6 w-px bg-primary-foreground/30" />
          <span className="text-sm font-medium text-primary-foreground/90 tracking-wider">
            COURIER PORTAL
          </span>
        </div>
        
        {/* Right: Notifications and User Profile */}
        <div className="flex items-center gap-4">
          <NotificationDropdown className="text-primary-foreground hover:bg-primary-foreground/10" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 gap-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={ferdinandProfile} />
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
                    FS
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium">Ferdinand S.</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-lg">
              <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                Support
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;