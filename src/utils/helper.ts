// src/utils/helper.ts
import {
  Users,
  Target,
  Settings,
  FileText,
  BarChart3,
  Megaphone,
  Activity,
  PieChart,
  Calculator,
  Upload,
  Building
} from "lucide-react";

export const configObject = {
  navigation: [
    {
      name: "Dashboard",
      icon: BarChart3,
      path: "/dashboard" as const,
    },
    {
      name: "Investor Targeting",
      icon: Target,
      path: "/investor-targeting" as const,
    },
    { name: "Investor Database", icon: Users, path: "/investor-database" as const },
    {
      name: "Import Investors",
      icon: Upload,
      path: "/import-investors" as const,
    },
    {
      name: "Customer Database",
      icon: Building,
      path: "/customer-database" as const,
    },
    { name: "Campaigns", icon: Megaphone, path: "/campaigns" as const },
    {
      name: "Investor Analytics",
      icon: Activity,
      path: "/investor-analytics" as const,
    },
    {
      name: "Campaign Performance",
      icon: PieChart,
      path: "/campaign-performance" as const,
    },
    { name: "ROI Analysis", icon: Calculator, path: "/roi-analysis" as const },
    { name: "Reports", icon: FileText, path: "/reports" as const },
    { name: "Settings", icon: Settings, path: "/settings" as const },
  ],
};
