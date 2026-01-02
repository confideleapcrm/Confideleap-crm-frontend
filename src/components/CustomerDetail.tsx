// src/components/CustomerDetail.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Building, Users } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../services/customerService";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCustomerById(id)
      .then((res) => {
        setData(res);
      })
      .catch((error) => {
        console.error("Error fetching company details:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading company details...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Company not found</div>
      </div>
    );
  }

  const company = data.companyDetails ?? {
    id: data.company_id ?? data.id,
    name: data.company ?? data.companyName,
    website: data.company_website ?? data.website,
    address: data.company_register_address ?? data.address,
    gst_number: data.gst_number ?? data.gstNumber,
    pan_number: data.pan_number ?? data.panNumber,
    contact_number: data.contact_number ?? data.contactNumber,
    linkedin: data.linkedin ?? "",
    social_media: data.social_media ?? "",
    domain: data.domain ?? data.company_domain ?? "",
    industry: data.industry ?? "",
    status: data.status ?? "inactive",
    employee_count: (data.companyEmployees ?? data.company_employees ?? []).length,
  };

  const employees = data.companyEmployees ?? data.company_employees ?? [];

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6 flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl uppercase">{(company.name?.[0] ?? "C")}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              {company.domain && <p className="text-gray-600">{company.domain}</p>}
              {company.website && <p className="text-blue-600 font-medium">{company.website}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Contact Information */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {company.website && (
              <li className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-400" />
                <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">{company.website}</a>
              </li>
            )}
            {company.contact_number && (
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${company.contact_number}`} className="text-blue-600 hover:text-blue-800">{company.contact_number}</a>
              </li>
            )}
            {company.address && (
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{company.address}</span>
              </li>
            )}
            {company.linkedin && (
              <li className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-400" />
                <a href={company.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">{company.linkedin}</a>
              </li>
            )}
          </ul>
        </section>

        {/* Company Info */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">Domain</h3>
            <p className="text-gray-700">{company.domain || "-"}</p>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">Industry</h3>
            <p className="text-gray-700">{company.industry || "-"}</p>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">Status</h3>
            <p className="text-gray-700">{capitalize(company.status)}</p>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">GST Number</h3>
            <p className="text-gray-700">{company.gst_number || "-"}</p>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">PAN Number</h3>
            <p className="text-gray-700">{company.pan_number || "-"}</p>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">Employees</h3>
            <p className="text-gray-700">{company.employee_count || employees.length || 0}</p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-md font-semibold text-gray-900 mb-2">Social</h3>
            <p className="text-gray-700">{company.social_media || "-"}</p>
          </div>
        </section>

        {/* Employees */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
          </div>

          {employees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((emp: any, idx: number) => (
                <div key={emp.id ?? idx} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{emp.first_name ?? emp.firstName ?? `${emp.firstName ?? ""} ${emp.lastName ?? ""}`}</div>
                      <div className="text-sm text-gray-500">{emp.designation ?? "-"}</div>
                      <div className="text-sm text-blue-600">{emp.email ?? "-"}</div>
                    </div>
                    <div className="text-sm text-gray-500">{emp.phone ?? "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No employees recorded for this company.</p>
          )}
        </section>

        {/* Created and Updated Info */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-sm text-gray-500">
          <p>Created: {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}</p>
          <p>Last Updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}</p>
        </section>
      </div>
    </div>
  );
};

export default CustomerDetail;

