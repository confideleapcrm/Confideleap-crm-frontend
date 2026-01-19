// import React, { useState } from 'react';
// import { 
//   BarChart3, 
//   PieChart, 
//   TrendingUp, 
//   Download, 
//   Filter, 
//   Calendar,
//   Users,
//   Target,
//   MessageCircle,
//   DollarSign,
//   Clock,
//   CheckCircle,
//   Mail,
//   Phone,
//   Eye,
//   ArrowUpRight,
//   ArrowDownRight,
//   FileText,
//   Settings,
//   RefreshCw,
//   Share2,
//   Printer,
//   ChevronDown,
//   Search
// } from 'lucide-react';

// const Reports = () => {
//   const [selectedReport, setSelectedReport] = useState('overview');
//   const [dateRange, setDateRange] = useState('30d');
//   const [selectedMetrics, setSelectedMetrics] = useState(['investors', 'campaigns', 'pipeline']);

//   const reportTypes = [
//     { id: 'overview', name: 'Executive Overview', icon: BarChart3, description: 'High-level performance metrics' },
//     { id: 'pipeline', name: 'Pipeline Analysis', icon: TrendingUp, description: 'Investment pipeline tracking' },
//     { id: 'campaigns', name: 'Campaign Performance', icon: Target, description: 'Outreach campaign analytics' },
//     { id: 'investors', name: 'Investor Analytics', icon: Users, description: 'Investor relationship insights' },
//     { id: 'engagement', name: 'Engagement Report', icon: MessageCircle, description: 'Communication effectiveness' },
//     { id: 'roi', name: 'ROI Analysis', icon: DollarSign, description: 'Return on investment metrics' }
//   ];

//   const executiveMetrics = [
//     {
//       name: 'Total Pipeline Value',
//       value: '$847M',
//       change: '+18.2%',
//       changeType: 'positive',
//       period: 'vs last quarter'
//     },
//     {
//       name: 'Active Investors',
//       value: '2,847',
//       change: '+12.5%',
//       changeType: 'positive',
//       period: 'vs last quarter'
//     },
//     {
//       name: 'Conversion Rate',
//       value: '34.2%',
//       change: '-2.1%',
//       changeType: 'negative',
//       period: 'vs last quarter'
//     },
//     {
//       name: 'Avg. Deal Size',
//       value: '$15.2M',
//       change: '+8.7%',
//       changeType: 'positive',
//       period: 'vs last quarter'
//     }
//   ];

//   const pipelineData = [
//     { stage: 'Initial Contact', count: 847, value: '$2.1B', conversion: '28%' },
//     { stage: 'Qualified Interest', count: 234, value: '$847M', conversion: '45%' },
//     { stage: 'Due Diligence', count: 67, value: '$312M', conversion: '62%' },
//     { stage: 'Term Sheet', count: 12, value: '$89M', conversion: '75%' },
//     { stage: 'Closed', count: 4, value: '$23M', conversion: '100%' }
//   ];

//   const campaignMetrics = [
//     {
//       name: 'Series B Outreach',
//       sent: 145,
//       opened: 89,
//       replied: 34,
//       meetings: 12,
//       conversion: '23.4%',
//       status: 'active'
//     },
//     {
//       name: 'FinTech Focus',
//       sent: 98,
//       opened: 67,
//       replied: 28,
//       meetings: 8,
//       conversion: '28.6%',
//       status: 'active'
//     },
//     {
//       name: 'AI/ML Investors',
//       sent: 76,
//       opened: 52,
//       replied: 19,
//       meetings: 6,
//       conversion: '25.0%',
//       status: 'paused'
//     },
//     {
//       name: 'Growth Stage',
//       sent: 234,
//       opened: 156,
//       replied: 67,
//       meetings: 23,
//       conversion: '28.6%',
//       status: 'completed'
//     }
//   ];

//   const topPerformingInvestors = [
//     {
//       name: 'Emily Park',
//       firm: 'GV (Google Ventures)',
//       interactions: 24,
//       responseRate: '89%',
//       lastActivity: '2 days ago',
//       status: 'hot'
//     },
//     {
//       name: 'Michael Chen',
//       firm: 'Andreessen Horowitz',
//       interactions: 18,
//       responseRate: '76%',
//       lastActivity: '3 days ago',
//       status: 'hot'
//     },
//     {
//       name: 'Sarah Williams',
//       firm: 'Sequoia Capital',
//       interactions: 15,
//       responseRate: '82%',
//       lastActivity: '1 week ago',
//       status: 'warm'
//     },
//     {
//       name: 'Lisa Zhang',
//       firm: 'Index Ventures',
//       interactions: 12,
//       responseRate: '67%',
//       lastActivity: '2 weeks ago',
//       status: 'contacted'
//     }
//   ];

//   const engagementData = [
//     { channel: 'Email', sent: 1247, opened: 834, replied: 298, rate: '23.9%' },
//     { channel: 'LinkedIn', sent: 456, opened: 312, replied: 89, rate: '19.5%' },
//     { channel: 'Phone', attempted: 234, connected: 156, meetings: 67, rate: '28.6%' },
//     { channel: 'Events', attended: 12, contacts: 89, followups: 34, rate: '38.2%' }
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'hot': return 'bg-red-100 text-red-800';
//       case 'warm': return 'bg-yellow-100 text-yellow-800';
//       case 'contacted': return 'bg-green-100 text-green-800';
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'paused': return 'bg-yellow-100 text-yellow-800';
//       case 'completed': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const renderOverviewReport = () => (
//     <div className="space-y-6">
//       {/* Executive Summary */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-6">Executive Summary</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {executiveMetrics.map((metric, index) => (
//             <div key={index} className="text-center">
//               <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
//               <p className="text-sm font-medium text-gray-600 mt-1">{metric.name}</p>
//               <div className="flex items-center justify-center mt-2">
//                 {metric.changeType === 'positive' ? (
//                   <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
//                 ) : (
//                   <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
//                 )}
//                 <span className={`text-sm font-medium ${
//                   metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
//                 }`}>
//                   {metric.change}
//                 </span>
//                 <span className="text-xs text-gray-500 ml-1">{metric.period}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Pipeline Visualization */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Overview</h3>
//         <div className="space-y-4">
//           {pipelineData.map((stage, index) => (
//             <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex-1">
//                 <h4 className="text-sm font-medium text-gray-900">{stage.stage}</h4>
//                 <p className="text-xs text-gray-500">{stage.count} investors • {stage.value}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-semibold text-blue-600">{stage.conversion}</p>
//                 <p className="text-xs text-gray-500">conversion</p>
//               </div>
//               <div className="ml-4 w-24 bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-blue-600 h-2 rounded-full" 
//                   style={{ width: stage.conversion }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Top Performing Campaigns */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Performance</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Sent</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Opened</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Replied</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Meetings</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Conversion</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {campaignMetrics.map((campaign, index) => (
//                 <tr key={index} className="border-b border-gray-100">
//                   <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
//                   <td className="py-3 px-4 text-gray-600">{campaign.sent}</td>
//                   <td className="py-3 px-4 text-gray-600">{campaign.opened}</td>
//                   <td className="py-3 px-4 text-gray-600">{campaign.replied}</td>
//                   <td className="py-3 px-4 text-gray-600">{campaign.meetings}</td>
//                   <td className="py-3 px-4 font-medium text-green-600">{campaign.conversion}</td>
//                   <td className="py-3 px-4">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
//                       {campaign.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPipelineReport = () => (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Analysis</h3>
        
//         {/* Pipeline Chart Placeholder */}
//         <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mb-6">
//           <div className="text-center">
//             <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-2" />
//             <p className="text-sm text-gray-600">Pipeline trend chart would appear here</p>
//             <p className="text-xs text-gray-500">Showing progression over time</p>
//           </div>
//         </div>

//         {/* Detailed Pipeline Breakdown */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {pipelineData.map((stage, index) => (
//             <div key={index} className="border border-gray-200 rounded-lg p-4">
//               <h4 className="font-medium text-gray-900 mb-2">{stage.stage}</h4>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Investors:</span>
//                   <span className="text-sm font-medium text-gray-900">{stage.count}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Total Value:</span>
//                   <span className="text-sm font-medium text-gray-900">{stage.value}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Conversion:</span>
//                   <span className="text-sm font-medium text-green-600">{stage.conversion}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderEngagementReport = () => (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Analysis</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {engagementData.map((channel, index) => (
//             <div key={index} className="border border-gray-200 rounded-lg p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-medium text-gray-900">{channel.channel}</h4>
//                 <span className="text-lg font-bold text-blue-600">{channel.rate}</span>
//               </div>
              
//               <div className="space-y-2">
//                 {channel.sent && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Sent:</span>
//                     <span className="font-medium">{channel.sent}</span>
//                   </div>
//                 )}
//                 {channel.opened && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Opened:</span>
//                     <span className="font-medium">{channel.opened}</span>
//                   </div>
//                 )}
//                 {channel.replied && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Replied:</span>
//                     <span className="font-medium">{channel.replied}</span>
//                   </div>
//                 )}
//                 {channel.attempted && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Attempted:</span>
//                     <span className="font-medium">{channel.attempted}</span>
//                   </div>
//                 )}
//                 {channel.connected && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Connected:</span>
//                     <span className="font-medium">{channel.connected}</span>
//                   </div>
//                 )}
//                 {channel.meetings && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Meetings:</span>
//                     <span className="font-medium text-green-600">{channel.meetings}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Top Performing Investors */}
//         <div className="border-t border-gray-200 pt-6">
//           <h4 className="font-medium text-gray-900 mb-4">Top Performing Investors</h4>
//           <div className="space-y-3">
//             {topPerformingInvestors.map((investor, index) => (
//               <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <p className="font-medium text-gray-900">{investor.name}</p>
//                   <p className="text-sm text-gray-600">{investor.firm}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-900">{investor.interactions} interactions</p>
//                   <p className="text-sm text-green-600">{investor.responseRate} response rate</p>
//                 </div>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investor.status)}`}>
//                   {investor.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderReportContent = () => {
//     switch (selectedReport) {
//       case 'overview':
//         return renderOverviewReport();
//       case 'pipeline':
//         return renderPipelineReport();
//       case 'engagement':
//         return renderEngagementReport();
//       default:
//         return (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Report Coming Soon</h3>
//             <p className="text-gray-600">This report type is currently being developed.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Comprehensive insights into your investor relations performance
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <select 
//                 value={dateRange}
//                 onChange={(e) => setDateRange(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="7d">Last 7 days</option>
//                 <option value="30d">Last 30 days</option>
//                 <option value="90d">Last 90 days</option>
//                 <option value="6m">Last 6 months</option>
//                 <option value="1y">Last year</option>
//                 <option value="custom">Custom range</option>
//               </select>
              
//               <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
//                 <RefreshCw className="w-4 h-4" />
//                 <span>Refresh</span>
//               </button>
              
//               <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
//                 <Share2 className="w-4 h-4" />
//                 <span>Share</span>
//               </button>
              
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
//                 <Download className="w-4 h-4" />
//                 <span>Export</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         {/* Report Navigation Sidebar */}
//         <div className="w-80 bg-white shadow-sm border-r border-gray-200 min-h-screen">
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
            
//             <div className="space-y-2">
//               {reportTypes.map((report) => {
//                 const Icon = report.icon;
//                 return (
//                   <button
//                     key={report.id}
//                     onClick={() => setSelectedReport(report.id)}
//                     className={`w-full text-left p-3 rounded-lg transition-colors ${
//                       selectedReport === report.id
//                         ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                         : 'hover:bg-gray-50 text-gray-700'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <Icon className={`w-5 h-5 mr-3 ${
//                         selectedReport === report.id ? 'text-blue-600' : 'text-gray-400'
//                       }`} />
//                       <div>
//                         <p className="font-medium">{report.name}</p>
//                         <p className="text-xs text-gray-500">{report.description}</p>
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Report Filters */}
//             <div className="mt-8">
//               <h4 className="text-sm font-medium text-gray-900 mb-3">Filters</h4>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-2">Metrics</label>
//                   <div className="space-y-2">
//                     {['investors', 'campaigns', 'pipeline', 'engagement'].map((metric) => (
//                       <label key={metric} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={selectedMetrics.includes(metric)}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setSelectedMetrics([...selectedMetrics, metric]);
//                             } else {
//                               setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
//                             }
//                           }}
//                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
//                         />
//                         <span className="text-sm text-gray-700 capitalize">{metric}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-2">Investor Status</label>
//                   <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                     <option value="all">All Status</option>
//                     <option value="hot">Hot</option>
//                     <option value="warm">Warm</option>
//                     <option value="cold">Cold</option>
//                     <option value="contacted">Contacted</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-2">Campaign Type</label>
//                   <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                     <option value="all">All Campaigns</option>
//                     <option value="email">Email Campaigns</option>
//                     <option value="linkedin">LinkedIn Outreach</option>
//                     <option value="events">Event Follow-ups</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Scheduled Reports */}
//             <div className="mt-8">
//               <h4 className="text-sm font-medium text-gray-900 mb-3">Scheduled Reports</h4>
//               <div className="space-y-2">
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm font-medium text-gray-900">Weekly Executive Summary</p>
//                   <p className="text-xs text-gray-500">Every Monday at 9:00 AM</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm font-medium text-gray-900">Monthly Pipeline Report</p>
//                   <p className="text-xs text-gray-500">1st of every month</p>
//                 </div>
//               </div>
              
//               <button className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
//                 + Schedule New Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Report Content */}
//         <div className="flex-1 p-6">
//           {renderReportContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;























// src/components/Reports.tsx
import React, { useEffect, useMemo, useState } from "react";
import httpClient from "../lib/httpClient";
import { Users, User, Building2, X, Search } from "lucide-react";

/* ================= TYPES ================= */
type EntityType =
  | "user"
  | "investor"
  | "company"
  | "all_user"
  | "all_investor"
  | "all_company";

type ActivityTab =
  | "all"
  | "interested"
  | "followups"
  | "not_interested"
  | "meeting_scheduled"
  | "meeting_done";

interface Activity {
  activity_date: string;
  user_name?: string;
  investor_name?: string;
  company_name?: string;
  activity_type: ActivityTab;
}

interface SearchOption {
  id: string;
  label: string;
}

interface Assoc {
  id: string;
  label: string;
}

type GraphRange = "1" | "2" | "3" | "custom";

/* ================= COMPONENT ================= */
const Reports: React.FC = () => {
  /* ---------- PRIMARY ---------- */
  const [entityType, setEntityType] = useState<EntityType>("investor");
  const [entityIds, setEntityIds] = useState<SearchOption[]>([]);
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ---------- DATE ---------- */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ---------- DATA ---------- */
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tab, setTab] = useState<ActivityTab>("all");
  const [associations, setAssociations] = useState<any>({});

  /* ---------- SECONDARY ---------- */
  const [secondary, setSecondary] = useState({
    user: [] as string[],
    investor: [] as string[],
    company: [] as string[],
  });

  /* ---------- RELATED SEARCH ---------- */
  const [relatedSearch, setRelatedSearch] = useState({
    user: "",
    investor: "",
    company: "",
  });

  /* ---------- GRAPH ---------- */
  const [graphRange, setGraphRange] = useState<GraphRange>("1");
  const [graphFrom, setGraphFrom] = useState("");
  const [graphTo, setGraphTo] = useState("");

  /* =====================================================
     CLEAR DATA ON ENTITY CHANGE
  ===================================================== */
  useEffect(() => {
    setActivities([]);
    setAssociations({});
    setEntityIds([]);
    setSecondary({ user: [], investor: [], company: [] });
    setSearchText("");
    setOptions([]);
    setShowDropdown(false);
    setTab("all");
  }, [entityType]);

  /* ================= QUICK DATE ================= */
  const applyQuickFilter = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    setFromDate(from.toISOString().slice(0, 10));
    setToDate(to.toISOString().slice(0, 10));
  };

  /* ================= SEARCH ================= */
  const searchEntity = async (q: string) => {
    setSearchText(q);

    if (!q || entityType.startsWith("all_")) {
      setOptions([]);
      setShowDropdown(false);
      return;
    }

    const endpoint =
      entityType === "user"
        ? "/api/reports/search/users"
        : entityType === "investor"
        ? "/api/reports/search/investors"
        : "/api/reports/search/companies";

    const res = await httpClient.get(endpoint, { params: { q } });
    setOptions(res.data || []);
    setShowDropdown(true);
  };

  const selectOption = (opt: SearchOption) => {
    if (!entityIds.find(i => i.id === opt.id)) {
      setEntityIds(prev => [...prev, opt]);
    }
    setSearchText("");
    setShowDropdown(false);
  };

  const removePrimary = (id: string) => {
    setEntityIds(prev => prev.filter(i => i.id !== id));
  };

  /* ================= FETCH ================= */
  const fetchActivities = async () => {
    const isAll = entityType.startsWith("all_");

    if (!isAll && entityIds.length === 0) {
      setActivities([]);
      return;
    }

    const res = await httpClient.get("/api/reports/activities", {
      params: {
        entity_type: isAll ? entityType.replace("all_", "") : entityType,
        entity_ids: isAll ? "ALL" : entityIds.map(i => i.id),
        secondary_filters: JSON.stringify(secondary),
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      },
    });

    setActivities(res.data.activities || []);
  };

  const fetchAssociations = async () => {
    const isAll = entityType.startsWith("all_");
    const id = isAll ? "ALL" : entityIds[0]?.id;
    if (!id) return;

    const res = await httpClient.get("/api/reports/associations", {
      params: {
        entity_type: entityType.replace("all_", ""),
        entity_id: id,
      },
    });

    setAssociations(res.data || {});
  };

  useEffect(() => {
    fetchActivities();
    fetchAssociations();
  }, [entityIds, secondary, fromDate, toDate, entityType]);

  /* ================= GRAPH → DATE SYNC ================= */
  useEffect(() => {
    if (graphRange === "custom") return;

    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - Number(graphRange));

    setFromDate(from.toISOString().slice(0, 10));
    setToDate(to.toISOString().slice(0, 10));
  }, [graphRange]);

  /* ================= COUNTS ================= */
  const getCount = (type: ActivityTab) =>
    type === "all"
      ? activities.length
      : activities.filter(a => a.activity_type === type).length;

  const filtered =
    tab === "all"
      ? activities
      : activities.filter(a => a.activity_type === tab);

  /* ================= GRAPH DATA ================= */
  const graphCounts = useMemo(() => {
    const counts: Record<ActivityTab, number> = {
      all: activities.length,
      interested: 0,
      followups: 0,
      not_interested: 0,
      meeting_scheduled: 0,
      meeting_done: 0,
    };

    activities.forEach(a => {
      if (a.activity_type !== "all") {
        counts[a.activity_type]++;
      }
    });

    return counts;
  }, [activities]);

  const maxGraphValue = Math.max(
    ...Object.values(graphCounts).filter(v => typeof v === "number")
  );

  /* ================= SECONDARY ================= */
  const toggleSecondary = (type: "user" | "investor" | "company", id: string) => {
    setSecondary(prev => {
      const exists = prev[type].includes(id);
      return {
        ...prev,
        [type]: exists
          ? prev[type].filter(v => v !== id)
          : [id, ...prev[type]],
      };
    });
  };

  const renderRelated = (
    title: string,
    type: "user" | "investor" | "company",
    list: Assoc[]
  ) => {
    const selected = secondary[type];
    const search = relatedSearch[type].toLowerCase();

    const filteredList = list.filter(i =>
      i.label.toLowerCase().includes(search)
    );

    const ordered = [
      ...filteredList.filter(i => selected.includes(i.id)),
      ...filteredList.filter(i => !selected.includes(i.id)),
    ];

    return (
      <div>
        <div className="font-semibold mb-1">{title}</div>

        <div className="relative mb-1">
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
          <input
            value={relatedSearch[type]}
            onChange={e =>
              setRelatedSearch(prev => ({
                ...prev,
                [type]: e.target.value,
              }))
            }
            placeholder={`Search ${title}`}
            className="pl-8 pr-2 py-1 w-full border rounded text-sm"
          />
        </div>

        <div className="border rounded max-h-48 overflow-y-auto">
          {ordered.map(i => {
            const active = selected.includes(i.id);
            return (
              <div
                key={i.id}
                onClick={() => toggleSecondary(type, i.id)}
                className={`px-2 py-1 cursor-pointer flex gap-2 items-center ${
                  active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                <input type="checkbox" checked={active} readOnly />
                {i.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
    const Icon =
    entityType.includes("user")
      ? User
      : entityType.includes("investor")
      ? Users
      : Building2;

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600" />
        Reports
      </h1>

      {/* PRIMARY FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <select
          value={entityType}
          onChange={e => setEntityType(e.target.value as EntityType)}
          className="border rounded px-2 py-1"
        >
          <option value="user">User</option>
          <option value="investor">Investor</option>
          <option value="company">Company</option>
          <option value="all_user">All Users</option>
          <option value="all_investor">All Investors</option>
          <option value="all_company">All Companies</option>
        </select>

        {!entityType.startsWith("all_") && (
          <div className="relative">
            <input
              value={searchText}
              onChange={e => searchEntity(e.target.value)}
              placeholder={`Search ${entityType}`}
              className="border px-2 py-1 rounded w-full"
            />
            {showDropdown && options.length > 0 && (
              <div className="absolute bg-white border w-full max-h-48 overflow-auto z-10">
                {options.map(o => (
                  <div
                    key={o.id}
                    onClick={() => selectOption(o)}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  >
                    {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={fetchActivities} className="bg-blue-600 text-white px-3 rounded">
          Load
        </button>
      </div>

      {/* SELECTED CHIPS */}
      {entityIds.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {entityIds.map(i => (
            <div key={i.id} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
              {i.label}
              <X className="w-4 h-4 cursor-pointer" onClick={() => removePrimary(i.id)} />
            </div>
          ))}
        </div>
      )}

      {/* QUICK DATE */}
      <div className="flex gap-2">
        <button onClick={() => applyQuickFilter(7)} className="px-3 py-1 bg-gray-100 rounded">
          Last 7 Days
        </button>
        <button onClick={() => applyQuickFilter(30)} className="px-3 py-1 bg-gray-100 rounded">
          Last 1 Month
        </button>
        <button onClick={() => applyQuickFilter(365)} className="px-3 py-1 bg-gray-100 rounded">
          Last 1 Year
        </button>
      </div>

      {/* GRAPH */}
      <div className="border rounded p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Activity Summary</h2>
          <select
            value={graphRange}
            onChange={e => setGraphRange(e.target.value as GraphRange)}
            className="border px-2 py-1 rounded"
          >
            <option value="1">Last 1 Month</option>
            <option value="2">Last 2 Months</option>
            <option value="3">Last 3 Months</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {graphRange === "custom" && (
          <div className="flex gap-2">
            <input type="date" value={graphFrom} onChange={e => setGraphFrom(e.target.value)} />
            <input type="date" value={graphTo} onChange={e => setGraphTo(e.target.value)} />
          </div>
        )}

        {(["interested","followups","not_interested","meeting_scheduled","meeting_done"] as ActivityTab[]).map(t => (
          <div key={t} className="flex items-center gap-3">
            <div className="w-40 capitalize">{t.replace("_"," ")}</div>
            <div className="flex-1 bg-gray-200 rounded h-4">
              <div
                className="bg-blue-600 h-4 rounded"
                style={{ width: `${maxGraphValue ? (graphCounts[t] / maxGraphValue) * 100 : 0}%` }}
              />
            </div>
            <div className="w-10 text-right">{graphCounts[t]}</div>
          </div>
        ))}
      </div>

      {/* RELATED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entityType !== "user" && associations.users &&
          renderRelated("Related Users", "user", associations.users)}
        {entityType !== "investor" && associations.investors &&
          renderRelated("Related Investors", "investor", associations.investors)}
        {entityType !== "company" && associations.companies &&
          renderRelated("Related Companies", "company", associations.companies)}
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {(["all","interested","followups","not_interested","meeting_scheduled","meeting_done"] as ActivityTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {t.replace("_"," ")} ({getCount(t)})
          </button>
        ))}
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Investor</th>
            <th>Company</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a, i) => (
            <tr key={i}>
              <td>{new Date(a.activity_date).toLocaleDateString()}</td>
              <td>{a.user_name || "-"}</td>
              <td>{a.investor_name || "-"}</td>
              <td>{a.company_name || "-"}</td>
              <td>{a.activity_type.replace("_"," ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;

