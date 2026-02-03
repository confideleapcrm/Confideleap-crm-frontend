// src/utils/helper.ts
// routes.config.ts
import {
  BarChart3,
  Target,
  Users,
  Upload,
  Building,
  Settings,
} from "lucide-react";

export const ROUTE_CONFIG = [
  { label: "Dashboard", icon: BarChart3, path: "/dashboard" },
  { label: "Investor Targeting", icon: Target, path: "/investor-targeting" },
  { label: "Investor Database", icon: Users, path: "/investor-database" },
  { label: "Import Investors", icon: Upload, path: "/import-investors" },
  { label: "Customer Database", icon: Building, path: "/customer-database" },
  { label: "Settings", icon: Settings, path: "/settings" },
];
