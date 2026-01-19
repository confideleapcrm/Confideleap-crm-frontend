import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  MessageCircle, 
  DollarSign,
  Calendar,
  Mail,
  Phone,
  BarChart3,
  PieChart,
  Activity,
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
  Star,
  MapPin,
  Building,
  Zap,
  Globe,
  RefreshCw,
  Search,
  ChevronDown,
  TrendingDown,
  Award,
  Briefcase,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ExternalLink,
  FileText,
  Share2
} from 'lucide-react';

const InvestorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('overview');

  // Mock analytics data
  const overviewMetrics = [
    {
      name: 'Total Investors',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      description: 'Active investor relationships',
      trend: [65, 78, 82, 89, 95, 92, 98]
    },
    {
      name: 'Engagement Score',
      value: '78.4',
      change: '+5.2%',
      changeType: 'positive',
      icon: Activity,
      description: 'Average engagement rating',
      trend: [72, 74, 76, 75, 78, 79, 78]
    },
    {
      name: 'Response Rate',
      value: '34.2%',
      change: '-2.1%',
      changeType: 'negative',
      icon: MessageCircle,
      description: 'Average response to outreach',
      trend: [38, 36, 35, 34, 33, 35, 34]
    },
    {
      name: 'Pipeline Value',
      value: '$847M',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Total potential investment',
      trend: [720, 750, 780, 810, 830, 840, 847]
    }
  ];

  const topPerformingInvestors = [
    {
      id: '1',
      name: 'Emily Park',
      firm: 'GV (Google Ventures)',
      avatar: 'https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      engagementScore: 94,
      responseRate: 89,
      meetingsScheduled: 12,
      lastInteraction: '2 days ago',
      status: 'hot',
      portfolioFit: 96,
      totalInteractions: 24,
      avgResponseTime: '2.3 hours'
    },
    {
      id: '2',
      name: 'Michael Chen',
      firm: 'Andreessen Horowitz',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      engagementScore: 92,
      responseRate: 76,
      meetingsScheduled: 8,
      lastInteraction: '3 days ago',
      status: 'hot',
      portfolioFit: 92,
      totalInteractions: 18,
      avgResponseTime: '4.1 hours'
    },
    {
      id: '3',
      name: 'Sarah Williams',
      firm: 'Sequoia Capital',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      engagementScore: 88,
      responseRate: 82,
      meetingsScheduled: 6,
      lastInteraction: '1 week ago',
      status: 'warm',
      portfolioFit: 88,
      totalInteractions: 15,
      avgResponseTime: '6.2 hours'
    },
    {
      id: '4',
      name: 'Lisa Zhang',
      firm: 'Index Ventures',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
      engagementScore: 85,
      responseRate: 67,
      meetingsScheduled: 4,
      lastInteraction: '2 weeks ago',
      status: 'contacted',
      portfolioFit: 90,
      totalInteractions: 12,
      avgResponseTime: '8.7 hours'
    }
  ];

  const engagementTrends = [
    { month: 'Jan', emails: 245, meetings: 12, responses: 89, calls: 34 },
    { month: 'Feb', emails: 289, meetings: 18, responses: 102, calls: 41 },
    { month: 'Mar', emails: 312, meetings: 22, responses: 118, calls: 38 },
    { month: 'Apr', emails: 298, meetings: 19, responses: 95, calls: 45 },
    { month: 'May', emails: 334, meetings: 25, responses: 134, calls: 52 },
    { month: 'Jun', emails: 367, meetings: 28, responses: 145, calls: 48 }
  ];

  const investorSegments = [
    { name: 'Hot Prospects', count: 89, percentage: 31.2, color: 'bg-red-500', growth: '+15%' },
    { name: 'Warm Leads', count: 156, percentage: 54.8, color: 'bg-yellow-500', growth: '+8%' },
    { name: 'Cold Contacts', count: 234, percentage: 82.1, color: 'bg-blue-500', growth: '+3%' },
    { name: 'Unresponsive', count: 67, percentage: 23.5, color: 'bg-gray-500', growth: '-5%' }
  ];

  const geographicDistribution = [
    { region: 'North America', count: 1247, percentage: 43.8, growth: '+12%' },
    { region: 'Europe', count: 892, percentage: 31.3, growth: '+18%' },
    { region: 'Asia Pacific', count: 456, percentage: 16.0, growth: '+25%' },
    { region: 'Latin America', count: 156, percentage: 5.5, growth: '+8%' },
    { region: 'Middle East & Africa', count: 96, percentage: 3.4, growth: '+15%' }
  ];

  const sectorAnalysis = [
    { sector: 'FinTech', investors: 456, avgFit: 89, responseRate: 34.2, meetings: 45 },
    { sector: 'HealthTech', investors: 234, avgFit: 82, responseRate: 28.7, meetings: 28 },
    { sector: 'AI/ML', investors: 189, avgFit: 91, responseRate: 41.3, meetings: 38 },
    { sector: 'SaaS', investors: 345, avgFit: 76, responseRate: 31.8, meetings: 32 },
    { sector: 'E-commerce', investors: 167, avgFit: 68, responseRate: 25.4, meetings: 18 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              
              {/* Mini trend chart */}
              <div className="flex items-center justify-between">
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
                </div>
                <div className="flex items-end space-x-1 h-8">
                  {metric.trend.map((value, index) => (
                    <div
                      key={index}
                      className="bg-blue-200 rounded-sm"
                      style={{
                        width: '4px',
                        height: `${(value / Math.max(...metric.trend)) * 100}%`,
                        minHeight: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engagement Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Engagement Trends</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Chart placeholder with data visualization */}
        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-end justify-center p-4">
          <div className="flex items-end space-x-4 w-full max-w-2xl">
            {engagementTrends.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full space-y-1 mb-2">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${(data.emails / 400) * 120}px` }}
                  />
                  <div 
                    className="bg-green-500 rounded"
                    style={{ height: `${(data.meetings / 30) * 40}px` }}
                  />
                  <div 
                    className="bg-purple-500 rounded"
                    style={{ height: `${(data.responses / 150) * 80}px` }}
                  />
                  <div 
                    className="bg-orange-500 rounded-b"
                    style={{ height: `${(data.calls / 60) * 60}px` }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Emails</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Meetings</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Responses</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Calls</span>
          </div>
        </div>
      </div>

      {/* Top Performing Investors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Investors</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
        </div>
        
        <div className="space-y-4">
          {topPerformingInvestors.map((investor, index) => (
            <div key={investor.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                  <img
                    src={investor.avatar}
                    alt={investor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{investor.name}</p>
                  <p className="text-sm text-gray-500">{investor.firm}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{investor.engagementScore}</p>
                  <p className="text-xs text-gray-500">Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-600">{investor.responseRate}%</p>
                  <p className="text-xs text-gray-500">Response</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-600">{investor.meetingsScheduled}</p>
                  <p className="text-xs text-gray-500">Meetings</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investor.status)}`}>
                  {investor.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSegmentationTab = () => (
    <div className="space-y-6">
      {/* Investor Segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {investorSegments.map((segment) => (
          <div key={segment.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">{segment.name}</h4>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                segment.growth.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {segment.growth}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{segment.count}</span>
                <span className="text-sm text-gray-500">{segment.percentage}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${segment.color} h-2 rounded-full`}
                  style={{ width: `${Math.min(segment.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
        
        <div className="space-y-4">
          {geographicDistribution.map((region) => (
            <div key={region.region} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{region.region}</p>
                  <p className="text-sm text-gray-500">{region.count} investors</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{region.percentage}%</p>
                  <p className={`text-xs font-medium ${
                    region.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {region.growth}
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${region.percentage * 2}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sector Analysis</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sector</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Investors</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Portfolio Fit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Response Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Meetings</th>
              </tr>
            </thead>
            <tbody>
              {sectorAnalysis.map((sector, index) => (
                <tr key={sector.sector} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{sector.sector}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{sector.investors}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-gray-900 mr-2">{sector.avgFit}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${sector.avgFit}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{sector.responseRate}%</td>
                  <td className="py-3 px-4 text-gray-600">{sector.meetings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Response Rates</h4>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium text-gray-900">34.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">LinkedIn</span>
              <span className="text-sm font-medium text-gray-900">28.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phone</span>
              <span className="text-sm font-medium text-gray-900">45.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Events</span>
              <span className="text-sm font-medium text-gray-900">67.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Meeting Conversion</h4>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">8.3%</div>
            <p className="text-sm text-gray-500 mb-4">Response to meeting rate</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '8.3%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Avg Response Time</h4>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">4.7h</div>
            <p className="text-sm text-gray-500 mb-4">Average time to respond</p>
            <div className="flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">-12% faster</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Investor Performance Details</h3>
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
                <th className="text-left py-3 px-4 font-medium text-gray-900">Investor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Interactions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Response Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Response Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Meetings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topPerformingInvestors.map((investor) => (
                <tr key={investor.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                  <td className="py-3 px-4 text-gray-600">{investor.totalInteractions}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">{investor.responseRate}%</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{investor.avgResponseTime}</td>
                  <td className="py-3 px-4 text-gray-600">{investor.meetingsScheduled}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investor.status)}`}>
                      {investor.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Investor Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">
                Deep insights into your investor relationships and engagement
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="6m">Last 6 months</option>
                <option value="1y">Last year</option>
              </select>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
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
              { id: 'segmentation', label: 'Segmentation', icon: PieChart },
              { id: 'performance', label: 'Performance', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === tab.id
                      ? 'bg-blue-100 text-blue-700'
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
        {viewMode === 'segmentation' && renderSegmentationTab()}
        {viewMode === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
};

export default InvestorAnalytics;