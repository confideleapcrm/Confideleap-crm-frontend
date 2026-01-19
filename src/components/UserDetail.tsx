// src/components/UserDetail.tsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Users,
  Activity,
  Clock,
  FileText,
  Eye,
  StickyNote,
  Shield,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById } from "../services/userService";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getUserById(id)
      .then((data) => {
        setUser(data);
        // --- NEW: persist quick lookup for share links & outside components
        try {
          (window as any).investorPhoneLookup = (window as any).investorPhoneLookup || {};
          (window as any).investorEmailLookup = (window as any).investorEmailLookup || {};
          if (data) {
            // If this "user" is an investor-equivalent with phone/email
            // (in case this file is used for users too, we still set safe lookups)
            const uid = data.id ?? id;
            if (uid) {
              if (data.phone) (window as any).investorPhoneLookup[uid] = data.phone;
              if (data.email) (window as any).investorEmailLookup[uid] = data.email;
            }
          }
        } catch (e) {
          // ignore lookup failures
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [id]);
  // ... rest of file unchanged
  // (the rest of the UserDetail code remains exactly as you had it)


  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "notes", label: "Notes", icon: StickyNote },
  ];

  const renderOverviewTab = () => {
    if (!user) return null;
    return (
      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a
                  href={`mailto:${user.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {user.email}
                </a>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${user.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {user.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-gray-900 capitalize">{user.role.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p
                className={`font-medium ${
                  user.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Mapped Customers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Mapped Customers
          </h3>
          <div className="mt-2">
            {user.mappedCustomers && user.mappedCustomers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.mappedCustomers.map((customer: any) => (
                  <span
                    key={customer.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    title={customer.description}
                  >
                    {customer.first_name} {customer.last_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No mapped customers</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPermissionsTab = () => {
    if (!user) return null;
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
        {user.permissions && user.permissions.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {user.permissions.map((perm: string) => (
              <li key={perm}>{perm}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No permissions assigned</p>
        )}
      </div>
    );
  };

  const renderDocumentsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Shared Documents
      </h3>
      <p className="text-gray-500">Document handling coming soon...</p>
    </div>
  );

  const renderNotesTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
      <p className="text-gray-700 text-sm leading-relaxed">
        {user?.notes || "No notes available"}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading user details...</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <img
                  src={
                    user.avatarUrl ||
                    "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                  }
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">{user.jobTitle}</p>
                  <p className="text-blue-600 font-medium">{user.department}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/edit-user/${user.id}`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">
              {user.activityScore || 0}
            </p>
            <p className="text-xs text-gray-500">Activity Score</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">
              {user.mappedCustomers?.length || 0}
            </p>
            <p className="text-xs text-gray-500">Mapped Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500">Last Login</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "permissions" && renderPermissionsTab()}
        {activeTab === "documents" && renderDocumentsTab()}
        {activeTab === "notes" && renderNotesTab()}
      </div>
    </div>
  );
};

export default UserDetail;