import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Mail, 
  MessageCircle, 
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
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Globe,
  RefreshCw,
  Search,
  ChevronDown,
  Send,
  Phone,
  Linkedin,
  Twitter,
  ExternalLink,
  FileText,
  Share2,
  Settings,
  Award,
  ThumbsUp,
  ThumbsDown,
  Star,
  MapPin,
  Building
} from 'lucide-react';

const CampaignPerformance = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock campaign performance data
  const campaignMetrics = [
    {
      name: 'Total Campaigns',
      value: '24',
      change: '+4',
      changeType: 'positive',
      icon: Target,
      description: 'Active and completed campaigns'
    },
    {
      name: 'Average Open Rate',
      value: '64.2%',
      change: '+5.3%',
      changeType: 'positive',
      icon: Mail,
      description: 'Across all email campaigns'
    },
    {
      name: 'Response Rate',
      value: '28.6%',
      change: '+2.1%',
      changeType: 'positive',
      icon: MessageCircle,
      description: 'Average response to outreach'
    },
    {
      name: 'Meeting Conversion',
      value: '8.7%',
      change: '-0.5%',
      changeType: 'negative',
      icon: Calendar,
      description: 'Response to meeting rate'
    }
  ];

  const campaigns = [
    {
      id: '1',
      name: 'Series B Outreach Q1 2024',
      description: 'Targeting growth-stage investors for our Series B round',
      status: 'active',
      type: 'email',
      created: '2024-01-15',
      lastActivity: '2 hours ago',
      totalInvestors: 145,
      sent: 145,
      delivered: 142,
      opened: 89,
      clicked: 45,
      replied: 34,
      bounced: 3,
      unsubscribed: 2,
      meetings: 12,
      responseRate: 23.4,
      openRate: 61.4,
      clickRate: 31.0,
      meetingRate: 8.3,
      budget: 5000,
      spent: 2340,
      owner: 'Sarah Chen',
      tags: ['Series B', 'Growth', 'FinTech'],
      channels: ['email', 'linkedin'],
      nextAction: 'Follow-up sequence 2',
      priority: 'high',
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'FinTech Investor Focus',
      description: 'Specialized outreach to FinTech-focused VCs and angels',
      status: 'active',
      type: 'multi-channel',
      created: '2024-01-20',
      lastActivity: '1 day ago',
      totalInvestors: 98,
      sent: 98,
      delivered: 96,
      opened: 67,
      clicked: 32,
      replied: 28,
      bounced: 2,
      unsubscribed: 1,
      meetings: 8,
      responseRate: 28.6,
      openRate: 68.4,
      clickRate: 47.8,
      meetingRate: 8.2,
      budget: 3500,
      spent: 1890,
      owner: 'Michael Torres',
      tags: ['FinTech', 'Specialized', 'Angels'],
      channels: ['email', 'linkedin', 'phone'],
      nextAction: 'LinkedIn connection requests',
      priority: 'high',
      performance: 'excellent'
    },
    {
      id: '3',
      name: 'AI/ML Investor Network',
      description: 'Reaching out to AI and machine learning focused investors',
      status: 'paused',
      type: 'linkedin',
      created: '2024-01-10',
      lastActivity: '1 week ago',
      totalInvestors: 76,
      sent: 76,
      delivered: 76,
      opened: 52,
      clicked: 23,
      replied: 19,
      bounced: 0,
      unsubscribed: 0,
      meetings: 6,
      responseRate: 25.0,
      openRate: 68.4,
      clickRate: 44.2,
      meetingRate: 7.9,
      budget: 2500,
      spent: 1200,
      owner: 'Lisa Park',
      tags: ['AI/ML', 'Tech', 'Innovation'],
      channels: ['linkedin', 'twitter'],
      nextAction: 'Resume campaign',
      priority: 'medium',
      performance: 'good'
    },
    {
      id: '4',
      name: 'Growth Stage Expansion',
      description: 'Large-scale outreach to growth and late-stage investors',
      status: 'completed',
      type: 'email',
      created: '2023-12-01',
      lastActivity: '2 weeks ago',
      totalInvestors: 234,
      sent: 234,
      delivered: 228,
      opened: 156,
      clicked: 78,
      replied: 67,
      bounced: 6,
      unsubscribed: 4,
      meetings: 23,
      responseRate: 28.6,
      openRate: 66.7,
      clickRate: 50.0,
      meetingRate: 9.8,
      budget: 8000,
      spent: 7650,
      owner: 'David Kim',
      tags: ['Growth', 'Late Stage', 'Expansion'],
      channels: ['email', 'phone', 'events'],
      nextAction: 'Campaign analysis',
      priority: 'low',
      performance: 'excellent'
    }
  ];

  const performanceTrends = [
    { month: 'Jan', openRate: 58, responseRate: 22, meetingRate: 7 },
    { month: 'Feb', openRate: 62, responseRate: 25, meetingRate: 8 },
    { month: 'Mar', openRate: 65, responseRate: 28, meetingRate: 9 },
    { month: 'Apr', openRate: 63, responseRate: 26, meetingRate: 8 },
    { month: 'May', openRate: 67, responseRate: 30, meetingRate: 10 },
    { month: 'Jun', openRate: 64, responseRate: 29, meetingRate: 9 }
  ];

  const channelPerformance = [
    { channel: 'Email', campaigns: 12, avgOpen: 64.2, avgResponse: 28.6, avgMeeting: 8.7, cost: '$1,234' },
    { channel: 'LinkedIn', campaigns: 8, avgOpen: 72.1, avgResponse: 31.4, avgMeeting: 9.2, cost: '$892' },
    { channel: 'Phone', campaigns: 6, avgOpen: 0, avgResponse: 45.3, avgMeeting: 15.6, cost: '$2,156' },
    { channel: 'Events', campaigns: 4, avgOpen: 0, avgResponse: 67.8, avgMeeting: 23.4, cost: '$3,450' },
    { channel: 'Multi-channel', campaigns: 5, avgOpen: 69.5, avgResponse: 34.2, avgMeeting: 11.8, cost: '$1,678' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail;
      case 'linkedin': return Linkedin;
      case 'phone': return Phone;
      case 'twitter': return Twitter;
      case 'events': return Calendar;
      default: return Mail;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {campaignMetrics.map((metric) => {
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
          );
        })}
      </div>

      {/* Performance Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Chart visualization */}
        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-end justify-center p-4">
          <div className="flex items-end space-x-6 w-full max-w-2xl">
            {performanceTrends.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full space-y-1 mb-2">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${(data.openRate / 70) * 120}px` }}
                  />
                  <div 
                    className="bg-green-500 rounded"
                    style={{ height: `${(data.responseRate / 35) * 80}px` }}
                  />
                  <div 
                    className="bg-purple-500 rounded-b"
                    style={{ height: `${(data.meetingRate / 12) * 60}px` }}
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
            <span className="text-sm text-gray-600">Open Rate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Response Rate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Meeting Rate</span>
          </div>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">View all campaigns</button>
        </div>
        
        <div className="space-y-4">
          {campaigns.slice(0, 3).map((campaign) => (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    {campaign.channels.map((channel, index) => {
                      const Icon = getChannelIcon(channel);
                      return <Icon key={index} className="w-3 h-3 text-gray-400" />;
                    })}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className={`w-4 h-4 ${getPerformanceColor(campaign.performance)}`} />
                  <span className={`text-sm font-medium ${getPerformanceColor(campaign.performance)}`}>
                    {campaign.performance}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
              
              <div className="grid grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{campaign.sent}</p>
                  <p className="text-xs text-gray-500">Sent</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">{campaign.opened}</p>
                  <p className="text-xs text-gray-500">Opened</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-600">{campaign.replied}</p>
                  <p className="text-xs text-gray-500">Replied</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-purple-600">{campaign.meetings}</p>
                  <p className="text-xs text-gray-500">Meetings</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-orange-600">{campaign.responseRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Response</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Owner: {campaign.owner} • Last activity: {campaign.lastActivity}
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChannelAnalysisTab = () => (
    <div className="space-y-6">
      {/* Channel Performance Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Channel Performance Analysis</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Channel</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Campaigns</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Open Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Response Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Meeting Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cost per Lead</th>
              </tr>
            </thead>
            <tbody>
              {channelPerformance.map((channel, index) => {
                const Icon = getChannelIcon(channel.channel.toLowerCase());
                return (
                  <tr key={channel.channel} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{channel.channel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{channel.campaigns}</td>
                    <td className="py-3 px-4">
                      {channel.avgOpen > 0 ? (
                        <span className="text-blue-600 font-medium">{channel.avgOpen}%</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-medium">{channel.avgResponse}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-purple-600 font-medium">{channel.avgMeeting}%</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{channel.cost}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Comparison Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Response Rate by Channel</h4>
          <div className="space-y-4">
            {channelPerformance.map((channel, index) => (
              <div key={channel.channel} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{channel.channel}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${(channel.avgResponse / 70) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{channel.avgResponse}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Meeting Conversion by Channel</h4>
          <div className="space-y-4">
            {channelPerformance.map((channel, index) => (
              <div key={channel.channel} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{channel.channel}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${(channel.avgMeeting / 25) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{channel.avgMeeting}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailedAnalysisTab = () => (
    <div className="space-y-6">
      {/* Campaign Details Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Campaign Analysis</h3>
          <div className="flex items-center space-x-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
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
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Open Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Click Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Response Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Meetings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">ROI</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.owner}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{campaign.sent}</td>
                  <td className="py-3 px-4">
                    <span className="text-blue-600 font-medium">{campaign.openRate.toFixed(1)}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-purple-600 font-medium">{campaign.clickRate.toFixed(1)}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">{campaign.responseRate.toFixed(1)}%</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{campaign.meetings}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">
                      {((campaign.meetings * 50000 - campaign.spent) / campaign.spent * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
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

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Performing Campaigns</h4>
          <div className="space-y-3">
            {campaigns
              .sort((a, b) => b.responseRate - a.responseRate)
              .slice(0, 3)
              .map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{campaign.responseRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">response rate</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Optimization Opportunities</h4>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">Low Open Rate</span>
              </div>
              <p className="text-sm text-yellow-700">AI/ML Investor Network has 68.4% open rate. Consider A/B testing subject lines.</p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">High Potential</span>
              </div>
              <p className="text-sm text-blue-700">FinTech Focus shows excellent engagement. Consider expanding similar campaigns.</p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Best Practice</span>
              </div>
              <p className="text-sm text-green-700">Multi-channel campaigns show 34.2% higher response rates than single-channel.</p>
            </div>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Campaign Performance</h1>
              <p className="text-sm text-gray-500 mt-1">
                Comprehensive analysis of your outreach campaign effectiveness
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
              { id: 'channels', label: 'Channel Analysis', icon: Activity },
              { id: 'detailed', label: 'Detailed Analysis', icon: FileText }
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
        {viewMode === 'channels' && renderChannelAnalysisTab()}
        {viewMode === 'detailed' && renderDetailedAnalysisTab()}
      </div>
    </div>
  );
};

export default CampaignPerformance;