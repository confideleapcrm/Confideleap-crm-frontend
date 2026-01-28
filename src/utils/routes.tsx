/* eslint-disable react-refresh/only-export-components */
// // src/utils/routes.tsx
import React, { lazy } from "react";

const Dashboard = lazy(() => import("../components/Dashboard"));
const InvestorDatabase = lazy(() => import("../components/InvestorDatabase"));
const InvestorTargeting = lazy(() => import("../components/InvestorTargeting"));
const InvestorImport = lazy(() => import("../components/InvestorImport"));
const Campaigns = lazy(() => import("../components/Campaigns"));
const InvestorAnalytics = lazy(() => import("../components/InvestorAnalytics"));
const CampaignPerformance = lazy(
  () => import("../components/CampaignPerformance"),
);
const ROIAnalysis = lazy(() => import("../components/ROIAnalysis"));
const Reports = lazy(() => import("../components/Reports"));
const Settings = lazy(() => import("../components/Settings"));
const AddInvestor = lazy(() => import("../components/AddInvestor"));
const InvestorDetail = lazy(() => import("../components/InvestorDetail"));
const Login = lazy(() => import("../components/Login"));
const AddUser = lazy(() => import("../components/AddUser"));
const CustomerDatabase = lazy(() => import("../components/CustomerDatabase"));
const AddCustomer = lazy(() => import("../components/AddCustomer"));
const CustomerDetail = lazy(() => import("../components/CustomerDetail"));
const UserDetail = lazy(() => import("../components/UserDetail"));
const AddCompany = lazy(() => import("../components/AddCompany"));
const CompanyDetail = lazy(() => import("../components/CompanyDetail"));
const CompanyEmployees = lazy(() => import("../components/CompanyEmployees"));

export const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard, isProtected: true },
  {
    path: "/investor-database",
    component: InvestorDatabase,
    isProtected: true,
  },
  {
    path: "/customer-database",
    component: CustomerDatabase,
    isProtected: true,
  },
  {
    path: "/investor-targeting",
    component: InvestorTargeting,
    isProtected: true,
  },
  { path: "/import-investors", component: InvestorImport, isProtected: true },
  { path: "/campaigns", component: Campaigns, isProtected: true },
  {
    path: "/investor-analytics",
    component: InvestorAnalytics,
    isProtected: true,
  },
  {
    path: "/campaign-performance",
    component: CampaignPerformance,
    isProtected: true,
  },
  { path: "/roi-analysis", component: ROIAnalysis, isProtected: true },
  { path: "/reports", component: Reports, isProtected: true },
  { path: "/settings", component: Settings, isProtected: true },
  { path: "/add-investor", component: AddInvestor, isProtected: true },
  { path: "/add-customer", component: AddCustomer, isProtected: true },
  { path: "/add-user", component: AddUser, isProtected: true },
  { path: "/edit-user/:id", component: AddUser, isProtected: true },
  { path: "/edit-investor/:id", component: AddInvestor, isProtected: true },
  { path: "/edit-customer/:id", component: AddCustomer, isProtected: true },
  {
    path: "/investor-detail/:id",
    component: InvestorDetail,
    isProtected: true,
  },
  { path: "/user-detail/:id", component: UserDetail, isProtected: true },
  {
    path: "/customer-detail/:id",
    component: CustomerDetail,
    isProtected: true,
  },
  { path: "/add-company", component: AddCompany, isProtected: true },
  { path: "/edit-company/:id", component: AddCompany, isProtected: true },
  { path: "/company-detail/:id", component: CompanyDetail, isProtected: true },
  {
    path: "/company-employees/:companyId",
    component: CompanyEmployees,
    isProtected: true,
  },
];
