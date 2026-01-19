// src/components/UserProfile.tsx
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Settings, 
  Bell, 
  Shield, 
  Key, 
  Globe, 
  Moon, 
  Sun, 
  Save, 
  Camera, 
  Edit, 
  X, 
  Eye,
  EyeOff,
  Smartphone,
  Clock,
  Languages,
  Lock,
  Trash2,
  MessageSquare,
  Download,
  FileText,
  BarChart3,
  Target,
  Users
} from 'lucide-react';

// NEW: Google Connect Button import
import ConnectGoogleButton from "./ConnectGoogleButton";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@techflow.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'VP of Investor Relations',
    department: 'Finance',
    bio: 'Experienced IR professional with 8+ years in FinTech fundraising and investor relationship management.',
    avatarUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    
    // Company Information
    companyName: 'TechFlow Solutions',
    companyRole: 'VP of Investor Relations',
    
    // Contact & Location
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    
    // Preferences
    language: 'en',
    theme: 'light',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    
    // Notifications
    emailNotifications: {
      campaignUpdates: true,
      investorResponses: true,
      meetingReminders: true,
      weeklyReports: true,
      systemUpdates: false
    },
    pushNotifications: {
      campaignUpdates: true,
      investorResponses: true,
      meetingReminders: true,
      weeklyReports: false,
      systemUpdates: false
    },
    smsNotifications: {
      urgentOnly: true,
      meetingReminders: false,
      campaignUpdates: false
    },
    
    // Privacy
    profileVisibility: 'team',
    activityTracking: true,
    dataSharing: false,
    
    // Integration
    connectedAccounts: [
      { id: '1', type: 'gmail', email: 'sarah.chen@gmail.com', status: 'connected' },
      { id: '2', type: 'linkedin', username: 'sarahchen-ir', status: 'connected' },
      { id: '3', type: 'calendar', email: 'sarah.chen@techflow.com', status: 'connected' }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Globe }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  const timezones = [
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
      if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
      
      onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={formData.avatarUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{formData.firstName} {formData.lastName}</h3>
          <p className="text-gray-600">{formData.jobTitle}</p>
          <p className="text-sm text-gray-500">{formData.companyName}</p>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <Edit className="w-3 h-3" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            ) : (
              <p className="text-gray-900">{formData.firstName}</p>
            )}
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            ) : (
              <p className="text-gray-900">{formData.lastName}</p>
            )}
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
            ) : (
              <p className="text-gray-900 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {formData.email}
              </p>
            )}
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ) : (
              <p className="text-gray-900 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {formData.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.jobTitle}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.department}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ) : (
              <p className="text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {formData.location}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.bio}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Preferences */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
                className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                  formData.theme === 'light'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
                className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
                  formData.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={formData.dateFormat}
              onChange={(e) => setFormData(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Format
            </label>
            <select
              value={formData.timeFormat}
              onChange={(e) => setFormData(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-sm text-gray-500">Campaigns Created</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">847</div>
            <div className="text-sm text-gray-500">Investors Added</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-500">Reports Generated</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-blue-600" />
          Email Notifications
        </h4>
        
        <div className="space-y-4">
          {Object.entries(formData.emailNotifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-sm text-gray-500">
                  {key === 'campaignUpdates' && 'Get notified about campaign performance and updates'}
                  {key === 'investorResponses' && 'Receive alerts when investors respond to outreach'}
                  {key === 'meetingReminders' && 'Reminders for upcoming investor meetings'}
                  {key === 'weeklyReports' && 'Weekly summary of your IR activities'}
                  {key === 'systemUpdates' && 'Product updates and new feature announcements'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    [key]: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
          Push Notifications
        </h4>
        
        <div className="space-y-4">
          {Object.entries(formData.pushNotifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-sm text-gray-500">
                  {key === 'campaignUpdates' && 'Real-time campaign performance notifications'}
                  {key === 'investorResponses' && 'Instant alerts for investor responses'}
                  {key === 'meetingReminders' && 'Push reminders for upcoming meetings'}
                  {key === 'weeklyReports' && 'Weekly activity summary notifications'}
                  {key === 'systemUpdates' && 'App updates and maintenance notifications'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pushNotifications: {
                    ...prev.pushNotifications,
                    [key]: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2 text-blue-600" />
          SMS Notifications
        </h4>
        
        <div className="space-y-4">
          {Object.entries(formData.smsNotifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-sm text-gray-500">
                  {key === 'urgentOnly' && 'Only critical alerts and urgent notifications'}
                  {key === 'meetingReminders' && 'SMS reminders for important meetings'}
                  {key === 'campaignUpdates' && 'Campaign milestone and performance alerts'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  smsNotifications: {
                    ...prev.smsNotifications,
                    [key]: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-blue-600" />
          Change Password
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.newPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Two-Factor Authentication
        </h4>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Enable 2FA</p>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.twoFactorEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {formData.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Two-factor authentication is enabled. Use your authenticator app to generate codes when signing in.
            </p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-500">Chrome on macOS • San Francisco, CA</p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Mobile App</p>
                <p className="text-sm text-gray-500">iPhone • Last seen 2 hours ago</p>
              </div>
            </div>
            <button className="text-sm text-red-600 hover:text-red-800">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h4>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="profileVisibility"
              value="public"
              checked={formData.profileVisibility === 'public'}
              onChange={(e) => setFormData(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="text-blue-600 focus:ring-blue-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Public</div>
              <div className="text-sm text-gray-500">Your profile is visible to everyone</div>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="profileVisibility"
              value="team"
              checked={formData.profileVisibility === 'team'}
              onChange={(e) => setFormData(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="text-blue-600 focus:ring-blue-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Team Only</div>
              <div className="text-sm text-gray-500">Only your team members can see your profile</div>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="profileVisibility"
              value="private"
              checked={formData.profileVisibility === 'private'}
              onChange={(e) => setFormData(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="text-blue-600 focus:ring-blue-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Private</div>
              <div className="text-sm text-gray-500">Your profile is only visible to you</div>
            </div>
          </label>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h4>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Activity Tracking</div>
              <div className="text-sm text-gray-500">Allow tracking of your activity for analytics</div>
            </div>
            <input
              type="checkbox"
              checked={formData.activityTracking}
              onChange={(e) => setFormData(prev => ({ ...prev, activityTracking: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Data Sharing</div>
              <div className="text-sm text-gray-500">Share anonymized data for product improvement</div>
            </div>
            <input
              type="checkbox"
              checked={formData.dataSharing}
              onChange={(e) => setFormData(prev => ({ ...prev, dataSharing: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Data Export & Deletion */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Export Your Data</div>
              <div className="text-sm text-gray-500">Download a copy of all your data</div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Delete Account</div>
              <div className="text-sm text-gray-500">Permanently delete your account and all data</div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      {/* Inserted Google Connect Button */}
      <div className="mb-4">
        <ConnectGoogleButton />
      </div>

      {/* Connected Accounts */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h4>
        
        <div className="space-y-4">
          {formData.connectedAccounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  account.type === 'gmail' ? 'bg-red-100' :
                  account.type === 'linkedin' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  {account.type === 'gmail' && <Mail className="w-5 h-5 text-red-600" />}
                  {account.type === 'linkedin' && <Globe className="w-5 h-5 text-blue-600" />}
                  {account.type === 'calendar' && <Calendar className="w-5 h-5 text-green-600" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900 capitalize">{account.type}</div>
                  <div className="text-sm text-gray-500">
                    {account.email || account.username}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  account.status === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {account.status}
                </span>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Salesforce</div>
                  <div className="text-sm text-gray-500">CRM Integration</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                Connect
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Sync your investor data with Salesforce CRM
            </p>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">HubSpot</div>
                  <div className="text-sm text-gray-500">Marketing Automation</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                Connect
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Automate your marketing campaigns with HubSpot
            </p>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Slack</div>
                  <div className="text-sm text-gray-500">Team Communication</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                Connect
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Get notifications and updates in Slack
            </p>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Zapier</div>
                  <div className="text-sm text-gray-500">Workflow Automation</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                Connect
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Connect with 3000+ apps via Zapier
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">User Profile</h2>
              <p className="text-blue-100 text-sm">Manage your account settings and preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'account' && renderAccountTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}
            {activeTab === 'integrations' && renderIntegrationsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;


