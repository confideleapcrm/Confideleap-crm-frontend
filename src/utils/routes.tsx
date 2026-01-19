// src/utils/routes.tsx
import Dashboard from "../components/Dashboard";
import InvestorDatabase from "../components/InvestorDatabase";
import InvestorTargeting from "../components/InvestorTargeting";
import InvestorImport from "../components/InvestorImport";
import Campaigns from "../components/Campaigns";
import InvestorAnalytics from "../components/InvestorAnalytics";
import CampaignPerformance from "../components/CampaignPerformance";
import ROIAnalysis from "../components/ROIAnalysis";
import Reports from "../components/Reports";
import Settings from "../components/Settings";
import AddInvestor from "../components/AddInvestor";
import InvestorDetail from "../components/InvestorDetail";
import Login from "../components/Login";
import AddUser from "../components/AddUser";
import CustomerDatabase from "../components/CustomerDatabase";
import AddCustomer from "../components/AddCustomer";
import CustomerDetail  from "../components/CustomerDetail";
import UserDetail from "../components/UserDetail";

// Company related components (make sure these files exist)
import AddCompany from "../components/AddCompany";
import CompanyDetail from "../components/CompanyDetail";
import CompanyEmployees from "../components/CompanyEmployees";


export const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard, isProtected: true },
  { path: "/investor-database", component: InvestorDatabase, isProtected: true },
  { path: "/customer-database", component: CustomerDatabase, isProtected: true },
  { path: "/investor-targeting", component: InvestorTargeting, isProtected: true },
  { path: "/import-investors", component: InvestorImport, isProtected: true },
  { path: "/campaigns", component: Campaigns, isProtected: true },
  { path: "/investor-analytics", component: InvestorAnalytics, isProtected: true },
  { path: "/campaign-performance", component: CampaignPerformance, isProtected: true },
  { path: "/roi-analysis", component: ROIAnalysis, isProtected: true },
  { path: "/reports", component: Reports, isProtected: true },
  { path: "/settings", component: Settings, isProtected: true },
  { path: "/add-investor", component: AddInvestor, isProtected: true },
  { path: "/add-customer", component: AddCustomer, isProtected: true },
  { path: "/add-user", component: AddUser, isProtected: true },
  { path: "/edit-user/:id", component: AddUser, isProtected: true },
  { path: "/edit-investor/:id", component: AddInvestor, isProtected: true },
  { path: "/edit-customer/:id", component: AddCustomer, isProtected: true },
  { path: "/investor-detail/:id", component: InvestorDetail, isProtected: true },
  { path: "/user-detail/:id", component: UserDetail, isProtected: true },
  { path: "/customer-detail/:id", component: CustomerDetail, isProtected: true },

  // Company routes
  { path: "/add-company", component: AddCompany, isProtected: true },
  { path: "/edit-company/:id", component: AddCompany, isProtected: true },
  { path: "/company-detail/:id", component: CompanyDetail, isProtected: true },
  { path: "/company-employees/:companyId", component: CompanyEmployees, isProtected: true },
];
