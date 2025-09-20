import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import dazeLogo from "@/assets/daze-logo.png";

const CourierHeader = () => {
  return (
    <header className="bg-gradient-primary shadow-medium sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src={dazeLogo} alt="Daze Logo" className="h-8 w-8" />
          </div>
          <span className="text-xl font-bold text-primary-foreground/90 tracking-wider">
            COURIER PORTAL
          </span>
        </div>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6 text-primary-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default CourierHeader;