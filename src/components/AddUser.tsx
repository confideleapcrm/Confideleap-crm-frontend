// src/components/AddUser.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
    X,
    Save,
    User,
    Mail,
    Phone,
    Shield,
    Eye,
    EyeOff,
    AlertCircle,
    Camera,
    Clock,
    Languages,
    Bell,
    Lock,
    Settings,
    UserPlus,
    Edit3,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUserById, addUser, updateUser } from "../services/userService";
import { getCompanies } from "../services/companyService";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

const AddUser: React.FC<{}> = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams<{ id?: string }>();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [allCompanies, setAllCompanies] = useState<any[]>([]);
    const [companyResults, setCompanyResults] = useState<any[]>([]);
    const [companyQuery, setCompanyQuery] = useState("");
    const [companiesLoading, setCompaniesLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Information
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatarUrl: "",

        // Professional Information
        jobTitle: "",
        department: "",
        bio: "",

        // Location & Preferences
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "light",

        // Account Settings
        password: "",
        confirmPassword: "",
        role: "user",
        isActive: true,
        emailVerified: false,
        twoFactorEnabled: false,

        // Notification Preferences
        emailNotifications: {
            campaignUpdates: true,
            investorResponses: true,
            meetingReminders: true,
            weeklyReports: true,
            systemUpdates: false,
        },
        pushNotifications: {
            campaignUpdates: true,
            investorResponses: true,
            meetingReminders: true,
            weeklyReports: false,
            systemUpdates: false,
        },

        // Permissions (for role-based access)
        permissions: {
            campaigns: "read",
            investors: "read",
            reports: "read",
            users: "none",
            settings: "none",
        },
        mappedCustomers: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && id) {
            setLoading(true);
            getUserById(id)
                .then((data) => {
                    // Determine role string from possible object or missing value
                    let roleString = "";
                    if (
                        data.role &&
                        typeof data.role === "object" &&
                        "name" in data.role
                    ) {
                        roleString = data.role.name || "";
                    } else if (typeof data.role === "string") {
                        roleString = data.role;
                    } else {
                        roleString = "";
                    }
                    setFormData({
                        ...formData,
                        ...data,
                        role: roleString,
                        mappedCustomers: (data.mappedCustomers || []).map((c: any) => c.id),
                    });
                })
                .catch((error) => {
                    console.error("Error loading user:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);


    const debouncedCompanySearch = useMemo(
        () =>
            debounce((q: string) => {
                if (!q.trim()) {
                    setCompanyResults(allCompanies);
                    return;
                }
                const lq = q.toLowerCase();
                setCompanyResults(
                    allCompanies.filter(
                        (c) =>
                            c.name?.toLowerCase().includes(lq) ||
                            c.domain?.toLowerCase().includes(lq)
                    )
                );
            }, 200),
        [allCompanies]
    );


    useEffect(() => {
        debouncedCompanySearch(companyQuery);
        return () => debouncedCompanySearch.cancel();
    }, [companyQuery, allCompanies]);


    useEffect(() => {
        const loadCompanies = async () => {
            try {
                setCompaniesLoading(true);
                const res = await getCompanies({ page: 1, limit: 1000 });
                const companies = res?.companies || [];
                setAllCompanies(companies);
                setCompanyResults(companies);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setAllCompanies([]);
                setCompanyResults([]);
            } finally {
                setCompaniesLoading(false);
            }
        };
        loadCompanies();
    }, []);


    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "account", label: "Account", icon: Settings },
        { id: "permissions", label: "Permissions", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    const roles = [
        {
            value: "admin",
            label: "Administrator",
            description: "Full system access",
        },
        {
            value: "manager",
            label: "Manager",
            description: "Team management and reporting",
        },
        { value: "user", label: "User", description: "Standard user access" },
        { value: "viewer", label: "Viewer", description: "Read-only access" },
    ];

    const departments = [
        "Finance",
        "Strategy",
        "Business Development",
        "Executive",
        "Operations",
        "Marketing",
        "Sales",
        "Legal",
        "HR",
        "IT",
    ];

    const timezones = [
        "America/Los_Angeles",
        "America/Denver",
        "America/Chicago",
        "America/New_York",
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Asia/Shanghai",
        "Asia/Kolkata",
    ];

    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "zh", name: "Chinese" },
        { code: "ja", name: "Japanese" },
    ];

    const permissionLevels = [
        { value: "none", label: "No Access", color: "text-gray-600" },
        { value: "read", label: "Read Only", color: "text-blue-600" },
        { value: "write", label: "Read & Write", color: "text-green-600" },
        { value: "admin", label: "Full Access", color: "text-red-600" },
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Email is invalid";

        if (!isEditMode) {
            if (!formData.password.trim())
                newErrors.password = "Password is required";
            else if (formData.password.length < 8)
                newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        if (newErrors.password || newErrors.confirmPassword) {
            setActiveTab("account");
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            let response;

            const payload: any = {
                ...formData,
            };

            if (isEditMode && id) {
                // ❌ backend does NOT expect password on update
                delete payload.password;
                delete payload.confirmPassword;

                response = await updateUser(id, payload);
            } else {
                // ✅ backend expects password on create
                response = await addUser(payload);
            }


            navigate("/settings");
        } catch (error) {
            console.error("Error saving user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const renderProfileTab = () => (
        <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {formData.avatarUrl ? (
                            <img
                                src={formData.avatarUrl}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-600 text-2xl font-medium">
                                {formData.firstName[0]}
                                {formData.lastName[0]}
                            </span>
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {formData.firstName} {formData.lastName}
                    </h3>
                    <p className="text-gray-600">{formData.jobTitle || "No title set"}</p>
                    <p className="text-sm text-gray-500">
                        {formData.department || "No department"}
                    </p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? "border-red-300" : "border-gray-300"
                            }`}
                        placeholder="Enter first name"
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.firstName}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? "border-red-300" : "border-gray-300"
                            }`}
                        placeholder="Enter last name"
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.lastName}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-300" : "border-gray-300"
                                }`}
                            placeholder="user@company.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                    </label>
                    <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., VP of Investor Relations"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                    </label>
                    <select
                        value={formData.department}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, department: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select department</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mapped Companies
                    </label>

                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={companyQuery}
                            onChange={(e) => setCompanyQuery(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="border rounded-lg max-h-60 overflow-auto">
                        {companiesLoading ? (
                            <div className="p-4 text-sm text-gray-500">Loading companies…</div>
                        ) : (
                            companyResults.map((c) => {
                                const checked = formData.mappedCustomers.includes(c.id);
                                return (
                                    <label
                                        key={c.id}
                                        className="flex items-center px-3 py-2 hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    mappedCustomers: checked
                                                        ? prev.mappedCustomers.filter((id) => id !== c.id)
                                                        : [...prev.mappedCustomers, c.id],
                                                }))
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {c.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {c.domain || c.website || ""}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })
                        )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                        Select one or more companies for this user
                    </p>

                    <p className="text-xs text-gray-500">
                        Hold Ctrl / Cmd to select multiple
                    </p>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                    </label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief professional background..."
                    />
                </div>
            </div>
        </div>
    );

    const renderAccountTab = () => (
        <div className="space-y-6">
            {/* Account Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, role: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                        {roles.find((r) => r.value === formData.role)?.description}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Status
                    </label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={() =>
                                    setFormData((prev) => ({ ...prev, isActive: true }))
                                }
                                className="text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="isActive"
                                checked={!formData.isActive}
                                onChange={() =>
                                    setFormData((prev) => ({ ...prev, isActive: false }))
                                }
                                className="text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">Inactive</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                    </label>
                    <div className="relative">
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={formData.language}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, language: e.target.value }))
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
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
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, timezone: e.target.value }))
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {timezones.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            {!isEditMode && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-blue-600" />
                        Password Setup
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-300" : "border-gray-300"
                                        }`}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        confirmPassword: e.target.value,
                                    }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? "border-red-300" : "border-gray-300"
                                    }`}
                                placeholder="Confirm password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Security Settings */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Settings
                </h4>

                <div className="space-y-4">
                    <label className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900">
                                Email Verification
                            </div>
                            <div className="text-sm text-gray-500">
                                Require email verification for account access
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.emailVerified}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    emailVerified: e.target.checked,
                                }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </label>

                    <label className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900">
                                Two-Factor Authentication
                            </div>
                            <div className="text-sm text-gray-500">
                                Enable 2FA for enhanced security
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.twoFactorEnabled}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    twoFactorEnabled: e.target.checked,
                                }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </label>
                </div>
            </div>
        </div>
    );

    // Role-based default permissions mapping
    const rolePermissions: Record<string, Record<string, string>> = {
        admin: {
            campaigns: "admin",
            investors: "admin",
            reports: "admin",
            users: "admin",
            settings: "admin",
        },
        manager: {
            campaigns: "write",
            investors: "write",
            reports: "read",
            users: "read",
            settings: "none",
        },
        user: {
            campaigns: "read",
            investors: "read",
            reports: "read",
            users: "none",
            settings: "none",
        },
        viewer: {
            campaigns: "read",
            investors: "read",
            reports: "read",
            users: "none",
            settings: "none",
        },
    };

    const renderPermissionsTab = () => (
        <div className="space-y-6">
            {/* Role Selection */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Role Assignment
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                        <label
                            key={role.value}
                            className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                            <input
                                type="radio"
                                name="role"
                                value={role.value}
                                checked={formData.role === role.value}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                                }
                                className="mt-1 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{role.label}</div>
                                <div className="text-sm text-gray-500">{role.description}</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Granular Permissions */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Permissions
                </h4>

                <div className="space-y-4">
                    {Object.entries(formData.permissions).map(([module, level]) => {
                        // If the selected role is a predefined one or no role is selected, use its default permissions and disable the dropdown
                        const isRoleDefault =
                            formData.role === "" ||
                            rolePermissions.hasOwnProperty(formData.role);
                        const defaultLevel =
                            isRoleDefault &&
                                formData.role !== "" &&
                                rolePermissions[formData.role][module]
                                ? rolePermissions[formData.role][module]
                                : level;
                        // If no role is selected, all dropdowns are disabled and show current value (do not update)
                        const dropdownDisabled = isRoleDefault;
                        const dropdownValue =
                            isRoleDefault && formData.role !== ""
                                ? defaultLevel
                                : formData.role === ""
                                    ? level
                                    : defaultLevel;
                        return (
                            <div
                                key={module}
                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                            >
                                <div>
                                    <div className="font-medium text-gray-900 capitalize">
                                        {module.replace(/([A-Z])/g, " $1")}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {module === "campaigns" &&
                                            "Create and manage outreach campaigns"}
                                        {module === "investors" &&
                                            "Access and manage investor database"}
                                        {module === "reports" &&
                                            "Generate and view analytics reports"}
                                        {module === "users" &&
                                            "Manage user accounts and permissions"}
                                        {module === "settings" && "Configure system settings"}
                                    </div>
                                </div>
                                <select
                                    value={dropdownValue}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            permissions: {
                                                ...prev.permissions,
                                                [module]: e.target.value,
                                            },
                                        }))
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={dropdownDisabled}
                                >
                                    {permissionLevels.map((perm) => (
                                        <option key={perm.value} value={perm.value}>
                                            {perm.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    })}
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
                                    {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) => str.toUpperCase())}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {key === "campaignUpdates" &&
                                        "Get notified about campaign performance and updates"}
                                    {key === "investorResponses" &&
                                        "Receive alerts when investors respond to outreach"}
                                    {key === "meetingReminders" &&
                                        "Reminders for upcoming investor meetings"}
                                    {key === "weeklyReports" && "Weekly summary of IR activities"}
                                    {key === "systemUpdates" &&
                                        "Product updates and new feature announcements"}
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        emailNotifications: {
                                            ...prev.emailNotifications,
                                            [key]: e.target.checked,
                                        },
                                    }))
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-blue-600" />
                    Push Notifications
                </h4>

                <div className="space-y-4">
                    {Object.entries(formData.pushNotifications).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900">
                                    {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) => str.toUpperCase())}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {key === "campaignUpdates" &&
                                        "Real-time campaign performance notifications"}
                                    {key === "investorResponses" &&
                                        "Instant alerts for investor responses"}
                                    {key === "meetingReminders" &&
                                        "Push reminders for upcoming meetings"}
                                    {key === "weeklyReports" &&
                                        "Weekly activity summary notifications"}
                                    {key === "systemUpdates" &&
                                        "App updates and maintenance notifications"}
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        pushNotifications: {
                                            ...prev.pushNotifications,
                                            [key]: e.target.checked,
                                        },
                                    }))
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return loading ? (
        <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                            {isEditMode ? (
                                <Edit3 className="w-5 h-5 text-white" />
                            ) : (
                                <UserPlus className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                {isEditMode ? "Edit User" : "Add New User"}
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {isEditMode
                                    ? "Update user profile and settings"
                                    : "Create a new user account"}
                            </p>
                        </div>
                    </div>
                    <button className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
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
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Icon
                                            className={`w-4 h-4 mr-3 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"
                                                }`}
                                        />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                        {activeTab === "profile" && renderProfileTab()}
                        {activeTab === "account" && renderAccountTab()}
                        {activeTab === "permissions" && renderPermissionsTab()}
                        {activeTab === "notifications" && renderNotificationsTab()}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-500">* Required fields</div>
                    <div className="flex space-x-3">
                        <Link
                            to={"/settings"}
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{isEditMode ? "Update User" : "Create User"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddUser;























































