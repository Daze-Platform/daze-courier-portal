import { Package, FileText, Star, DollarSign, HelpCircle, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useLocation, Link } from "react-router-dom";
import dazeLogo from "@/assets/daze-logo.png";

const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
  const location = useLocation();

  const menuItems = [
    {
      icon: Package,
      label: "Active Orders",
      path: "/",
      active: location.pathname === "/"
    },
    {
      icon: FileText,
      label: "Order History", 
      path: "/history",
      active: location.pathname === "/history"
    },
    {
      icon: Star,
      label: "Ratings",
      path: "/ratings", 
      active: location.pathname === "/ratings"
    },
    {
      icon: DollarSign,
      label: "Earnings",
      path: "/earnings",
      active: location.pathname === "/earnings"
    },
    {
      icon: HelpCircle,
      label: "Get Help",
      path: "/help",
      active: location.pathname === "/help"
    }
  ];

  // Mobile Sidebar (for Sheet)
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-sidebar overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-primary px-6 py-6 -mx-6 -mt-6 mb-6 relative">
          <div className="flex items-center gap-3 mb-1">
            <img src={dazeLogo} alt="Daze" className="h-6 w-6 object-contain" />
            <span className="text-lg font-bold text-primary-foreground tracking-wide">PORTAL</span>
          </div>
          <span className="text-xs font-medium text-primary-foreground/80 tracking-wider uppercase">
            DRIVER PORTAL
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  item.active 
                    ? "bg-primary/10 text-primary hover:bg-primary/15" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-12 px-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Ferdinand S.</p>
                    <p className="text-xs text-muted-foreground">Driver</p>
                  </div>
                </div>
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
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-sidebar lg:border-r lg:border-sidebar-border">
        {/* Header */}
        <div className="bg-gradient-primary p-6">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-6 w-6 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">PORTAL</span>
          </div>
          <span className="text-sm font-medium text-primary-foreground/90 tracking-wider">
            DRIVER PORTAL
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  item.active 
                    ? "bg-primary/10 text-primary hover:bg-primary/15" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-12 px-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Ferdinand S.</p>
                    <p className="text-xs text-muted-foreground">Driver</p>
                  </div>
                </div>
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

      {/* Desktop Top Bar */}
      <div className="hidden lg:block lg:ml-64 lg:sticky lg:top-0 lg:z-40 lg:bg-gradient-primary lg:shadow-medium">
        <div className="flex items-center justify-end px-6 py-4">
          <div className="flex items-center gap-4">
            <NotificationDropdown className="text-primary-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                  Ferdinand S.
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;