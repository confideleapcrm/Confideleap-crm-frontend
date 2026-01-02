// src/components/AddCompany.tsx
import React, { useState, useEffect } from "react";
import { X, Save, User, Plus, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCompany,
  getCompanyById,
  updateCompany,
  addCompanyEmployee,
  insertCompanyEmployees,
  upsertCompanyServices,
  deleteCompanyEmployee, // <-- added import for deletion
} from "../services/companyService";

type ServiceKey = "investor" | "public" | "annual" | "smm";

const SERVICE_DEFINITIONS: { key: ServiceKey; label: string }[] = [
  { key: "investor", label: "Investor Relation Entry" },
  { key: "public", label: "Public Relation Entry" },
  { key: "annual", label: "Annual Report" },
  { key: "smm", label: "Social Media Marketing" },
];

const AddCompany: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [company, setCompany] = useState<any>({
    name: "",
    company_register_address: "",
    website: "",
    gst_number: "",
    pan_number: "",
    contact_number: "",
    linkedin: "",
    social_media: "",
    domain: "",
    industry: "",
    status: "Active",
  });

  const [employees, setEmployees] = useState<any[]>([
    { firstName: "", lastName: "", email: "", designation: "", phone: "", linkedin: "" },
  ]);

  const [customerServicesState, setCustomerServicesState] = useState<Record<string, { selected: boolean; price: string }>>(() => {
    const obj: any = {};
    SERVICE_DEFINITIONS.forEach(s => (obj[s.key] = { selected: false, price: "" }));
    return obj;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      getCompanyById(id)
        .then((data) => {
          const comp = Array.isArray(data) ? data[0] : data;
          if (!comp) return;
          setCompany({
            name: comp.name || "",
            company_register_address: comp.company_register_address || "",
            website: comp.website || "",
            gst_number: comp.gst_number || "",
            pan_number: comp.pan_number || "",
            contact_number: comp.contact_number || "",
            linkedin: comp.linkedin || "",
            social_media: comp.social_media || "",
            domain: comp.domain || "",
            industry: comp.industry || "",
            status: comp.status || "Active",
          });

          const emps = comp.company_employees ?? comp.companyEmployees ?? [];
          setEmployees(
            (emps || []).length > 0
              ? emps.map((e: any) => ({
                  id: e.id,
                  firstName: e.first_name || "",
                  lastName: e.last_name || "",
                  email: e.email || "",
                  designation: e.designation || "",
                  phone: e.phone || "",
                  linkedin: e.linkedin || e.linkedin_url || "",
                }))
              : [{ firstName: "", lastName: "", email: "", designation: "", phone: "", linkedin: "" }]
          );

          // populate customer services state
          const svcStateCopy: any = {};
          SERVICE_DEFINITIONS.forEach(s => (svcStateCopy[s.key] = { selected: false, price: "" }));
          (comp.customer_services || []).forEach((s: any) => {
            // Map using service_key if present, else try to infer from label
            const key = s.service_key ?? (s.service_label?.toLowerCase().includes("investor") ? "investor" :
              s.service_label?.toLowerCase().includes("public") ? "public" :
              s.service_label?.toLowerCase().includes("annual") ? "annual" :
              s.service_label?.toLowerCase().includes("social") ? "smm" : null);
            if (key && svcStateCopy[key]) {
              svcStateCopy[key].selected = true;
              svcStateCopy[key].price = String(s.price ?? "");
            }
          });
          setCustomerServicesState(svcStateCopy);
        })
        .catch((err) => {
          console.error("Failed to fetch company:", err);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!company.name || !company.name.trim()) e.name = "Company name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    if (ev) ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const companyPayload: any = { ...company };

      // employees payload - map to DB shape and include id if present for update flow
      const employeesPayloadForCreate = employees
        .filter((r) => r.firstName || r.lastName || r.email || r.phone)
        .map((r) => ({
          first_name: r.firstName ?? "",
          last_name: r.lastName ?? "",
          email: r.email ?? "",
          designation: r.designation ?? "",
          phone: r.phone ?? "",
          linkedin: r.linkedin ?? "",
        }));

      // Prepare services payload
      const servicesPayload = Object.entries(customerServicesState)
        .filter(([, val]: any) => val.selected)
        .map(([key, val]: any) => {
          const label = SERVICE_DEFINITIONS.find(s => s.key === key)?.label ?? key;
          return { service_key: key, service_label: label, price: Number(val.price || 0) };
        });

      if (isEditMode && id) {
        // Prepare employees for update: include id for existing, include new ones without id.
        const employeesForUpdate = employees
          .filter((r) => r.firstName || r.lastName || r.email || r.phone)
          .map((r) => {
            if (r.id) {
              return {
                id: r.id,
                firstName: r.firstName ?? "",
                lastName: r.lastName ?? "",
                email: r.email ?? "",
                designation: r.designation ?? "",
                phone: r.phone ?? "",
                linkedin: r.linkedin ?? "",
              };
            } else {
              return {
                firstName: r.firstName ?? "",
                lastName: r.lastName ?? "",
                email: r.email ?? "",
                designation: r.designation ?? "",
                phone: r.phone ?? "",
                linkedin: r.linkedin ?? "",
              };
            }
          });

        // Send wrapper object that backend expects for update
        const payloadForUpdate = {
          company: companyPayload,
          employees: employeesForUpdate,
          customer_services: servicesPayload,
        };

        await updateCompany(id, payloadForUpdate);
      } else {
        // Create flow -> send flat payload with employees and customer_services at top-level (backend POST expects that)
        const payloadToCreate = {
          ...companyPayload,
          employees: employeesPayloadForCreate,
          customer_services: servicesPayload,
        };
        const created = await addCompany(payloadToCreate);

        // If backend didn't create customer_services (rare), try to upsert them separately
        let companyId: string | null = null;
        if (created) {
          if (Array.isArray(created) && created[0]?.id) companyId = created[0].id;
          else if (created.id) companyId = created.id;
          else if (created.company && created.company.id) companyId = created.company.id;
        }

        if (companyId && servicesPayload.length > 0) {
          try {
            await upsertCompanyServices(companyId, servicesPayload);
          } catch (err) {
            console.warn("upsertCompanyServices fallback failed", err);
          }
        }
      }

      navigate("/customer-database", { replace: true });
    } catch (err) {
      console.error("Save company error:", err);
      alert("Failed to save company. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEmployee = (index: number, field: string, value: any) => {
    setEmployees((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addEmployeeRow = () =>
    setEmployees((p) => [...p, { firstName: "", lastName: "", email: "", designation: "", phone: "", linkedin: "" }]);

  // <-- Modified: when editing an existing company, deleting an employee will also call backend to delete it immediately.
  const removeEmployeeRow = async (index: number) => {
    try {
      const emp = employees[index];
      if (isEditMode && emp && emp.id) {
        // attempt delete on server first
        try {
          await deleteCompanyEmployee(emp.id);
        } catch (err) {
          console.error("Failed to delete employee:", err);
          alert("Failed to delete employee on server. Check console.");
          return; // do not remove from UI if server delete failed
        }
      }
      // remove from UI
      setEmployees((p) => p.filter((_, i) => i !== index));
    } catch (err) {
      console.error("removeEmployeeRow error:", err);
      alert("An unexpected error occurred while removing the employee.");
    }
  };

  const toggleService = (key: string) => {
    setCustomerServicesState((prev) => ({ ...prev, [key]: { ...prev[key], selected: !prev[key].selected } }));
  };

  const setServicePrice = (key: string, value: string) => {
    setCustomerServicesState((prev) => ({ ...prev, [key]: { ...prev[key], price: value } }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{isEditMode ? "Edit Company" : "Add Company"}</h2>
              <p className="text-blue-100 text-sm">{isEditMode ? "Update company details" : "Create a new company profile"}</p>
            </div>
          </div>
          <button onClick={() => navigate("/customer-database")} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Company block */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium">Company Name *</label>
                    <input type="text" value={company.name} onChange={(e) => setCompany((p: any) => ({ ...p, name: e.target.value }))} className={`w-full px-3 py-2 border rounded-lg ${errors.name ? "border-red-300" : "border-gray-300"}`} />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Domain</label>
                    <input type="text" value={company.domain} onChange={(e) => setCompany((p: any) => ({ ...p, domain: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Industry</label>
                    <input type="text" value={company.industry} onChange={(e) => setCompany((p: any) => ({ ...p, industry: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Website</label>
                    <input type="url" value={company.website} onChange={(e) => setCompany((p: any) => ({ ...p, website: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Company Register Address</label>
                    <input type="text" value={company.company_register_address} onChange={(e) => setCompany((p: any) => ({ ...p, company_register_address: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Contact Number</label>
                    <input type="text" value={company.contact_number} onChange={(e) => setCompany((p: any) => ({ ...p, contact_number: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">GST Number</label>
                    <input type="text" value={company.gst_number} onChange={(e) => setCompany((p: any) => ({ ...p, gst_number: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">PAN Number</label>
                    <input type="text" value={company.pan_number} onChange={(e) => setCompany((p: any) => ({ ...p, pan_number: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">LinkedIn</label>
                    <input type="text" value={company.linkedin} onChange={(e) => setCompany((p: any) => ({ ...p, linkedin: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Social Media</label>
                    <input type="text" value={company.social_media} onChange={(e) => setCompany((p: any) => ({ ...p, social_media: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select value={company.status} onChange={(e) => setCompany((p: any) => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Employees */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Company Employees</h3>
                  <button type="button" onClick={addEmployeeRow} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Employee</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {employees.map((emp, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                          <input placeholder="First name" value={emp.firstName} onChange={(e) => updateEmployee(idx, "firstName", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                          <input placeholder="Last name" value={emp.lastName} onChange={(e) => updateEmployee(idx, "lastName", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                          <input placeholder="Email" value={emp.email} onChange={(e) => updateEmployee(idx, "email", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                          <input placeholder="Designation" value={emp.designation} onChange={(e) => updateEmployee(idx, "designation", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                          <input placeholder="Phone" value={emp.phone} onChange={(e) => updateEmployee(idx, "phone", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                          <input placeholder="LinkedIn" value={emp.linkedin} onChange={(e) => updateEmployee(idx, "linkedin", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="ml-4">
                          <button type="button" onClick={() => removeEmployeeRow(idx)} className="text-red-600 hover:text-red-900">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Services */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICE_DEFINITIONS.map((s) => (
                    <div key={s.key} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={customerServicesState[s.key].selected} onChange={() => toggleService(s.key)} className="mr-2" />
                          <span className="font-medium">{s.label}</span>
                        </label>
                      </div>
                      <div className="w-40">
                        <input type="number" placeholder="Amount" value={customerServicesState[s.key].price} disabled={!customerServicesState[s.key].selected} onChange={(e) => setServicePrice(s.key, e.target.value)} className="w-full px-2 py-1 border rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </form>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">* Required fields</div>
          <div className="flex space-x-3">
            <button onClick={() => navigate("/customer-database")} type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting || loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
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

export default AddCompany;
