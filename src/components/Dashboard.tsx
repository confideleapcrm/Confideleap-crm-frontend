// src/components/Dashboard.tsx
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
  MoreHorizontal
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data for dashboard metrics
  const keyMetrics = [
    {
      name: 'Total Investors',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      description: 'Active investor relationships'
    },
    {
      name: 'Pipeline Value',
      value: '$847M',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Total potential investment'
    },
    {
      name: 'Active Campaigns',
      value: '24',
      change: '+4',
      changeType: 'positive',
      icon: Target,
      description: 'Ongoing outreach campaigns'
    },
    {
      name: 'Response Rate',
      value: '34.2%',
      change: '-2.1%',
      changeType: 'negative',
      icon: MessageCircle,
      description: 'Average campaign response'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'meeting',
      title: 'Meeting with Sequoia Capital',
      description: 'Series B discussion with Sarah Williams',
      time: '2 hours ago',
      status: 'completed',
      icon: Calendar
    },
    {
      id: 2,
      type: 'email',
      title: 'Follow-up sent to A16Z',
      description: 'Pitch deck shared with Michael Chen',
      time: '4 hours ago',
      status: 'sent',
      icon: Mail
    },
    {
      id: 3,
      type: 'call',
      title: 'Call scheduled with GV',
      description: 'Initial screening call with Emily Park',
      time: '6 hours ago',
      status: 'scheduled',
      icon: Phone
    },
    {
      id: 4,
      type: 'update',
      title: 'Investor profile updated',
      description: 'Added new investment preferences for Kleiner Perkins',
      time: '1 day ago',
      status: 'updated',
      icon: Users
    }
  ];

  const topInvestors = [
    {
      name: 'Emily Park',
      firm: 'GV (Google Ventures)',
      fit: 94,
      status: 'hot',
      lastContact: '2 days ago',
      avatar: 'https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    {
      name: 'Michael Chen',
      firm: 'Andreessen Horowitz',
      fit: 92,
      status: 'hot',
      lastContact: '3 days ago',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    {
      name: 'Lisa Zhang',
      firm: 'Index Ventures',
      fit: 90,
      status: 'warm',
      lastContact: '1 week ago',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    },
    {
      name: 'Sarah Williams',
      firm: 'Sequoia Capital',
      fit: 88,
      status: 'contacted',
      lastContact: '2 days ago',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
    }
  ];

  const campaignPerformance = [
    { name: 'Series B Outreach', sent: 145, opened: 89, replied: 34, meetings: 12, status: 'active' },
    { name: 'FinTech Focus', sent: 98, opened: 67, replied: 28, meetings: 8, status: 'active' },
    { name: 'AI/ML Investors', sent: 76, opened: 52, replied: 19, meetings: 6, status: 'paused' },
    { name: 'Growth Stage', sent: 234, opened: 156, replied: 67, meetings: 23, status: 'completed' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Overview of your investor relations activities and performance
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
                <option value="1y">Last year</option>
              </select>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pipeline Overview Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pipeline Overview</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Pipeline visualization would appear here</p>
                <p className="text-xs text-gray-500">Showing investment stages and amounts</p>
              </div>
            </div>
            
            {/* Pipeline Stages */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-900">Initial Contact</p>
                <p className="text-xs text-gray-500">847 investors</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-900">In Discussion</p>
                <p className="text-xs text-gray-500">234 investors</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-900">Due Diligence</p>
                <p className="text-xs text-gray-500">67 investors</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-900">Term Sheet</p>
                <p className="text-xs text-gray-500">12 investors</p>
              </div>
            </div>
          </div>

          {/* Top Performing Investors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Matches</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            
            <div className="space-y-4">
              {topInvestors.map((investor, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <img
                      src={investor.avatar}
                      alt={investor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{investor.name}</p>
                      <p className="text-xs text-gray-500">{investor.firm}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-semibold text-green-600">{investor.fit}%</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {activity.status === 'scheduled' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {activity.status === 'sent' && <Mail className="w-4 h-4 text-blue-500" />}
                      {activity.status === 'updated' && <Activity className="w-4 h-4 text-gray-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campaign Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Manage campaigns</button>
            </div>
            
            <div className="space-y-4">
              {campaignPerformance.map((campaign, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCampaignStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
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
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Response Rate</span>
                      <span>{Math.round((campaign.replied / campaign.sent) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(campaign.replied / campaign.sent) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Target className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Start New Campaign</p>
              <p className="text-xs text-gray-500">Create targeted outreach</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Investors</p>
              <p className="text-xs text-gray-500">Import or create profiles</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Generate Report</p>
              <p className="text-xs text-gray-500">Export analytics data</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Schedule Meeting</p>
              <p className="text-xs text-gray-500">Book investor calls</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;