// src/components/AddCampaign.tsx
import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Target, 
  Mail, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2,
  Upload,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle,
  Globe,
  Linkedin,
  Twitter,
  FileText,
  Zap,
  Filter,
  Clock,
  BarChart3
} from 'lucide-react';

interface AddCampaignProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: any) => void;
}

const AddCampaign: React.FC<AddCampaignProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    type: 'email',
    priority: 'medium',
    
    // Channels
    channels: ['email'] as string[],
    
    // Content
    subjectLine: '',
    messageContent: '',
    
    // Targeting
    targetAudience: {
      investmentStages: [] as string[],
      sectorPreferences: [] as string[],
      geographicPreferences: [] as string[],
      firmTypes: [] as string[],
      seniorityLevels: [] as string[],
      portfolioFitScore: { min: 0, max: 100 },
      status: [] as string[]
    },
    
    // Scheduling
    sendSchedule: {
      type: 'immediate', // immediate, scheduled, drip
      scheduledDate: '',
      scheduledTime: '',
      timezone: 'UTC',
      dripSequence: [] as any[]
    },
    
    // Follow-up
    followUpSequence: [] as any[],
    
    // Budget & Goals
    budget: '',
    expectedResponseRate: '',
    targetMeetings: '',
    
    // Settings
    trackOpens: true,
    trackClicks: true,
    autoFollowUp: true,
    unsubscribeLink: true,
    
    // Tags
    tags: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTag, setCurrentTag] = useState('');

  const channelOptions = [
    { value: 'email', label: 'Email', icon: Mail, description: 'Direct email outreach' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, description: 'LinkedIn connection requests and messages' },
    { value: 'phone', label: 'Phone', icon: Phone, description: 'Cold calling and warm calls' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, description: 'Twitter engagement and DMs' },
    { value: 'events', label: 'Events', icon: Calendar, description: 'Event-based outreach' }
  ];

  const campaignTypes = [
    { value: 'email', label: 'Email Campaign', description: 'Traditional email outreach' },
    { value: 'linkedin', label: 'LinkedIn Campaign', description: 'LinkedIn-focused outreach' },
    { value: 'multi-channel', label: 'Multi-Channel', description: 'Coordinated across multiple channels' },
    { value: 'phone', label: 'Phone Campaign', description: 'Call-based outreach' },
    { value: 'event', label: 'Event Follow-up', description: 'Post-event engagement' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' }
  ];

  const investmentStageOptions = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Growth', 'Late Stage', 'IPO'
  ];

  const sectorOptions = [
    'FinTech', 'HealthTech', 'EdTech', 'SaaS', 'E-commerce', 'AI/ML', 'Biotech', 'CleanTech',
    'Consumer', 'Enterprise', 'Gaming', 'Media', 'Real Estate', 'Transportation', 'Food & Beverage'
  ];

  const geographicOptions = [
    'North America', 'United States', 'Canada', 'Europe', 'United Kingdom', 'Germany', 'France',
    'Asia Pacific', 'China', 'India', 'Japan', 'Southeast Asia', 'Latin America', 'Middle East', 'Africa'
  ];

  const firmTypeOptions = [
    'VC', 'PE', 'Corporate VC', 'Angel Group', 'Family Office', 'Hedge Fund', 'Investment Bank'
  ];

  const seniorityLevelOptions = [
    'Analyst', 'Associate', 'Principal', 'Vice President', 'Partner', 'Managing Partner', 'General Partner'
  ];

  const statusOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'warm', label: 'Warm' },
    { value: 'cold', label: 'Cold' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'unresponsive', label: 'Unresponsive' }
  ];

  const scheduleTypes = [
    { value: 'immediate', label: 'Send Immediately', description: 'Start campaign right away' },
    { value: 'scheduled', label: 'Schedule for Later', description: 'Set specific date and time' },
    { value: 'drip', label: 'Drip Campaign', description: 'Automated sequence over time' }
  ];

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Campaign name is required';
    if (!formData.description.trim()) newErrors.description = 'Campaign description is required';
    if (formData.channels.length === 0) newErrors.channels = 'At least one channel is required';
    
    if (formData.channels.includes('email')) {
      if (!formData.subjectLine.trim()) newErrors.subjectLine = 'Subject line is required for email campaigns';
      if (!formData.messageContent.trim()) newErrors.messageContent = 'Message content is required';
    }

    if (formData.sendSchedule.type === 'scheduled') {
      if (!formData.sendSchedule.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
      if (!formData.sendSchedule.scheduledTime) newErrors.scheduledTime = 'Scheduled time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const campaignData = {
        ...formData,
        id: Date.now().toString(),
        status: 'draft',
        totalRecipients: 0,
        sentCount: 0,
        openedCount: 0,
        repliedCount: 0,
        meetingCount: 0,
        createdAt: new Date().toISOString()
      };
      
      onSave(campaignData);
      onClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleArrayToggle = (array: string[], value: string, field: string) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        [field]: newArray
      }
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addFollowUp = () => {
    setFormData(prev => ({
      ...prev,
      followUpSequence: [
        ...prev.followUpSequence,
        {
          id: Date.now(),
          delay: 3,
          delayUnit: 'days',
          subject: '',
          content: '',
          channel: 'email'
        }
      ]
    }));
  };

  const removeFollowUp = (index: number) => {
    setFormData(prev => ({
      ...prev,
      followUpSequence: prev.followUpSequence.filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Campaign details and type' },
    { number: 2, title: 'Content', description: 'Message and subject line' },
    { number: 3, title: 'Targeting', description: 'Audience selection' },
    { number: 4, title: 'Schedule', description: 'Timing and follow-up' },
    { number: 5, title: 'Review', description: 'Final review and launch' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Series B Outreach Q1 2024"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe the purpose and goals of this campaign..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Campaign Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {campaignTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          formData.type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priority Level
                  </label>
                  <div className="flex gap-3">
                    {priorityOptions.map(priority => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.priority === priority.value
                            ? priority.color
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Channels */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channelOptions.map(channel => {
                  const Icon = channel.icon;
                  return (
                    <button
                      key={channel.value}
                      type="button"
                      onClick={() => handleChannelToggle(channel.value)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        formData.channels.includes(channel.value)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className={`w-5 h-5 mr-2 ${
                          formData.channels.includes(channel.value) ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium text-gray-900">{channel.label}</span>
                        {formData.channels.includes(channel.value) && (
                          <CheckCircle className="w-4 h-4 ml-auto text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{channel.description}</p>
                    </button>
                  );
                })}
              </div>
              
              {errors.channels && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.channels}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Content</h3>
            
            {formData.channels.includes('email') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject Line *
                  </label>
                  <input
                    type="text"
                    value={formData.subjectLine}
                    onChange={(e) => setFormData(prev => ({ ...prev, subjectLine: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.subjectLine ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., {{company_name}} Series B - AI-Powered Financial Analytics"
                  />
                  {errors.subjectLine && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.subjectLine}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Use variables like {{first_name}}, {{company_name}}, {{firm_name}} for personalization
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content *
                  </label>
                  <textarea
                    value={formData.messageContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, messageContent: e.target.value }))}
                    rows={12}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.messageContent ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={`Hi {{first_name}},

I hope this email finds you well. I'm reaching out because of your expertise in {{sector}} investments and your portfolio companies like {{portfolio_company}}.

[Your message content here...]

Best regards,
{{sender_name}}`}
                  />
                  {errors.messageContent && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.messageContent}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Follow-up Sequence */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900">Follow-up Sequence</h4>
                <button
                  type="button"
                  onClick={addFollowUp}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Follow-up</span>
                </button>
              </div>

              {formData.followUpSequence.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No follow-up messages configured</p>
                  <p className="text-sm">Add follow-up messages to increase response rates</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.followUpSequence.map((followUp, index) => (
                    <div key={followUp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Follow-up #{index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeFollowUp(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delay
                          </label>
                          <input
                            type="number"
                            value={followUp.delay}
                            onChange={(e) => {
                              const newSequence = [...formData.followUpSequence];
                              newSequence[index].delay = parseInt(e.target.value);
                              setFormData(prev => ({ ...prev, followUpSequence: newSequence }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <select
                            value={followUp.delayUnit}
                            onChange={(e) => {
                              const newSequence = [...formData.followUpSequence];
                              newSequence[index].delayUnit = e.target.value;
                              setFormData(prev => ({ ...prev, followUpSequence: newSequence }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Channel
                          </label>
                          <select
                            value={followUp.channel}
                            onChange={(e) => {
                              const newSequence = [...formData.followUpSequence];
                              newSequence[index].channel = e.target.value;
                              setFormData(prev => ({ ...prev, followUpSequence: newSequence }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {formData.channels.map(channel => (
                              <option key={channel} value={channel}>
                                {channel.charAt(0).toUpperCase() + channel.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Line
                          </label>
                          <input
                            type="text"
                            value={followUp.subject}
                            onChange={(e) => {
                              const newSequence = [...formData.followUpSequence];
                              newSequence[index].subject = e.target.value;
                              setFormData(prev => ({ ...prev, followUpSequence: newSequence }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Follow-up subject line"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            value={followUp.content}
                            onChange={(e) => {
                              const newSequence = [...formData.followUpSequence];
                              newSequence[index].content = e.target.value;
                              setFormData(prev => ({ ...prev, followUpSequence: newSequence }));
                            }}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Follow-up message content..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Audience</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Investment Stages
                </label>
                <div className="flex flex-wrap gap-2">
                  {investmentStageOptions.map(stage => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => handleArrayToggle(formData.targetAudience.investmentStages, stage, 'investmentStages')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.targetAudience.investmentStages.includes(stage)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sector Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {sectorOptions.map(sector => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => handleArrayToggle(formData.targetAudience.sectorPreferences, sector, 'sectorPreferences')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.targetAudience.sectorPreferences.includes(sector)
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Geographic Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {geographicOptions.map(region => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => handleArrayToggle(formData.targetAudience.geographicPreferences, region, 'geographicPreferences')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.targetAudience.geographicPreferences.includes(region)
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Firm Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {firmTypeOptions.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleArrayToggle(formData.targetAudience.firmTypes, type, 'firmTypes')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.targetAudience.firmTypes.includes(type)
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Seniority Levels
                </label>
                <div className="flex flex-wrap gap-2">
                  {seniorityLevelOptions.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleArrayToggle(formData.targetAudience.seniorityLevels, level, 'seniorityLevels')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.targetAudience.seniorityLevels.includes(level)
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Investor Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleArrayToggle(formData.targetAudience.status, status.value, 'status')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.targetAudience.status.includes(status.value)
                          ? 'bg-gray-800 text-white border border-gray-800'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Portfolio Fit Score Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.targetAudience.portfolioFitScore.min}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          portfolioFitScore: {
                            ...prev.targetAudience.portfolioFitScore,
                            min: parseInt(e.target.value) || 0
                          }
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.targetAudience.portfolioFitScore.max}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          portfolioFitScore: {
                            ...prev.targetAudience.portfolioFitScore,
                            max: parseInt(e.target.value) || 100
                          }
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Send Schedule
                </label>
                <div className="space-y-3">
                  {scheduleTypes.map(schedule => (
                    <button
                      key={schedule.value}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        sendSchedule: { ...prev.sendSchedule, type: schedule.value }
                      }))}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        formData.sendSchedule.type === schedule.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{schedule.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{schedule.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.sendSchedule.type === 'scheduled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      value={formData.sendSchedule.scheduledDate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        sendSchedule: { ...prev.sendSchedule, scheduledDate: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduledDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.scheduledDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Time *
                    </label>
                    <input
                      type="time"
                      value={formData.sendSchedule.scheduledTime}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        sendSchedule: { ...prev.sendSchedule, scheduledTime: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduledTime && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.scheduledTime}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Budget & Goals</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Response Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.expectedResponseRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedResponseRate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="25.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Meetings
                    </label>
                    <input
                      type="number"
                      value={formData.targetMeetings}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetMeetings: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Campaign Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.trackOpens}
                      onChange={(e) => setFormData(prev => ({ ...prev, trackOpens: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">Track email opens</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.trackClicks}
                      onChange={(e) => setFormData(prev => ({ ...prev, trackClicks: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">Track link clicks</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.autoFollowUp}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoFollowUp: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">Enable automatic follow-up sequence</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.unsubscribeLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, unsubscribeLink: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">Include unsubscribe link</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Campaign</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Campaign Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Name:</span> {formData.name}</div>
                    <div><span className="text-gray-500">Type:</span> {formData.type}</div>
                    <div><span className="text-gray-500">Priority:</span> {formData.priority}</div>
                    <div><span className="text-gray-500">Channels:</span> {formData.channels.join(', ')}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Send:</span> {formData.sendSchedule.type}</div>
                    {formData.sendSchedule.type === 'scheduled' && (
                      <>
                        <div><span className="text-gray-500">Date:</span> {formData.sendSchedule.scheduledDate}</div>
                        <div><span className="text-gray-500">Time:</span> {formData.sendSchedule.scheduledTime}</div>
                      </>
                    )}
                    <div><span className="text-gray-500">Follow-ups:</span> {formData.followUpSequence.length}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Targeting Criteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Investment Stages:</span>
                    <div className="mt-1">
                      {formData.targetAudience.investmentStages.length > 0 
                        ? formData.targetAudience.investmentStages.join(', ')
                        : 'All stages'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Sectors:</span>
                    <div className="mt-1">
                      {formData.targetAudience.sectorPreferences.length > 0 
                        ? formData.targetAudience.sectorPreferences.join(', ')
                        : 'All sectors'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Geography:</span>
                    <div className="mt-1">
                      {formData.targetAudience.geographicPreferences.length > 0 
                        ? formData.targetAudience.geographicPreferences.join(', ')
                        : 'All regions'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Portfolio Fit:</span>
                    <div className="mt-1">
                      {formData.targetAudience.portfolioFitScore.min}% - {formData.targetAudience.portfolioFitScore.max}%
                    </div>
                  </div>
                </div>
              </div>

              {formData.channels.includes('email') && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Email Content Preview</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-2">Subject: {formData.subjectLine}</div>
                    <div className="text-sm whitespace-pre-wrap">{formData.messageContent.substring(0, 200)}...</div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Estimated Results</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-blue-600 font-semibold">~150</div>
                    <div className="text-blue-700">Recipients</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-semibold">~38</div>
                    <div className="text-blue-700">Responses</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-semibold">~12</div>
                    <div className="text-blue-700">Meetings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Create New Campaign</h2>
              <p className="text-blue-100 text-sm">Set up your investor outreach campaign</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.number
                    ? 'bg-blue-600 text-white'
                    : currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Campaign</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCampaign;