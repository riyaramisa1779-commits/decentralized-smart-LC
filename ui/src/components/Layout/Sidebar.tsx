import React from "react";
import {
  Home,
  FileText,
  Users,
  DollarSign,
  Shield,
  Settings,
  TrendingUp,
  Archive,
  Package,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "registration", label: "Registration", icon: Users },
    { id: "deals", label: "Deals", icon: FileText },
    { id: "exporter", label: "Exporter", icon: Package },
    { id: "escrow", label: "Escrow", icon: DollarSign },
    { id: "documents", label: "Documents", icon: Archive },
    { id: "admin", label: "Admin Panel", icon: Shield },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="glass-effect w-64 min-h-screen border-r border-white/20">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
