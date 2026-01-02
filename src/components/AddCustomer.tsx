// src/components/AddCustomer.tsx
import React, { useState, useEffect } from "react";
import { X, Save, User, Plus, AlertCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addCustomer, getCustomerById, updateCustomer } from "../services/customerService";

const AddCustomer: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    company: {
      name: "",
      address: "",
      website: "",
      gstNumber: "",
      panNumber: "",
      contactNumber: "",
      linkedin: "",
      socialMedia: "", // CSV or free-form
      domain: "",
      industry: "",
      status: "active",
    },
    companyEmployees: [] as Array<{
      firstName: string;
      lastName: string;
      email: string;
      designation: string;
      phone: string;
      linkedin: string;
    }>,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      getCustomerById(id)
        .then((data) => {
          setFormData((prev: any) => ({
            ...prev,
            company: {
              ...prev.company,
              name: data.companyDetails?.name ?? data.company ?? prev.company.name,
              address: data.companyDetails?.company_register_address ?? data.company_register_address ?? prev.company.address,
              website: data.companyDetails?.website ?? data.company_website ?? prev.company.website,
              gstNumber: data.companyDetails?.gst_number ?? data.gst_number ?? prev.company.gstNumber,
              panNumber: data.companyDetails?.pan_number ?? data.pan_number ?? prev.company.panNumber,
              contactNumber: data.companyDetails?.contact_number ?? data.contact_number ?? prev.company.contactNumber,
              linkedin: data.companyDetails?.linkedin ?? prev.company.linkedin,
              socialMedia: data.companyDetails?.social_media ?? prev.company.socialMedia,
              domain: data.companyDetails?.domain ?? prev.company.domain,
              industry: data.companyDetails?.industry ?? prev.company.industry,
              status: data.companyDetails?.status ?? data.status ?? prev.company.status,
            },
            companyEmployees: data.companyEmployees ?? data.company_employees ?? [],
          }));
        })
        .catch((error) => {
          console.error("Error loading company:", error);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const statusOptions = ["active", "inactive", "pending"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company?.name || !formData.company.name.trim()) newErrors.companyName = "Company name is required";
    if (formData.company?.website && !/^https?:\/\//.test(formData.company.website)) {
      newErrors.companyWebsite = "Website should start with http:// or https://";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload: any = {
        // company object (backend should upsert companies table)
        company: {
          name: formData.company.name,
          company_register_address: formData.company.address,
          website: formData.company.website,
          gst_number: formData.company.gstNumber,
          pan_number: formData.company.panNumber,
          contact_number: formData.company.contactNumber,
          linkedin: formData.company.linkedin,
          social_media: formData.company.socialMedia,
          domain: formData.company.domain,
          industry: formData.company.industry,
          status: formData.company.status,
        },
        companyEmployees: formData.companyEmployees.map((emp: any) => ({
          first_name: emp.firstName,
          last_name: emp.lastName,
          email: emp.email,
          designation: emp.designation,
          phone: emp.phone,
          linkedin: emp.linkedin,
        })),
      };

      if (isEditMode && id) {
        await updateCustomer(id, payload);
      } else {
        await addCustomer(payload);
      }

      navigate("/customer-database", { replace: true });
    } catch (error) {
      console.error("Error saving company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEmployee = () => {
    setFormData((prev: any) => ({
      ...prev,
      companyEmployees: [
        ...prev.companyEmployees,
        { firstName: "", lastName: "", email: "", designation: "", phone: "", linkedin: "" },
      ],
    }));
  };

  const updateEmployee = (index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const cloned = [...prev.companyEmployees];
      cloned[index] = { ...cloned[index], [field]: value };
      return { ...prev, companyEmployees: cloned };
    });
  };

  const removeEmployee = (index: number) => {
    setFormData((prev: any) => {
      const cloned = prev.companyEmployees.filter((_: any, i: number) => i !== index);
      return { ...prev, companyEmployees: cloned };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{isEditMode ? "Edit Company" : "Add New Company"}</h2>
              <p className="text-blue-100 text-sm">{isEditMode ? "Update company details" : "Create a new company profile"}</p>
            </div>
          </div>
          <button onClick={() => navigate("/customer-database")} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 21V7a1 1 0 011-1h3l2-2h6l2 2h3a1 1 0 011 1v14"/></svg>
                  Company Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium">Company Name *</label>
                    <input
                      type="text"
                      value={formData.company.name}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, name: e.target.value } }))}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.companyName ? "border-red-300" : "border-gray-300"}`}
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Company Website</label>
                    <input
                      type="url"
                      value={formData.company.website}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, website: e.target.value } }))}
                      className={`w-full px-3 py-2 border rounded-lg ${errors.companyWebsite ? "border-red-300" : "border-gray-300"}`}
                    />
                    {errors.companyWebsite && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.companyWebsite}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Company Address</label>
                    <input
                      type="text"
                      value={formData.company.address}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, address: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Company Contact Number</label>
                    <input
                      type="tel"
                      value={formData.company.contactNumber}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, contactNumber: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">GST Number</label>
                    <input
                      type="text"
                      value={formData.company.gstNumber}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, gstNumber: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">PAN Number</label>
                    <input
                      type="text"
                      value={formData.company.panNumber}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, panNumber: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.company.linkedin}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, linkedin: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Social Media (comma separated)</label>
                    <input
                      type="text"
                      value={formData.company.socialMedia}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, socialMedia: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Domain</label>
                    <input
                      type="text"
                      value={formData.company.domain}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, domain: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Industry</label>
                    <input
                      type="text"
                      value={formData.company.industry}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, industry: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      value={formData.company.status}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, status: e.target.value } }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Company Employees */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a3 3 0 11-6 0 3 3 0 016 0zM17 8a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span className="ml-2">Company Employees</span>
                  </h3>
                  <button type="button" onClick={addEmployee} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>Add Employee</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.companyEmployees.map((emp: any, idx: number) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="First name" value={emp.firstName} onChange={(e) => updateEmployee(idx, "firstName", e.target.value)} className="px-3 py-2 border rounded-lg" />
                        <input type="text" placeholder="Last name" value={emp.lastName} onChange={(e) => updateEmployee(idx, "lastName", e.target.value)} className="px-3 py-2 border rounded-lg" />
                        <input type="email" placeholder="Email" value={emp.email} onChange={(e) => updateEmployee(idx, "email", e.target.value)} className="px-3 py-2 border rounded-lg" />
                        <input type="text" placeholder="Designation" value={emp.designation} onChange={(e) => updateEmployee(idx, "designation", e.target.value)} className="px-3 py-2 border rounded-lg" />
                        <input type="tel" placeholder="Phone" value={emp.phone} onChange={(e) => updateEmployee(idx, "phone", e.target.value)} className="px-3 py-2 border rounded-lg" />
                        <input type="url" placeholder="LinkedIn" value={emp.linkedin} onChange={(e) => updateEmployee(idx, "linkedin", e.target.value)} className="px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="mt-3 text-right">
                        <button type="button" onClick={() => removeEmployee(idx)} className="px-3 py-1 text-red-600 hover:text-red-800">Remove</button>
                      </div>
                    </div>
                  ))}
                  {formData.companyEmployees.length === 0 && <p className="text-sm text-gray-500">No employees added</p>}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">* Required fields</div>
          <div className="flex space-x-3">
            <Link to={"/customer-database"} type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</Link>
            <button onClick={handleSubmit} disabled={isSubmitting || loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditMode ? "Updating..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? "Update Company" : "Save Company"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;




