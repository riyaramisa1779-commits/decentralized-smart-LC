import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  DollarSign,
  Shield,
  Archive,
  Package,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/registration", label: "Registration", icon: Users },
    { path: "/deals", label: "Deals", icon: FileText },
    { path: "/exporter", label: "Exporter", icon: Package },
    { path: "/escrow", label: "Escrow", icon: DollarSign },
    { path: "/documents", label: "Documents", icon: Archive },
    { path: "/admin", label: "Admin Panel", icon: Shield },
  ];

  return (
    <aside className="glass-effect w-64 min-h-screen border-r border-white/20">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
