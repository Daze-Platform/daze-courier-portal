import { Package, FileText, Star, DollarSign, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const DesktopSidebar = () => {
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

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-sidebar lg:border-r lg:border-sidebar-border lg:top-16 lg:h-[calc(100vh-4rem)]">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 pt-6">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                item.active 
                  ? "bg-primary/10 text-primary hover:bg-primary/15" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DesktopSidebar;