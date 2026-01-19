import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart, 
  Calculator,
  Target,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Plus,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Search,
  ChevronDown,
  Award,
  Briefcase,
  Building,
  MapPin,
  Star,
  Activity,
  Zap,
  Globe,
  FileText,
  Share2,
  Settings,
  CreditCard,
  Wallet,
  PiggyBank,
  LineChart,
  Percent,
  Coins,
  Receipt,
  TrendingUp as Growth,
  Minus,
  Equal
} from 'lucide-react';

const ROIAnalysis = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [viewMode, setViewMode] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('total_roi');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous_year');

  // Mock ROI data
  const roiMetrics = [
    {
      name: 'Total ROI',
      value: '347%',
      change: '+23%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Overall return on investment',
      amount: '$8.7M',
      invested: '$2.5M'
    },
    {
      name: 'Cost per Lead',
      value: '$1,247',
      change: '-15%',
      changeType: 'positive',
      icon: Users,
      description: 'Average cost to acquire investor',
      amount: '$356K',
      leads: 286
    },
    {
      name: 'Cost per Meeting',
      value: '$4,890',
      change: '-8%',
      changeType: 'positive',
      icon: Calendar,
      description: 'Average cost per investor meeting',
      amount: '$440K',
      meetings: 90
    },
    {
      name: 'Investment Conversion',
      value: '12.3%',
      change: '+4.2%',
      changeType: 'positive',
      icon: Target,
      description: 'Lead to investment conversion',
      investments: 35,
      totalLeads: 286
    }
  ];

  const campaignROI = [
    {
      id: '1',
      name: 'Series B Outreach Q1 2024',
      type: 'Email + LinkedIn',
      invested: 5000,
      returned: 2500000,
      roi: 49900,
      meetings: 12,
      investments: 3,
      avgDealSize: 833333,
      costPerMeeting: 417,
      costPerInvestment: 1667,
      status: 'completed',
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'FinTech Investor Focus',
      type: 'Multi-channel',
      invested: 3500,
      returned: 1800000,
      roi: 51329,
      meetings: 8,
      investments: 2,
      avgDealSize: 900000,
      costPerMeeting: 438,
      costPerInvestment: 1750,
      status: 'active',
      performance: 'excellent'
    },
    {
      id: '3',
      name: 'AI/ML Investor Network',
      type: 'LinkedIn',
      invested: 2500,
      returned: 750000,
      roi: 29900,
      meetings: 6,
      investments: 1,
      avgDealSize: 750000,
      costPerMeeting: 417,
      costPerInvestment: 2500,
      status: 'paused',
      performance: 'good'
    },
    {
      id: '4',
      name: 'Growth Stage Expansion',
      type: 'Email + Events',
      invested: 8000,
      returned: 4600000,
      roi: 57400,
      meetings: 23,
      investments: 4,
      avgDealSize: 1150000,
      costPerMeeting: 348,
      costPerInvestment: 2000,
      status: 'completed',
      performance: 'excellent'
    },
    {
      id: '5',
      name: 'Angel Investor Outreach',
      type: 'Phone + Email',
      invested: 4200,
      returned: 320000,
      roi: 7519,
      meetings: 15,
      investments: 2,
      avgDealSize: 160000,
      costPerMeeting: 280,
      costPerInvestment: 2100,
      status: 'active',
      performance: 'average'
    }
  ];

  const monthlyROI = [
    { month: 'Jan', invested: 12000, returned: 850000, roi: 6983 },
    { month: 'Feb', invested: 15000, returned: 1200000, roi: 7900 },
    { month: 'Mar', invested: 18000, returned: 1650000, roi: 9067 },
    { month: 'Apr', invested: 14000, returned: 980000, roi: 6900 },
    { month: 'May', invested: 22000, returned: 2100000, roi: 9445 },
    { month: 'Jun', invested: 19000, returned: 1750000, roi: 9111 },
    { month: 'Jul', invested: 16000, returned: 1400000, roi: 8650 },
    { month: 'Aug', invested: 21000, returned: 2300000, roi: 10857 },
    { month: 'Sep', invested: 17000, returned: 1600000, roi: 9312 },
    { month: 'Oct', invested: 25000, returned: 2800000, roi: 11100 },
    { month: 'Nov', invested: 20000, returned: 2200000, roi: 10900 },
    { month: 'Dec', invested: 23000, returned: 2650000, roi: 11426 }
  ];

  const channelROI = [
    { channel: 'Email', invested: 45000, returned: 6200000, roi: 13678, campaigns: 12, color: 'bg-blue-500' },
    { channel: 'LinkedIn', invested: 32000, returned: 4100000, roi: 12713, campaigns: 8, color: 'bg-green-500' },
    { channel: 'Phone', invested: 28000, returned: 2800000, roi: 9900, campaigns: 6, color: 'bg-purple-500' },
    { channel: 'Events', invested: 52000, returned: 4500000, roi: 8554, campaigns: 4, color: 'bg-orange-500' },
    { channel: 'Multi-channel', invested: 38000, returned: 4200000, roi: 10958, campaigns: 5, color: 'bg-red-500' }
  ];

  const investorROI = [
    {
      name: 'Emily Park',
      firm: 'GV (Google Ventures)',
      avatar: 'https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      invested: 2400,
      returned: 1500000,
      roi: 62400,
      meetings: 4,
      investments: 1,
      avgDealSize: 1500000,
      acquisitionCost: 2400,
      ltv: 1500000,
      ltvCacRatio: 625
    },
    {
      name: 'Michael Chen',
      firm: 'Andreessen Horowitz',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      invested: 1800,
      returned: 2000000,
      roi: 111011,
      meetings: 3,
      investments: 2,
      avgDealSize: 1000000,
      acquisitionCost: 1800,
      ltv: 2000000,
      ltvCacRatio: 1111
    },
    {
      name: 'Sarah Williams',
      firm: 'Sequoia Capital',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      invested: 3200,
      returned: 1200000,
      roi: 37400,
      meetings: 5,
      investments: 1,
      avgDealSize: 1200000,
      acquisitionCost: 3200,
      ltv: 1200000,
      ltvCacRatio: 375
    },
    {
      name: 'Lisa Zhang',
      firm: 'Index Ventures',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      invested: 2800,
      returned: 800000,
      roi: 28471,
      meetings: 4,
      investments: 1,
      avgDealSize: 800000,
      acquisitionCost: 2800,
      ltv: 800000,
      ltvCacRatio: 286
    }
  ];

  const costBreakdown = [
    { category: 'Campaign Costs', amount: 125000, percentage: 45.5, items: ['Email tools', 'LinkedIn Sales Navigator', 'Campaign management'] },
    { category: 'Personnel Costs', amount: 89000, percentage: 32.4, items: ['IR team salaries', 'Contractor fees', 'Training costs'] },
    { category: 'Technology & Tools', amount: 34000, percentage: 12.4, items: ['CRM software', 'Analytics tools', 'Automation platforms'] },
    { category: 'Events & Travel', amount: 27000, percentage: 9.8, items: ['Conference attendance', 'Investor meetings', 'Travel expenses'] }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  const formatROI = (roi: number) => {
    return `${roi.toLocaleString()}%`;
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'average': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key ROI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roiMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium text-gray-900">{metric.amount}</span>
                </div>
                <div className="flex items-center">
                  {metric.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROI Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">ROI Trends Over Time</h3>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="total_roi">Total ROI</option>
              <option value="invested">Amount Invested</option>
              <option value="returned">Amount Returned</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Chart visualization */}
        <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-end justify-center p-4">
          <div className="flex items-end space-x-3 w-full max-w-4xl">
            {monthlyROI.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full mb-2">
                  <div 
                    className="bg-green-500 rounded-t"
                    style={{ height: `${(data.roi / 12000) * 120}px`, minHeight: '8px' }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(monthlyROI.reduce((sum, m) => sum + m.returned, 0))}
            </p>
            <p className="text-sm text-gray-500">Total Returned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(monthlyROI.reduce((sum, m) => sum + m.invested, 0))}
            </p>
            <p className="text-sm text-gray-500">Total Invested</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(monthlyROI.reduce((sum, m) => sum + m.roi, 0) / monthlyROI.length)}%
            </p>
            <p className="text-sm text-gray-500">Average ROI</p>
          </div>
        </div>
      </div>

      {/* Channel ROI Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">ROI by Channel</h3>
        
        <div className="space-y-4">
          {channelROI.map((channel, index) => (
            <div key={channel.channel} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 ${channel.color} rounded`}></div>
                <div>
                  <p className="font-medium text-gray-900">{channel.channel}</p>
                  <p className="text-sm text-gray-500">{channel.campaigns} campaigns</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Invested</p>
                  <p className="text-sm text-gray-600">{formatCurrency(channel.invested)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Returned</p>
                  <p className="text-sm text-green-600">{formatCurrency(channel.returned)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">ROI</p>
                  <p className="text-lg font-bold text-green-600">{formatROI(channel.roi)}</p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${channel.color}`}
                    style={{ width: `${Math.min((channel.roi / 15000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCampaignROITab = () => (
    <div className="space-y-6">
      {/* Campaign ROI Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Campaign ROI Analysis</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2 inline" />
              Filter
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Invested</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Returned</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">ROI</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Meetings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Investments</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cost/Investment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {campaignROI.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-sm text-gray-500">{campaign.status}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{campaign.type}</td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(campaign.invested)}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{formatCurrency(campaign.returned)}</td>
                  <td className="py-3 px-4">
                    <span className="text-lg font-bold text-green-600">{formatROI(campaign.roi)}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{campaign.meetings}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{campaign.investments}</td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(campaign.costPerInvestment)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${getPerformanceColor(campaign.performance)}`}>
                      {campaign.performance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">ROI Distribution</h4>
          <div className="space-y-3">
            {campaignROI
              .sort((a, b) => b.roi - a.roi)
              .map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{campaign.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${Math.min((campaign.roi / 60000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatROI(campaign.roi)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Efficiency</h4>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Best Performing</span>
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-900">Growth Stage Expansion</p>
              <p className="text-sm text-green-700">ROI: {formatROI(57400)} • Cost per investment: {formatCurrency(2000)}</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Most Efficient</span>
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-900">Series B Outreach Q1 2024</p>
              <p className="text-sm text-blue-700">Cost per meeting: {formatCurrency(417)} • 3 investments from 12 meetings</p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-800">Optimization Opportunity</span>
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-lg font-bold text-yellow-900">Angel Investor Outreach</p>
              <p className="text-sm text-yellow-700">Lower ROI: {formatROI(7519)} • Consider strategy adjustment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvestorROITab = () => (
    <div className="space-y-6">
      {/* Investor ROI Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Investor ROI Analysis</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Calculator className="w-4 h-4 mr-2 inline" />
              Calculate LTV
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Investor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Acquisition Cost</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Investment Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">ROI</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">LTV:CAC Ratio</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Meetings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Investments</th>
              </tr>
            </thead>
            <tbody>
              {investorROI.map((investor) => (
                <tr key={investor.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img
                        src={investor.avatar}
                        alt={investor.name}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{investor.name}</p>
                        <p className="text-sm text-gray-500">{investor.firm}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(investor.acquisitionCost)}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{formatCurrency(investor.ltv)}</td>
                  <td className="py-3 px-4">
                    <span className="text-lg font-bold text-green-600">{formatROI(investor.roi)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      investor.ltvCacRatio >= 500 ? 'text-green-600' :
                      investor.ltvCacRatio >= 300 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {investor.ltvCacRatio}:1
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{investor.meetings}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{investor.investments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LTV:CAC Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">LTV:CAC Ratio Distribution</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Excellent (500:1+)</p>
                <p className="text-sm text-green-700">High value investors</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {investorROI.filter(i => i.ltvCacRatio >= 500).length}
                </p>
                <p className="text-sm text-green-600">investors</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-900">Good (300-499:1)</p>
                <p className="text-sm text-yellow-700">Solid performers</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-600">
                  {investorROI.filter(i => i.ltvCacRatio >= 300 && i.ltvCacRatio < 500).length}
                </p>
                <p className="text-sm text-yellow-600">investors</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-red-900">{"Needs Improvement (<300:1)"}</p>
                <p className="text-sm text-red-700">Optimize approach</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-600">
                  {investorROI.filter(i => i.ltvCacRatio < 300).length}
                </p>
                <p className="text-sm text-red-600">investors</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">ROI Insights</h4>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Average ROI</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {Math.round(investorROI.reduce((sum, i) => sum + i.roi, 0) / investorROI.length).toLocaleString()}%
              </p>
              <p className="text-sm text-blue-700">Across all investors</p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">Total Investment Value</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(investorROI.reduce((sum, i) => sum + i.ltv, 0))}
              </p>
              <p className="text-sm text-purple-700">From {investorROI.length} investors</p>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Calculator className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">Avg Acquisition Cost</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {formatCurrency(Math.round(investorROI.reduce((sum, i) => sum + i.acquisitionCost, 0) / investorROI.length))}
              </p>
              <p className="text-sm text-orange-700">Per successful investor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCostAnalysisTab = () => (
    <div className="space-y-6">
      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Breakdown</h3>
          
          <div className="space-y-4">
            {costBreakdown.map((category, index) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(category.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {category.percentage}% • {category.items.join(', ')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total Costs</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(costBreakdown.reduce((sum, c) => sum + c.amount, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Efficiency Metrics</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Cost per Lead</span>
                <span className="text-lg font-bold text-gray-900">$1,247</span>
              </div>
              <div className="flex items-center">
                <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">15% improvement</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Cost per Meeting</span>
                <span className="text-lg font-bold text-gray-900">$4,890</span>
              </div>
              <div className="flex items-center">
                <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">8% improvement</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Cost per Investment</span>
                <span className="text-lg font-bold text-gray-900">$21,429</span>
              </div>
              <div className="flex items-center">
                <ArrowUpRight className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">3% increase</span>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Efficiency Score</span>
                <span className="text-lg font-bold text-green-900">8.7/10</span>
              </div>
              <p className="text-sm text-green-700">Above industry average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Optimization Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Optimization Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Automation Opportunity</span>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Implement automated follow-up sequences to reduce manual effort and improve response rates.
            </p>
            <div className="text-sm text-blue-700">
              <strong>Potential savings:</strong> $15K annually
            </div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-green-900">Better Targeting</span>
            </div>
            <p className="text-sm text-green-800 mb-3">
              Focus on high-LTV:CAC ratio investor segments to improve overall efficiency.
            </p>
            <div className="text-sm text-green-700">
              <strong>Potential improvement:</strong> 25% better ROI
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center mb-3">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium text-purple-900">Channel Optimization</span>
            </div>
            <p className="text-sm text-purple-800 mb-3">
              Reallocate budget from lower-performing channels to high-ROI channels like LinkedIn.
            </p>
            <div className="text-sm text-purple-700">
              <strong>Potential improvement:</strong> 18% cost reduction
            </div>
          </div>
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Budget Allocation vs Performance</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">Optimize allocation</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Channel</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Budget Allocated</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Budget Used</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">ROI</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Efficiency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {channelROI.map((channel) => (
                <tr key={channel.channel} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{channel.channel}</td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(channel.invested * 1.2)}</td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(channel.invested)}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{formatROI(channel.roi)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      channel.roi > 12000 ? 'bg-green-100 text-green-800' :
                      channel.roi > 10000 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {channel.roi > 12000 ? 'High' : channel.roi > 10000 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {channel.roi > 12000 ? 'Increase budget' :
                     channel.roi > 10000 ? 'Maintain' : 'Optimize or reduce'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ROI Analysis</h1>
              <p className="text-sm text-gray-500 mt-1">
                Comprehensive return on investment analysis for your investor relations activities
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3m">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="12m">Last 12 months</option>
                <option value="24m">Last 24 months</option>
                <option value="all">All time</option>
              </select>
              
              <select 
                value={comparisonPeriod}
                onChange={(e) => setComparisonPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="previous_period">vs Previous Period</option>
                <option value="previous_year">vs Previous Year</option>
                <option value="industry_avg">vs Industry Average</option>
              </select>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'campaigns', label: 'Campaign ROI', icon: Target },
              { id: 'investors', label: 'Investor ROI', icon: Users },
              { id: 'costs', label: 'Cost Analysis', icon: Calculator }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {viewMode === 'overview' && renderOverviewTab()}
        {viewMode === 'campaigns' && renderCampaignROITab()}
        {viewMode === 'investors' && renderInvestorROITab()}
        {viewMode === 'costs' && renderCostAnalysisTab()}
      </div>
    </div>
  );
};

export default ROIAnalysis;