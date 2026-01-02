import React, { useState, useEffect } from "react";
import ConnectGoogleButton from "../components/ConnectGoogleButton";
import {
  Settings as SettingsIcon,
  User,
  Users,
  Building,
  Shield,
  Bell,
  Database,
  Zap,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Key,
  Mail,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  Copy,
  ExternalLink,
  Clock,
  Languages,
  DollarSign,
  Target,
  MessageSquare,
  Eye,
} from "lucide-react";
import UserProfile from "./UserProfile";
import AddInvestor from "./AddInvestor";
import AddCampaign from "./AddCampaign";
import { getUsers } from "../services/userService";
import { Link } from "react-router-dom";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAddInvestor, setShowAddInvestor] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const settingsSections = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "company", label: "Company", icon: Building },
    { id: "users", label: "Users & Teams", icon: Users },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: DollarSign },
    { id: "api", label: "API & Webhooks", icon: Database },
    { id: "advanced", label: "Advanced", icon: BarChart3 },
  ];

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Users settings state (moved up from renderUsersSettings)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchUsers() {
      setLoading(true);
      try {
        const queryParams = {
          page: currentPage,
          limit: limit,
        };
        const res = await getUsers(queryParams);
        if (!cancelled) {
          setUsers(res.users || []);
          setTotalResults(res.totalResults || 0);
          setTotalPages(res.totalPages || 0);
        }
      } catch (e) {
        if (!cancelled) {
          setUsers([]);
          setTotalResults(0);
          setTotalPages(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, [currentPage, limit]);

  const integrations = [
    {
      id: "1",
      name: "Gmail",
      description: "Email integration for campaign management",
      status: "connected",
      icon: Mail,
      lastSync: "2 minutes ago",
      accounts: 2,
    },
    {
      id: "2",
      name: "Google Calendar",
      description: "Calendar integration for meeting scheduling",
      status: "connected",
      icon: Calendar,
      lastSync: "1 hour ago",
      accounts: 1,
    },
    {
      id: "3",
      name: "LinkedIn",
      description: "Professional network integration",
      status: "connected",
      icon: Users,
      lastSync: "30 minutes ago",
      accounts: 3,
    },
    {
      id: "4",
      name: "Salesforce",
      description: "CRM integration for investor data",
      status: "disconnected",
      icon: Database,
      lastSync: "Never",
      accounts: 0,
    },
    {
      id: "5",
      name: "Slack",
      description: "Team communication and notifications",
      status: "disconnected",
      icon: MessageSquare,
      lastSync: "Never",
      accounts: 0,
    },
  ];

  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "sk_live_51H7...",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      permissions: ["read", "write"],
    },
    {
      id: "2",
      name: "Development API Key",
      key: "sk_test_51H7...",
      created: "2024-01-10",
      lastUsed: "1 day ago",
      permissions: ["read"],
    },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Company Information
          </h3>
          <button
            onClick={() =>
              setIsEditing(isEditing === "company" ? null : "company")
            }
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            {isEditing === "company" ? (
              <input
                type="text"
                defaultValue="TechFlow Solutions"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">TechFlow Solutions</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            {isEditing === "company" ? (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>FinTech</option>
                <option>HealthTech</option>
                <option>EdTech</option>
                <option>SaaS</option>
              </select>
            ) : (
              <p className="text-gray-900">FinTech</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size
            </label>
            {isEditing === "company" ? (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>201-500</option>
                <option>500+</option>
              </select>
            ) : (
              <p className="text-gray-900">51-200 employees</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            {isEditing === "company" ? (
              <input
                type="url"
                defaultValue="https://techflow.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">https://techflow.com</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            {isEditing === "company" ? (
              <textarea
                rows={3}
                defaultValue="AI-powered financial analytics platform for institutional investors"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">
                AI-powered financial analytics platform for institutional
                investors
              </p>
            )}
          </div>
        </div>

        {isEditing === "company" && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Regional Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Languages className="w-4 h-4 inline mr-2" />
              Default Language
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Timezone
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Pacific Time (PT)</option>
              <option>Mountain Time (MT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
              <option>UTC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Currency
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowUserProfile(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <User className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Edit Profile</div>
            <div className="text-sm text-gray-500">
              Update your personal information
            </div>
          </button>

          <button
            onClick={() => setShowAddInvestor(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Add Investor</div>
            <div className="text-sm text-gray-500">
              Create new investor profile
            </div>
          </button>

          <button
            onClick={() => setShowAddCampaign(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Target className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">New Campaign</div>
            <div className="text-sm text-gray-500">Start investor outreach</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsersSettings = () => {
    // Filtering, Searching, Sorting
    let filteredUsers = users.filter((u) => {
      const roleName = typeof u.role === "string" ? u.role : u.role?.name || "";
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        filterBy && filterBy !== "all" ? roleName === filterBy : true;
      return matchesSearch && matchesRole;
    });
    if (sortBy === "name") {
      filteredUsers = filteredUsers.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else if (sortBy === "role") {
      filteredUsers = filteredUsers.sort((a, b) => {
        const aRole = typeof a.role === "string" ? a.role : a.role?.name || "";
        const bRole = typeof b.role === "string" ? b.role : b.role?.name || "";
        return aRole.localeCompare(bRole);
      });
    } else if (sortBy === "joined") {
      filteredUsers = filteredUsers.sort((a, b) => {
        // Assume there is a created_at or joined_at property, fallback to id
        return (
          (b.created_at || b.joined_at || b.id || 0) -
          (a.created_at || a.joined_at || a.id || 0)
        );
      });
    }

    // Stats bar
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.is_active).length;
    const adminUsers = users.filter((u) => {
      const roleName = typeof u.role === "string" ? u.role : u.role?.name || "";
      return roleName === "Admin";
    }).length;

    // Selection helpers
    const handleSelectUser = (id: string) => {
      setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
      );
    };
    const handleSelectAll = () => {
      if (selectedUsers.length === filteredUsers.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(filteredUsers.map((u) => u.id));
      }
    };

    // Status badge color
    function getStatusColor(status: string | boolean) {
      if (typeof status === "boolean") {
        return status
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800";
      }
      if (status === "Active") return "bg-green-100 text-green-800";
      if (status === "Invited") return "bg-yellow-100 text-yellow-800";
      if (status === "Suspended") return "bg-red-100 text-red-800";
      return "bg-gray-100 text-gray-800";
    }

    return (
      <div className="space-y-6">
        <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Integrations</h3>
        <ConnectGoogleButton className="px-3 py-2 rounded bg-indigo-600 text-black" />
      </div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500">
              Manage your team members, roles, and access.
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={"/add-user"}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center space-x-1 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </Link>
          </div>
        </div>

        {/* Search, Filter, Sort, View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-2">
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort: Name</option>
            <option value="role">Sort: Role</option>
            <option value="joined">Sort: Joined</option>
          </select>
          <div className="flex space-x-1 ml-auto">
            <button
              className={`p-2 rounded-lg border ${
                viewMode === "table"
                  ? "bg-blue-100 border-blue-300"
                  : "border-gray-200"
              } `}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg border ${
                viewMode === "grid"
                  ? "bg-blue-100 border-blue-300"
                  : "border-gray-200"
              } `}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="flex items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <Users className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <div className="font-semibold text-gray-900">{totalUsers}</div>
              <div className="text-xs text-gray-500">Total Users</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <div className="font-semibold text-gray-900">{activeUsers}</div>
              <div className="text-xs text-gray-500">Active Users</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <Shield className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <div className="font-semibold text-gray-900">{adminUsers}</div>
              <div className="text-xs text-gray-500">Admins</div>
            </div>
          </div>
        </div>

        {/* Table/Grid view */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredUsers.length > 0 &&
                        selectedUsers.length === filteredUsers.length
                      }
                      onChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => {
                  const roleName =
                    typeof u.role === "string"
                      ? u.role
                      : u.role?.name || "Unknown";
                  const status =
                    typeof u.is_active === "boolean"
                      ? u.is_active
                      : u.status || "Unknown";
                  return (
                    <tr
                      key={u.id}
                      className={
                        selectedUsers.includes(u.id) ? "bg-blue-50" : ""
                      }
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => handleSelectUser(u.id)}
                          aria-label={`Select ${u.name}`}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap flex items-center">
                        <img
                          src={u.avatar_url}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {u.name}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            roleName === "Admin"
                              ? "bg-red-100 text-red-800"
                              : roleName === "Manager"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {roleName}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            status
                          )}`}
                        >
                          {typeof status === "boolean"
                            ? status
                              ? "Active"
                              : "Inactive"
                            : status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/user-detail/${u.id}`}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/edit-user/${u.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u) => {
              const roleName =
                typeof u.role === "string" ? u.role : u.role?.name || "Unknown";
              const status =
                typeof u.is_active === "boolean"
                  ? u.is_active
                  : u.status || "Unknown";
              return (
                <div
                  key={u.id}
                  className="relative p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={u.avatar_url}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                          u.is_active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        roleName === "Admin"
                          ? "bg-red-100 text-red-800"
                          : roleName === "Manager"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {roleName}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        status
                      )}`}
                    >
                      {typeof status === "boolean"
                        ? status
                          ? "Active"
                          : "Inactive"
                        : status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Message user"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => handleSelectUser(u.id)}
                      aria-label={`Select ${u.name}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * limit, totalResults)}
              </span>{" "}
              of <span className="font-medium">{totalResults}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      {/* Connected Integrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
          <p className="text-sm text-gray-500 mt-1">
            Connect your favorite tools and services
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          integration.status === "connected"
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            integration.status === "connected"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {integration.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        integration.status === "connected"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>Last sync: {integration.lastSync}</span>
                    <span>
                      {integration.accounts} account
                      {integration.accounts !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {integration.status === "connected" ? (
                      <>
                        <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                          Configure
                        </button>
                        <button className="px-3 py-2 text-red-600 border border-red-300 rounded text-sm hover:bg-red-50">
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Webhook Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Webhooks</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Webhook</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Campaign Events</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              https://api.yourapp.com/webhooks/campaigns
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  campaign.created
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  campaign.completed
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Investor Updates</h4>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Inactive
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              https://api.yourapp.com/webhooks/investors
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  investor.created
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  investor.updated
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage your API keys for external integrations
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Generate Key</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{key.name}</h4>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {key.key}
                  </code>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Show full key
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div className="font-medium">{key.created}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Last used:</span>
                    <div className="font-medium">{key.lastUsed}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Permissions:</span>
                    <div className="flex space-x-1 mt-1">
                      {key.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          API Documentation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">REST API</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Complete REST API documentation with examples and authentication
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              View Documentation
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-gray-900">Webhooks</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Real-time event notifications and webhook configuration guide
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              View Guide
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rate Limits
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">API Requests</h4>
              <p className="text-sm text-gray-500">Current usage this month</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-gray-500">of 10,000</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: "28.47%" }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Rate limit:</span>
              <div className="font-medium">1000 requests/hour</div>
            </div>
            <div>
              <span className="text-gray-500">Burst limit:</span>
              <div className="font-medium">100 requests/minute</div>
            </div>
            <div>
              <span className="text-gray-500">Reset time:</span>
              <div className="font-medium">Next hour</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Security Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">SSL Enabled</div>
            <div className="text-sm text-gray-500">
              All data encrypted in transit
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">2FA Available</div>
            <div className="text-sm text-gray-500">
              Two-factor authentication
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Audit Logs</div>
            <div className="text-sm text-gray-500">90 days retention</div>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Password Policy
        </h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                Minimum password length
              </div>
              <div className="text-sm text-gray-500">
                Require at least 8 characters
              </div>
            </div>
            <input
              type="number"
              min="6"
              max="20"
              defaultValue="8"
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                Require special characters
              </div>
              <div className="text-sm text-gray-500">
                Include symbols like !@#$%
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Require numbers</div>
              <div className="text-sm text-gray-500">
                Include at least one number
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                Password expiration
              </div>
              <div className="text-sm text-gray-500">
                Force password change every 90 days
              </div>
            </div>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Session Management
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Session timeout</div>
              <div className="text-sm text-gray-500">
                Automatically log out inactive users
              </div>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>8 hours</option>
              <option>Never</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                Concurrent sessions
              </div>
              <div className="text-sm text-gray-500">
                Maximum active sessions per user
              </div>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>1</option>
              <option>3</option>
              <option>5</option>
              <option>Unlimited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Security Events
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            View all logs
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Successful login
                </div>
                <div className="text-xs text-gray-500">
                  sarah.chen@techflow.com from 192.168.1.1
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Key className="w-4 h-4 text-blue-500 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  API key generated
                </div>
                <div className="text-xs text-gray-500">
                  Production API Key created
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-yellow-500 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Failed login attempt
                </div>
                <div className="text-xs text-gray-500">
                  Invalid password for michael.torres@techflow.com
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Plan
        </h3>

        <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <h4 className="text-xl font-bold text-blue-900">
              Professional Plan
            </h4>
            <p className="text-blue-700">Perfect for growing teams</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-blue-600">
              <span>✓ Up to 10,000 investors</span>
              <span>✓ Unlimited campaigns</span>
              <span>✓ Advanced analytics</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-900">$99</div>
            <div className="text-blue-700">per month</div>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Usage & Limits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Usage & Limits
        </h3>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Investors
              </span>
              <span className="text-sm text-gray-500">2,847 of 10,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "28.47%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Campaigns this month
              </span>
              <span className="text-sm text-gray-500">24 of unlimited</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "24%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                API calls this month
              </span>
              <span className="text-sm text-gray-500">
                156,789 of 1,000,000
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: "15.68%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Billing History
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Download All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Jan 1, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Professional Plan - Monthly
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $99.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-800">Download</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Dec 1, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Professional Plan - Monthly
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $99.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-800">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Method
        </h3>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-4">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                •••• •••• •••• 4242
              </div>
              <div className="text-sm text-gray-500">Expires 12/25</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Edit
            </button>
            <button className="px-3 py-1 text-red-600 border border-red-300 rounded text-sm hover:bg-red-50">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings();
      case "users":
        return renderUsersSettings();
      case "integrations":
        return renderIntegrationsSettings();
      case "api":
        return renderAPISettings();
      case "security":
        return renderSecuritySettings();
      case "billing":
        return renderBillingSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mr-3 ${
                      activeSection === section.id
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>

      {/* Modals */}
      {showUserProfile && (
        <UserProfile
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          onSave={(userData) => {
            console.log("User profile saved:", userData);
            setShowUserProfile(false);
          }}
        />
      )}

      {showAddInvestor && (
        <AddInvestor
        // isOpen={showAddInvestor}
        // onClose={() => setShowAddInvestor(false)}
        // onSave={(investorData) => {
        //   console.log('Investor saved:', investorData);
        //   setShowAddInvestor(false);
        // }}
        />
      )}

      {showAddCampaign && (
        <AddCampaign
          isOpen={showAddCampaign}
          onClose={() => setShowAddCampaign(false)}
          onSave={(campaignData) => {
            console.log("Campaign saved:", campaignData);
            setShowAddCampaign(false);
          }}
        />
      )}
    </div>
  );
};

export default Settings;
