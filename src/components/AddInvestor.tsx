// src/components/AddInvestor.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Target,
  Star,
  Plus,
  Link as LinkIcon,
  Globe,
  Linkedin,
  Twitter,
  FileText,
  AlertCircle,
} from "lucide-react";
import AsyncSelect from "react-select/async";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addInvestor,
  getInvestorById,
  updateInvestor,
} from "../services/investorService";
import { fetchFirmEmployees, fetchFirmOptions } from "../services/firmService";
import FirmEmployeesForm from "./FirmEmployeesForm";

const AddInvestor: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [firmNames, setFirmNames] = useState([
    "Andreessen Horowitz",
    "Sequoia Capital",
    "Accel",
  ]);
  const emptyEmployeeData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    seniorityLevel: "",
    employeeStatus: "",
    comment: "",
  };

  const [employees, setEmployees] = useState([]);
  const [showAddFirm, setShowAddFirm] = useState(false);
  const [newFirmName, setNewFirmName] = useState("");
  const [employeeData, setEmployeeData] = useState(emptyEmployeeData);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedFirm, setSelectedFirm] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [prevFirmId, setPrevFirmId] = useState("");

  const [formData, setFormData] = useState({
    // Personal Information
    // firstName: "",
    // lastName: "",
    // email: "",
    // phone: "",
    // jobTitle: "",
    // seniorityLevel: "Associate",
    // bio: "",
    // avatarUrl: "",

    // Firm Information
    firmId: "", // ✅ Add this
    firmName: "",
    firmType: "PMS - Portfolio Management System",
    firmWebsite: "",
    buySellSide: "",
    aum: "10-50 cr",

    // Employee Information
    // ✅ Employee mapping (JOIN TABLE)
    // employeeIds: [] as string[],

    // Location
    location: "",

    // Investment Preferences
    investmentStages: [] as string[],
    sectorPreferences: [] as string[],
    geographicPreferences: [] as string[],
    minCheckSize: 0,
    maxCheckSize: 0,

    // Social & Professional Links
    linkedinUrl: "",
    twitterUrl: "",
    personalWebsite: "",

    // Portfolio & Experience
    portfolioCompanies: [] as string[],
    notableInvestments: [] as string[],
    education: [] as any[],
    experience: [] as any[],

    // CRM Fields
    status: "cold",
    tags: [] as string[],
    notes: "",
    portfolioFitScore: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [currentPortfolioCompany, setCurrentPortfolioCompany] = useState("");
  const [currentInvestment, setCurrentInvestment] = useState("");

  const mapEmployee = (emp: any) => ({
    id: emp.id,
    firstName: emp.first_name,
    lastName: emp.last_name,
    email: emp.email,
    phone: emp.phone || "",
    jobTitle: emp.job_title,
    seniorityLevel: emp.seniority_level,
    employeeStatus: emp.employee_status,
    comment: emp.comment,
  });

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);

      getInvestorById(id)
        .then((data) => {
          // Populate form data
          setFormData((prev) => ({
            ...prev,
            ...data,

            // ✅ Ensure arrays are proper arrays
            investmentStages: Array.isArray(data.investmentStages)
              ? data.investmentStages
              : [],
            sectorPreferences: Array.isArray(data.sectorPreferences)
              ? data.sectorPreferences
              : [],
            geographicPreferences: Array.isArray(data.geographicPreferences)
              ? data.geographicPreferences
              : [],
            education: Array.isArray(data.education) ? data.education : [],
            experience: Array.isArray(data.experience) ? data.experience : [],
            tags: Array.isArray(data.tags) ? data.tags : [],
            portfolioCompanies: Array.isArray(data.portfolioCompanies)
              ? data.portfolioCompanies
              : [],
            notableInvestments: Array.isArray(data.notableInvestments)
              ? data.notableInvestments
              : [],

            firmId: data.firm?.id || "",
            firmName: data.firm?.name || "",
            firmType: data.firm?.type || "",
            firmWebsite: data.firm?.website || "",
          }));

          // Set selected firm for AsyncSelect
          if (data.firm) {
            setSelectedFirm({ value: data.firm.id, label: data.firm.name });
            setPrevFirmId(data.firm.id);
          }

          // Set employees for this firm
          if (data.firm?.id) {
            fetchFirmEmployees(data.firm.id)
              .then((emps) => setEmployees(emps.map(mapEmployee)))
              .catch((err) => console.error("Error fetching employees:", err));
          }
        })
        .catch((error) => {
          console.error("Error loading investor:", error);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (formData.firmId) {
      fetchFirmEmployees(formData.firmId)
        .then((emps) => setEmployees(emps.map(mapEmployee)))
        .catch((err) => console.error(err));
    }
  }, [formData.firmId]);

  const handleSaveFirm = () => {
    const firm = newFirmName.trim();
    if (!firm) return;

    const exists = firmNames.some(
      (f) => f.toLowerCase() === firm.toLowerCase(),
    );

    if (!exists) {
      setFirmNames((prev) => [...prev, firm]);
    }

    setFormData((prev) => ({ ...prev, firmName: firm }));
    setNewFirmName("");
    setShowAddFirm(false);
  };

  // const firmNames = [
  //   "Andreessen Horowitz",
  //   "Sequoia Capital",
  //   "Accel",
  //   "Tiger Global",
  //   "SoftBank",
  //   "Lightspeed Venture Partners",
  // ];

  const investmentStageOptions = [
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C",
    "Series D+",
    "Growth",
    "Late Stage",
    "IPO",
  ];

  const sectorOptions = [
    "FinTech",
    "HealthTech",
    "EdTech",
    "SaaS",
    "E-commerce",
    "AI/ML",
    "Biotech",
    "CleanTech",
    "Consumer",
    "Enterprise",
    "Gaming",
    "Media",
    "Real Estate",
    "Transportation",
    "Food & Beverage",
  ];

  const geographicOptions = [
    "North America",
    "United States",
    "Canada",
    "Europe",
    "United Kingdom",
    "Germany",
    "France",
    "Asia Pacific",
    "China",
    "India",
    "Japan",
    "Southeast Asia",
    "Latin America",
    "Middle East",
    "Africa",
  ];

  const seniorityLevels = [
    "Analyst",
    "Associate",
    "Principal",
    "Vice President",
    "Partner",
    "Managing Partner",
    "General Partner",
  ];

  const firmTypes = [
    "PMS - Portfolio Management System",
    "AIF - Alternate Investment Fund",
    "HNI - High Net Worth Individual",
    "MF - Mutual Fund",
    "II - Institutional Investor",
    "FII - Foreign Institutional Investors",
    "SIF - Specialized Investment Fund",
    "IC - Insurance Company",
    "PE - Private Equity",
    "FO - Family Office",
    "BF - Brokerage Firm",
  ];

  const statusOptions = [
    { value: "hot", label: "Hot", color: "bg-red-100 text-red-800" },
    { value: "warm", label: "Warm", color: "bg-yellow-100 text-yellow-800" },
    { value: "cold", label: "Cold", color: "bg-blue-100 text-blue-800" },
    {
      value: "contacted",
      label: "Contacted",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "unresponsive",
      label: "Unresponsive",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // if (!formData.firstName.trim())
    //   newErrors.firstName = "First name is required";
    // if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    // if (!formData.email.trim()) newErrors.email = "Email is required";
    // else if (!/\S+@\S+\.\S+/.test(formData.email))
    //   newErrors.email = "Email is invalid";
    // if (!formData.firmName.trim()) newErrors.firmName = "Firm name is required";
    // if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";

    if (formData.minCheckSize && formData.maxCheckSize) {
      const min = parseFloat(formData.minCheckSize.toString());
      const max = parseFloat(formData.maxCheckSize.toString());
      if (min >= max)
        newErrors.maxCheckSize =
          "Max check size must be greater than min check size";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const firmOptions = firmNames.map((firm) => ({
    value: firm,
    label: firm,
  }));

  const loadFirmOptions = async (inputValue: string | undefined) => {
    const data = await fetchFirmOptions(inputValue);

    return data.firms.map((firm: { id: any; name: any }) => ({
      value: firm.id,
      label: firm.name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("function triggered");

    // if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isEditMode && id) {
        const updateInvestorData = {
          ...formData,

          // 🔒 CRITICAL: normalize buySellSide
          buySellSide:
            formData.buySellSide && formData.buySellSide.trim() !== ""
              ? formData.buySellSide
              : null,

          updatedAt: new Date().toISOString(),
        } as any;
        delete updateInvestorData.id;
        await updateInvestor(id, updateInvestorData);
      } else {
        const investorData = {
          ...formData,
          createdAt: new Date().toISOString(),
        };
        await addInvestor(investorData);
      }
      navigate("/investor-database", { replace: true });
    } catch (error) {
      console.error("Error saving investor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrayToggle = (array: string[], value: string, field: string) => {
    const newArray = array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];

    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addPortfolioCompany = () => {
    if (
      currentPortfolioCompany.trim() &&
      !formData.portfolioCompanies.includes(currentPortfolioCompany.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        portfolioCompanies: [
          ...prev.portfolioCompanies,
          currentPortfolioCompany.trim(),
        ],
      }));
      setCurrentPortfolioCompany("");
    }
  };

  const addNotableInvestment = () => {
    if (
      currentInvestment.trim() &&
      !formData.notableInvestments.includes(currentInvestment.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        notableInvestments: [
          ...prev.notableInvestments,
          currentInvestment.trim(),
        ],
      }));
      setCurrentInvestment("");
    }
  };

  return (
    <div className=" bg-gray-100">
      <div className="bg-white rounded-xl w-full mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isEditMode ? "Edit Investor" : "Add New Investor"}
              </h2>
              <p className="text-blue-100 text-sm">
                {isEditMode
                  ? "Update investor profile"
                  : "Create a new investor profile"}
              </p>
            </div>
          </div>
          {/* <-- Added onClick so header X cancels and returns to investor list */}
          <button
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            onClick={() => navigate("/investor-database", { replace: true })}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Firm Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Firm Information
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowAddFirm(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Add Firm
                  </button>
                </div>

                {/* Add Firm Form */}
                {showAddFirm && (
                  <div className="mb-6 p-4 border rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firm Name
                    </label>

                    <input
                      type="text"
                      value={newFirmName}
                      onChange={(e) => setNewFirmName(e.target.value)}
                      placeholder="Enter firm name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleSaveFirm}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAddFirm(false);
                          setNewFirmName("");
                        }}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firm Name *
                    </label>

                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadFirmOptions}
                      placeholder="Search firm..."
                      value={
                        formData.firmId && formData.firmName
                          ? { value: formData.firmId, label: formData.firmName }
                          : null
                      }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          firmId: selected ? selected.value : "",
                          firmName: selected ? selected.label : "",
                        }))
                      }
                      classNamePrefix="react-select"
                    />

                    {errors?.firmId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.firmId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firm Type
                    </label>
                    <select
                      value={formData.firmType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firmType: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {firmTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firm Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="url"
                        value={formData.firmWebsite}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            firmWebsite: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://firm.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buy Sell Side
                    </label>
                    <input
                      type="text"
                      value={formData.buySellSide}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buySellSide: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Buy Side, Sell Side"
                    />
                  </div>

                  {/* Assets Under Management Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assets Under Management
                    </label>
                    <select
                      value={formData.aum}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          aum: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select range</option>
                      <option value="10-50 cr">10-50 cr</option>
                      <option value="50-100 cr">50-100 cr</option>
                      <option value="100-200 cr">100-200 cr</option>
                      <option value="200-300 cr">200-300 cr</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>

                <div>
                  <FirmEmployeesForm
                    employees={employees}
                    setEmployees={setEmployees}
                    employeeData={employeeData}
                    setEmployeeData={setEmployeeData}
                    editingIndex={editingIndex}
                    setEditingIndex={setEditingIndex}
                    firmId={formData.firmId}
                    firmName={formData.firmName}
                  />
                </div>
              </div>

              {/* Investment Preferences */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Investment Preferences
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Investment Stages
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {investmentStageOptions.map((stage) => (
                        <button
                          key={stage}
                          type="button"
                          onClick={() =>
                            handleArrayToggle(
                              formData.investmentStages,
                              stage,
                              "investmentStages",
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            formData.investmentStages.includes(stage)
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
                      {sectorOptions.map((sector) => (
                        <button
                          key={sector}
                          type="button"
                          onClick={() =>
                            handleArrayToggle(
                              formData.sectorPreferences,
                              sector,
                              "sectorPreferences",
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            formData.sectorPreferences.includes(sector)
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
                      {geographicOptions.map((region) => (
                        <button
                          key={region}
                          type="button"
                          onClick={() =>
                            handleArrayToggle(
                              formData.geographicPreferences,
                              region,
                              "geographicPreferences",
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            formData.geographicPreferences.includes(region)
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Check Size ($M)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          step="0.1"
                          value={formData.minCheckSize}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              minCheckSize: Number(e.target.value),
                            }))
                          }
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="1.0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Check Size ($M)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          step="0.1"
                          value={formData.maxCheckSize}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              maxCheckSize: Number(e.target.value),
                            }))
                          }
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.maxCheckSize
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="25.0"
                        />
                      </div>
                      {errors.maxCheckSize && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.maxCheckSize}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social & Professional Links */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Social & Professional Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            linkedinUrl: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Profile
                    </label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="url"
                        value={formData.twitterUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            twitterUrl: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="url"
                        value={formData.personalWebsite}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            personalWebsite: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://personalsite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio & Experience */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Portfolio & Experience
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Companies
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentPortfolioCompany}
                        onChange={(e) =>
                          setCurrentPortfolioCompany(e.target.value)
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addPortfolioCompany())
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add portfolio company"
                      />
                      <button
                        type="button"
                        onClick={addPortfolioCompany}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.portfolioCompanies.map((company, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {company}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                portfolioCompanies:
                                  prev.portfolioCompanies.filter(
                                    (_, i) => i !== index,
                                  ),
                              }))
                            }
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notable Investments
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentInvestment}
                        onChange={(e) => setCurrentInvestment(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addNotableInvestment())
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add notable investment"
                      />
                      <button
                        type="button"
                        onClick={addNotableInvestment}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.notableInvestments.map((investment, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          {investment}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                notableInvestments:
                                  prev.notableInvestments.filter(
                                    (_, i) => i !== index,
                                  ),
                              }))
                            }
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CRM Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-600" />
                  CRM Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              status: status.value,
                            }))
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            formData.status === status.value
                              ? status.color
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
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
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add tag"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add any additional notes about this investor..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-500">* Required fields</div>
                <div className="flex space-x-3">
                  <Link
                    to={"/investor-database"}
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    // onClick={handleSubmit}
                    disabled={isSubmitting || loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isEditMode ? "Updating..." : "Saving..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>
                          {isEditMode ? "Update Investor" : "Save Investor"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {/* <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">* Required fields</div>
          <div className="flex space-x-3">
            <Link
              to={"/investor-database"}
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              // onClick={handleSubmit}
              disabled={isSubmitting || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditMode ? "Updating..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>
                    {isEditMode ? "Update Investor" : "Save Investor"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AddInvestor;
