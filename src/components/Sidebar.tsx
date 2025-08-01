import { 
  LayoutDashboard, 
  LinkedinIcon, 
  Briefcase, 
  Search, 
  FileText, 
  FolderOpen,
  History,
  HelpCircle,
  Menu,
  User
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "linkedin-scan", label: "LinkedIn Scan", icon: LinkedinIcon },
    { id: "job-tracker", label: "Job Tracker", icon: Briefcase },
    { id: "find-jobs", label: "Find Jobs", icon: Search },
    { id: "resume-builder", label: "Resume Builder", icon: FileText },
    { id: "resume-manager", label: "Resume Manager", icon: FolderOpen },
    { id: "scan-history", label: "Scan History", icon: History },
  ];

  return (
    <div className={cn(
      "bg-card border-r border-border h-screen transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">J</span>
              </div>
              <span className="font-semibold text-lg">Jobscan</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <Button 
            className="w-full mb-4"
            onClick={() => onItemClick("new-scan")}
          >
            {!isCollapsed && "New Scan"}
            {isCollapsed && <FileText className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeItem === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1",
                  isCollapsed && "px-2"
                )}
                onClick={() => onItemClick(item.id)}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "px-2"
          )}
        >
          <HelpCircle className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Help</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;