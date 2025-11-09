import { Bell, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationDropdown from "@/components/NotificationDropdown";
import ferdinandProfile from "@/assets/ferdinand-profile.jpg";
import dazeLogo from "@/assets/daze-logo-new.png";
import Sidebar from "@/components/Sidebar";
import { Link } from "react-router-dom";

const UnifiedHeader = () => {
  return (
    <header className="bg-gradient-primary shadow-medium fixed top-0 left-0 right-0 z-[100] w-full pt-safe backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-2 lg:px-8">
        {/* Left: Mobile Menu + Logo and Branding */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button - Only visible on mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="p-0 w-64 border-0 [&>button]:absolute [&>button]:right-4 [&>button]:top-4 [&>button]:z-50 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:w-8 [&>button]:h-8 [&>button]:rounded-md [&>button]:bg-primary-foreground/10 [&>button]:text-primary-foreground [&>button]:hover:bg-primary-foreground/20 [&>button]:transition-colors [&>button]:duration-200"
            >
              <Sidebar isMobile={true} />
            </SheetContent>
          </Sheet>

          {/* Logo and Text */}
          <div className="flex items-center gap-2">
            <img src={dazeLogo} alt="Daze" className="h-8 w-8 object-contain" />
            <span className="text-sm font-medium text-primary-foreground/90 tracking-wider">
              COURIER PORTAL
            </span>
          </div>
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
                <div className="hidden sm:block text-left">
                  <div className="font-medium">Ferdinand S.</div>
                  <div className="text-xs text-primary-foreground/70">Runner</div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-lg">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                <Link to="/profile-settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20">
                <Link to="/help">Support</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/10 focus:bg-accent/20 text-destructive">
                <Link to="/auth">Sign Out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;