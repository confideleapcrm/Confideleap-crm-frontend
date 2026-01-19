// src/components/InvestorImport.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Settings,
  Globe,
  Linkedin,
  Plus,
  ArrowRight,
  Database,
  Link as LinkIcon,
  Zap,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { importInvestors } from "../services/investorService";

const InvestorImport = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [importMethod, setImportMethod] = useState<"file" | "api" | "manual">(
    "file"
  );
  const [fileType, setFileType] = useState<"csv" | "excel" | "json">("csv");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<any>({});
  const [importResults, setImportResults] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, name: "Import Method", description: "Choose how to import data" },
    { id: 2, name: "Upload Data", description: "Upload or connect your data" },
    {
      id: 3,
      name: "Map Fields",
      description: "Map data fields to investor properties",
    },
    {
      id: 4,
      name: "Validate Data",
      description: "Review and validate imported data",
    },
    {
      id: 5,
      name: "Import Results",
      description: "View import results and summary",
    },
  ];

  const importMethods = [
    {
      id: "file",
      name: "File Upload",
      description: "Upload CSV, Excel, or JSON files",
      icon: FileText,
      formats: ["CSV", "Excel", "JSON"],
      maxSize: "10MB",
      features: ["Bulk import", "Field mapping", "Data validation"],
    },
    {
      id: "api",
      name: "API Integration",
      description: "Connect to external services",
      icon: LinkIcon,
      formats: ["CRM APIs", "LinkedIn", "AngelList"],
      maxSize: "Unlimited",
      features: ["Real-time sync", "Auto-updates", "Rich data"],
    },
    {
      id: "manual",
      name: "Manual Entry",
      description: "Add investors one by one",
      icon: Plus,
      formats: ["Form input"],
      maxSize: "N/A",
      features: ["Custom fields", "Rich profiles", "Immediate validation"],
    },
  ];

const availableFields = [
    { key: "firstName", label: "First Name", required: true, type: "text" },
    { key: "lastName", label: "Last Name", required: true, type: "text" },
    { key: "email", label: "Email", required: true, type: "email" },
    { key: "phone", label: "Phone", required: false, type: "phone" },
    { key: "jobTitle", label: "Job Title", required: true, type: "text" },
    { key: "seniorityLevel", label: "Seniority Level", required: false, type: "select" },
    { key: "firmName", label: "Firm Name", required: true, type: "text" },
    { key: "firmWebsite", label: "Firm Website", required: false, type: "url" },
    { key: "firmType", label: "Firm Type", required: false, type: "select" },
    { key: "location", label: "Location", required: false, type: "text" },
    { key: "linkedinUrl", label: "LinkedIn URL", required: false, type: "url" },
    { key: "twitterUrl", label: "Twitter URL", required: false, type: "url" },
    { key: "personalWebsite", label: "Website", required: false, type: "url" },
    { key: "bio", label: "Bio", required: false, type: "textarea" },
    { key: "education", label: "Education", required: false, type: "text" },
    { key: "experience", label: "Experience", required: false, type: "text" },
    {
      key: "investmentStages",
      label: "Investment Stages",
      required: false,
      type: "array",
    },
    {
      key: "sectorPreferences",
      label: "Sector Preferences",
      required: false,
      type: "array",
    },
    {
      key: "geographicPreferences",
      label: "Geographic Preferences",
      required: false,
      type: "array",
    },
    {
      key: "minCheckSize",
      label: "Min Check Size",
      required: false,
      type: "number",
    },
    {
      key: "maxCheckSize",
      label: "Max Check Size",
      required: false,
      type: "number",
    },
    {
      key: "portfolioCompanies",
      label: "Portfolio Companies",
      required: false,
      type: "array",
    },
    {
      key: "notableInvestments",
      label: "Notable Investments",
      required: false,
      type: "array",
    },
    { key: "tags", label: "Tags", required: false, type: "array" },
    { key: "notes", label: "Notes", required: false, type: "textarea" },
    { key: "buySellSide", label: "Buy Sell Side", required: false, type: "text" },
    { key: "aum", label: "Assets Under Management", required: false, type: "text" },
    { key: "status", label: "Status", required: false, type: "select" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    if (fileType === "json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonText = event.target?.result as string;
          const jsonData = JSON.parse(jsonText);
          const dataArr = Array.isArray(jsonData)
            ? jsonData
            : Array.isArray(jsonData.data)
            ? jsonData.data
            : [];
          setPreviewData(dataArr);
          // setCurrentStep(3);
          // executeImport();
        } catch (err) {
          setPreviewData([]);
          alert("Invalid JSON file format.");
        }
      };
      reader.readAsText(file);
    } else if (fileType === "csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target?.result as string;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setPreviewData(jsonData);
        // setCurrentStep(3);
        // executeImport();
      };
      reader.readAsBinaryString(file);
    } else {
      // Excel
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setPreviewData(jsonData);
        // setCurrentStep(3);
        // executeImport();
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Call executeImport when both uploadedFile and previewData are set
  useEffect(() => {
    if (uploadedFile && previewData && previewData.length > 0) {
      executeImport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile, previewData]);

  const handleFieldMapping = (sourceField: string, targetField: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [sourceField]: targetField,
    }));
  };

  const validateData = () => {
    setIsProcessing(true);

    // Real frontend validation
    // Build mapping: targetKey -> sourceField
    const targetToSource: Record<string, string> = {};
    Object.entries(fieldMapping).forEach(([source, target]) => {
      if (target) targetToSource[target] = source;
    });

    const errors: { row: number; field: string; message: string }[] = [];
    const warnings: { row: number; field: string; message: string }[] = [];

    // Regexes for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    const phoneRegex = /^\+?[\d\s().-]{7,}$/;
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    const numberRegex = /^-?\d+(\.\d+)?$/;

    // Number sensible bounds for check sizes
    const minCheckMin = 100; // $100
    const minCheckMax = 1_000_000_000; // $1B
    const maxCheckMin = 1_000; // $1k
    const maxCheckMax = 10_000_000_000; // $10B

    previewData.forEach((row, idx) => {
      // For each available field that is mapped
      availableFields.forEach((field) => {
        const sourceField = targetToSource[field.key];
        if (!sourceField) return;
        const value = row[sourceField];
        // Required validation
        if (field.required) {
          if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.trim() === "")
          ) {
            errors.push({
              row: idx + 1,
              field: field.label,
              message: "Required field is missing",
            });
            return;
          }
        }
        // Email validation
        if (field.type === "email" && value) {
          if (!emailRegex.test(String(value).trim())) {
            errors.push({
              row: idx + 1,
              field: field.label,
              message: "Invalid email format",
            });
          }
        }
        // Phone validation
        if (field.type === "phone" && value) {
          if (!phoneRegex.test(String(value).trim())) {
            warnings.push({
              row: idx + 1,
              field: field.label,
              message: "Phone number format could be improved",
            });
          }
        }
        // URL validation
        if (field.type === "url" && value) {
          if (!urlRegex.test(String(value).trim())) {
            warnings.push({
              row: idx + 1,
              field: field.label,
              message: "URL format does not look valid",
            });
          }
        }
        // Number validation
        if (
          field.type === "number" &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          if (!numberRegex.test(String(value).replace(/,/g, ""))) {
            errors.push({
              row: idx + 1,
              field: field.label,
              message: "Value must be a number",
            });
          } else {
            const num = Number(String(value).replace(/,/g, ""));
            // Sensible bounds for check sizes
            if (field.key === "minCheckSize") {
              if (num < minCheckMin) {
                warnings.push({
                  row: idx + 1,
                  field: field.label,
                  message: "Check size seems unusually low",
                });
              }
              if (num > minCheckMax) {
                warnings.push({
                  row: idx + 1,
                  field: field.label,
                  message: "Check size seems unusually high",
                });
              }
            }
            if (field.key === "maxCheckSize") {
              if (num < maxCheckMin) {
                warnings.push({
                  row: idx + 1,
                  field: field.label,
                  message: "Check size seems unusually low",
                });
              }
              if (num > maxCheckMax) {
                warnings.push({
                  row: idx + 1,
                  field: field.label,
                  message: "Check size seems unusually high",
                });
              }
            }
          }
        }
      });
    });

    // Count valid/invalid
    const errorRows = new Set(errors.map((e) => e.row));
    const total = previewData.length;
    const invalid = errorRows.size;
    const valid = total - invalid;

    const results = {
      total,
      valid,
      invalid,
      errors,
      warnings,
    };

    setValidationResults(results);
    setIsProcessing(false);
    setCurrentStep(4);
  };

  const executeImport = async () => {
    try {
      setIsProcessing(true);
      if (!uploadedFile) {
        throw new Error("No file uploaded");
      }
      const start = performance.now();
      const response = await importInvestors(uploadedFile);
      const end = performance.now();
      const elapsed = `${((end - start) / 1000).toFixed(2)} seconds`;
      const results = {
        total: response.total,
        imported: response.imported,
        skipped: response.skipped,
        duplicates: response.duplicates,
        errors: response.errors,
        newInvestors: response.newInvestors.length,
        updatedInvestors: response.updatedInvestors.length,
        newFirms: response.newFirms.length,
        processingTime: elapsed,
      };
      setImportResults(results);
      setCurrentStep(5);
    } catch (error: any) {
      console.error("Import failed:", error);
      setImportResults({
        total: previewData.length,
        imported: 0,
        skipped: previewData.length,
        duplicates: 0,
        errors: [{ index: -1, error: error.message || "API error" }],
        newInvestors: 0,
        updatedInvestors: 0,
        newFirms: 0,
        processingTime: "0s",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep > step.id
                  ? "bg-green-500 border-green-500 text-white"
                  : currentStep === step.id
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step.id ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.name}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-gray-300 mx-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderImportMethodStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Import Method
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Select how you'd like to import your investor data. Each method has
          different capabilities and requirements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {importMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                onClick={() => setImportMethod(method.id as any)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  importMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      importMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        importMethod === method.id
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Supported Formats
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {method.formats.map((format) => (
                        <span
                          key={format}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Max Size: {method.maxSize}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Features
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {method.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      {importMethod === "file" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Data File
          </h3>

          {!uploadedFile ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Format
                </label>
                <div className="flex space-x-4">
                  {["csv", "excel", "json"].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="fileType"
                        value={type}
                        checked={fileType === type}
                        onChange={(e) => setFileType(e.target.value as any)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 cursor-pointer transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Upload your investor data
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: CSV, Excel (.xlsx), JSON • Max size: 10MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileText className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Download Sample Template
                  </span>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Not sure about the format? Download our sample template to get
                  started.
                </p>
                <a
                  href="/templates/investor_import_template.csv"
                  download="investor_import_template.csv"
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-3 h-3 mr-1 inline" />
                  Download Template
                </a>
              </div>
            </div>
          ) : (
            <div>
              {isProcessing ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Processing File
                  </h4>
                  <p className="text-sm text-gray-600">
                    Analyzing your data and preparing preview...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-green-700">
                          {(uploadedFile.size / 1024).toFixed(1)} KB •{" "}
                          {previewData.length} records found
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setPreviewData([]);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* <div className="flex justify-end">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue to Field Mapping
                    </button>
                  </div> */}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {importMethod === "api" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            API Integration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Linkedin className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    LinkedIn Sales Navigator
                  </h4>
                  <p className="text-sm text-gray-500">
                    Import investor profiles from LinkedIn
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Connect LinkedIn
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Database className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">CRM Integration</h4>
                  <p className="text-sm text-gray-500">
                    Sync with Salesforce, HubSpot, etc.
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Connect CRM
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Globe className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">AngelList API</h4>
                  <p className="text-sm text-gray-500">
                    Import from AngelList database
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Connect AngelList
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Zap className="w-6 h-6 text-orange-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Custom API</h4>
                  <p className="text-sm text-gray-500">
                    Connect your own data source
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Configure API
              </button>
            </div>
          </div>
        </div>
      )}

      {importMethod === "manual" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Manual Entry
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Add investors one by one using our comprehensive form. This method
            gives you the most control over data quality.
          </p>

          <div className="flex justify-center">
            <Link
              to={"/add-investor"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Investor</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const renderFieldMappingStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Map Data Fields
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Map the columns from your data file to the corresponding investor
          fields in our system.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source Fields */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Your Data Fields</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.keys(previewData[0] || {}).map((field) => (
                <div
                  key={field}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{field}</span>
                  <select
                    value={fieldMapping[field] || ""}
                    onChange={(e) => handleFieldMapping(field, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select field...</option>
                    {availableFields.map((targetField) => (
                      <option key={targetField.key} value={targetField.key}>
                        {targetField.label} {targetField.required && "*"}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Target Fields */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Investor Fields</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableFields.map((field) => {
                const mappedSource = Object.keys(fieldMapping).find(
                  (key) => fieldMapping[key] === field.key
                );
                return (
                  <div
                    key={field.key}
                    className={`p-3 rounded-lg border ${
                      mappedSource
                        ? "bg-green-50 border-green-200"
                        : field.required
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </span>
                        <p className="text-xs text-gray-500">{field.type}</p>
                      </div>
                      {mappedSource && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">{mappedSource}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">
              Mapping Status
            </span>
          </div>
          <div className="text-sm text-yellow-700">
            <p>
              Required fields mapped:{" "}
              {
                availableFields.filter(
                  (f) =>
                    f.required && Object.values(fieldMapping).includes(f.key)
                ).length
              }{" "}
              / {availableFields.filter((f) => f.required).length}
            </p>
            <p>
              Total fields mapped: {Object.keys(fieldMapping).length} /{" "}
              {Object.keys(previewData[0] || {}).length}
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={validateData}
            disabled={availableFields
              .filter((f) => f.required)
              .some((f) => !Object.values(fieldMapping).includes(f.key))}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Validate Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderValidationStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Data Validation
        </h3>

        {isProcessing ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Validating Data
            </h4>
            <p className="text-sm text-gray-600">
              Checking data quality and identifying potential issues...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Validation Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {validationResults.total}
                </p>
                <p className="text-sm text-blue-700">Total Records</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {validationResults.valid}
                </p>
                <p className="text-sm text-green-700">Valid Records</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {validationResults.warnings?.length || 0}
                </p>
                <p className="text-sm text-yellow-700">Warnings</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">
                  {validationResults.invalid}
                </p>
                <p className="text-sm text-red-700">Errors</p>
              </div>
            </div>

            {/* Issues List */}
            {(validationResults.errors?.length > 0 ||
              validationResults.warnings?.length > 0) && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Issues Found</h4>

                {validationResults.errors?.map((error: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-red-800">
                        Error in Row {error.row}
                      </span>
                    </div>
                    <p className="text-sm text-red-700">
                      <strong>{error.field}:</strong> {error.message}
                    </p>
                  </div>
                ))}

                {validationResults.warnings?.map(
                  (warning: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-center mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-yellow-800">
                          Warning in Row {warning.row}
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        <strong>{warning.field}:</strong> {warning.message}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Data Preview */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Data Preview</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        <input
                          type="checkbox"
                          checked={selectedRows.length === previewData.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(
                                previewData.map((_, index) => index)
                              );
                            } else {
                              setSelectedRows([]);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      {Object.keys(previewData[0] || {})
                        .slice(0, 5)
                        .map((key) => (
                          <th
                            key={key}
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {key}
                          </th>
                        ))}
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(index)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRows([...selectedRows, index]);
                              } else {
                                setSelectedRows(
                                  selectedRows.filter((i) => i !== index)
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        {Object.values(row)
                          .slice(0, 5)
                          .map((value: any, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 text-sm text-gray-900"
                            >
                              {String(value).substring(0, 30)}
                              {String(value).length > 30 && "..."}
                            </td>
                          ))}
                        <td className="px-4 py-2">
                          {index === 1 ? (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Error
                            </span>
                          ) : index === 0 || index === 2 ? (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Warning
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Mapping
              </button>
              <div className="space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Skip Errors
                </button>
                <button
                  onClick={executeImport}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Import Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Import Completed!
          </h3>
          <p className="text-sm text-gray-600">
            Your investor data has been successfully imported into the system.
          </p>
        </div>

        {/* Import Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {importResults?.imported}
            </p>
            <p className="text-sm text-green-700">Successfully Imported</p>
          </div>
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {importResults?.newFirms}
            </p>
            <p className="text-sm text-blue-700">New Firms Added</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {importResults?.skipped}
            </p>
            <p className="text-sm text-yellow-700">Records Skipped</p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Import Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Total Records Processed:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {importResults?.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  New Investors Created:
                </span>
                <span className="text-sm font-medium text-green-600">
                  {importResults?.newInvestors}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Existing Investors Updated:
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {importResults?.updatedInvestors}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Duplicate Records Found:
                </span>
                <span className="text-sm font-medium text-yellow-600">
                  {importResults?.duplicates}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Processing Time:</span>
                <span className="text-sm font-medium text-gray-900">
                  {importResults?.processingTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  New Investment Firms:
                </span>
                <span className="text-sm font-medium text-purple-600">
                  {importResults?.newFirms}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Validation Errors:
                </span>
                <span className="text-sm font-medium text-red-600">
                  {importResults.errors.map((e: any, i: number) => (
                    <span key={i}>{e.error}</span>
                  ))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate:</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round(
                    (importResults?.imported / importResults?.total) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Review and verify the imported investor profiles</li>
            <li>• Set up portfolio fit scoring for new investors</li>
            <li>• Create targeted campaigns for your new investor database</li>
            <li>• Configure automated follow-up sequences</li>
          </ul>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            View Import Log
          </button>
          <Link
            to={"/investor-database"}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Investor Database
          </Link>
          <button
            onClick={() => {
              setCurrentStep(1);
              setUploadedFile(null);
              setPreviewData([]);
              setFieldMapping({});
              setValidationResults({});
              setImportResults(null);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Import More Data
          </button>
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
              <h1 className="text-2xl font-bold text-gray-900">
                Import Investor Database
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Import investor data from files, APIs, or manual entry
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Import History</span>
              </button>

              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Import Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {renderStepIndicator()}

        {currentStep === 1 && renderImportMethodStep()}
        {currentStep === 2 && renderUploadStep()}
        {/* Field mapping and validation steps are now bypassed */}
        {/* {currentStep === 3 && renderFieldMappingStep()} */}
        {/* {currentStep === 4 && renderValidationStep()} */}
        {currentStep === 5 && renderResultsStep()}
      </div>
    </div>
  );
};

export default InvestorImport;
