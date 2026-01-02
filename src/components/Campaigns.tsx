import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Copy, 
  Trash2, 
  MoreVertical,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter,
  Search,
  Download,
  Settings,
  Zap,
  Globe,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileText,
  Star,
  MapPin,
  Building
} from 'lucide-react';

const Campaigns = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      opened: 89,
      replied: 34,
      meetings: 12,
      responseRate: 23.4,
      openRate: 61.4,
      meetingRate: 8.3,
      budget: 5000,
      spent: 2340,
      owner: 'Sarah Chen',
      tags: ['Series B', 'Growth', 'FinTech'],
      channels: ['email', 'linkedin'],
      nextAction: 'Follow-up sequence 2',
      priority: 'high'
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
      opened: 67,
      replied: 28,
      meetings: 8,
      responseRate: 28.6,
      openRate: 68.4,
      meetingRate: 8.2,
      budget: 3500,
      spent: 1890,
      owner: 'Michael Torres',
      tags: ['FinTech', 'Specialized', 'Angels'],
      channels: ['email', 'linkedin', 'phone'],
      nextAction: 'LinkedIn connection requests',
      priority: 'high'
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
      opened: 52,
      replied: 19,
      meetings: 6,
      responseRate: 25.0,
      openRate: 68.4,
      meetingRate: 7.9,
      budget: 2500,
      spent: 1200,
      owner: 'Lisa Park',
      tags: ['AI/ML', 'Tech', 'Innovation'],
      channels: ['linkedin', 'twitter'],
      nextAction: 'Resume campaign',
      priority: 'medium'
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
      opened: 156,
      replied: 67,
      meetings: 23,
      responseRate: 28.6,
      openRate: 66.7,
      meetingRate: 9.8,
      budget: 8000,
      spent: 7650,
      owner: 'David Kim',
      tags: ['Growth', 'Late Stage', 'Expansion'],
      channels: ['email', 'phone', 'events'],
      nextAction: 'Campaign analysis',
      priority: 'low'
    },
    {
      id: '5',
      name: 'European Investor Outreach',
      description: 'Targeting European VCs for international expansion',
      status: 'draft',
      type: 'email',
      created: '2024-01-25',
      lastActivity: 'Never',
      totalInvestors: 67,
      sent: 0,
      opened: 0,
      replied: 0,
      meetings: 0,
      responseRate: 0,
      openRate: 0,
      meetingRate: 0,
      budget: 4000,
      spent: 0,
      owner: 'Emma Wilson',
      tags: ['Europe', 'International', 'Expansion'],
      channels: ['email', 'linkedin'],
      nextAction: 'Launch campaign',
      priority: 'medium'
    }
  ];

  const campaignTemplates = [
    {
      id: '1',
      name: 'Series A Outreach',
      description: 'Template for early-stage investor outreach',
      type: 'email',
      estimatedResponse: '18-25%',
      channels: ['email', 'linkedin']
    },
    {
      id: '2',
      name: 'Growth Stage Focus',
      description: 'Template for growth and expansion rounds',
      type: 'multi-channel',
      estimatedResponse: '22-30%',
      channels: ['email', 'phone', 'linkedin']
    },
    {
      id: '3',
      name: 'Angel Investor Network',
      description: 'Template for angel and seed investor outreach',
      type: 'linkedin',
      estimatedResponse: '15-22%',
      channels: ['linkedin', 'twitter', 'events']
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail;
      case 'linkedin': return MessageSquare;
      case 'phone': return Phone;
      case 'twitter': return Globe;
      case 'events': return Calendar;
      default: return Mail;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const renderCampaignCard = (campaign: any) => (
    <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 mr-3">{campaign.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
              <Star className={`w-4 h-4 ml-2 ${getPriorityColor(campaign.priority)}`} />
            </div>
            <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {campaign.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Channels */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs text-gray-500">Channels:</span>
              {campaign.channels.map((channel, index) => {
                const Icon = getChannelIcon(channel);
                return (
                  <div key={index} className="flex items-center">
                    <Icon className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-600 capitalize">{channel}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{campaign.totalInvestors}</p>
            <p className="text-xs text-gray-500">Total Investors</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-blue-600">{campaign.opened}</p>
            <p className="text-xs text-gray-500">Opened ({campaign.openRate.toFixed(1)}%)</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">{campaign.replied}</p>
            <p className="text-xs text-gray-500">Replied ({campaign.responseRate.toFixed(1)}%)</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-purple-600">{campaign.meetings}</p>
            <p className="text-xs text-gray-500">Meetings ({campaign.meetingRate.toFixed(1)}%)</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Campaign Progress</span>
            <span>{campaign.responseRate.toFixed(1)}% response rate</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min(campaign.responseRate * 2, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span>{campaign.owner}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{campaign.lastActivity}</span>
          </div>
          
          <div className="flex space-x-2">
            {campaign.status === 'active' && (
              <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200">
                <Pause className="w-3 h-3 mr-1 inline" />
                Pause
              </button>
            )}
            {campaign.status === 'paused' && (
              <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200">
                <Play className="w-3 h-3 mr-1 inline" />
                Resume
              </button>
            )}
            {campaign.status === 'draft' && (
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200">
                <Send className="w-3 h-3 mr-1 inline" />
                Launch
              </button>
            )}
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50">
              <BarChart3 className="w-3 h-3 mr-1 inline" />
              Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKanbanView = () => {
    const statusColumns = [
      { status: 'draft', title: 'Draft', campaigns: filteredCampaigns.filter(c => c.status === 'draft') },
      { status: 'active', title: 'Active', campaigns: filteredCampaigns.filter(c => c.status === 'active') },
      { status: 'paused', title: 'Paused', campaigns: filteredCampaigns.filter(c => c.status === 'paused') },
      { status: 'completed', title: 'Completed', campaigns: filteredCampaigns.filter(c => c.status === 'completed') }
    ];

    return (
      <div className="grid grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <div key={column.status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{column.title}</h3>
              <span className="px-2 py-1 bg-white rounded text-sm font-medium text-gray-600">
                {column.campaigns.length}
              </span>
            </div>
            <div className="space-y-3">
              {column.campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">{campaign.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{campaign.totalInvestors} investors</span>
                    <span className="text-green-600 font-medium">{campaign.responseRate.toFixed(1)}%</span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {campaign.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
              <p className="text-sm text-gray-500 mt-1">
                Create and manage your investor outreach campaigns
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Templates</span>
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
        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+2</span>
              <span className="text-sm text-gray-500 ml-2">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investors Reached</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {campaigns.reduce((sum, c) => sum + c.totalInvestors, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+12.5%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Response Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(campaigns.reduce((sum, c) => sum + c.responseRate, 0) / campaigns.length).toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm font-medium text-red-600">-1.2%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meetings Scheduled</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {campaigns.reduce((sum, c) => sum + c.meetings, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+18.3%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
              
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                <Filter className="w-5 h-5" />
              </button>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  List
                </button>
                <button 
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Kanban
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Templates Quick Access */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Start Templates</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View all templates</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaignTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {template.channels.map((channel, index) => {
                      const Icon = getChannelIcon(channel);
                      return <Icon key={index} className="w-3 h-3 text-gray-400" />;
                    })}
                  </div>
                  <span className="text-xs text-green-600 font-medium">{template.estimatedResponse}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign List/Kanban */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map(renderCampaignCard)}
          </div>
        ) : (
          renderKanbanView()
        )}

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters to find campaigns.'
                : 'Get started by creating your first investor outreach campaign.'
              }
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;