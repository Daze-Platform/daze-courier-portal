import { Package, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UnifiedHeader = () => {
  return (
    <header className="bg-gradient-primary shadow-medium sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Left: Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">PORTAL</span>
          </div>
          <div className="h-6 w-px bg-primary-foreground/30" />
          <span className="text-sm font-medium text-primary-foreground/90 tracking-wider">
            DRIVER PORTAL
          </span>
        </div>
        
        {/* Right: Notifications and User Profile */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 gap-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
                    FS
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium">Ferdinand S.</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;