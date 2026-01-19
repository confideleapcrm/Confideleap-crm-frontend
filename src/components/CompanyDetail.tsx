// src/components/CompanyDetail.tsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Building, Mail, Phone, MapPin, Users } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanyById } from "../services/companyService";

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // helper (same formatting as in CustomerDatabase)
  function formatLakhs(price: any) {
    if (price === null || typeof price === "undefined" || price === "") return "-";
    const n = Number(price);
    if (Number.isNaN(n)) return "-";
    const rounded = Math.round(n * 100) / 100;
    let s = rounded.toFixed(2).replace(/\.?0+$/, "");
    return `₹${s} lakhs`;
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCompanyById(id)
      .then((data) => {
        setCompany(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-gray-500">Loading company details...</div></div>;
  if (!company) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-gray-500">Company not found</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6 flex items-center space-x-4">
          <button onClick={()=>navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-600">{company.domain} • {company.industry}</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3 text-sm text-gray-700">
            {company.website && <div className="flex items-center space-x-3"><Building className="w-4 h-4 text-gray-400" /><a href={company.website} className="text-blue-600">{company.website}</a></div>}
            {company.contact_number && <div className="flex items-center space-x-3"><Phone className="w-4 h-4 text-gray-400" /><span>{company.contact_number}</span></div>}
            {company.company_register_address && <div className="flex items-center space-x-3"><MapPin className="w-4 h-4 text-gray-400" /><span>{company.company_register_address}</span></div>}
            {company.linkedin && <div className="flex items-center space-x-3"><Users className="w-4 h-4 text-gray-400" /><a href={company.linkedin} className="text-blue-600">{company.linkedin}</a></div>}
            <div>GST: {company.gst_number || "-"}</div>
            <div>PAN: {company.pan_number || "-"}</div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Employees ({company.company_employees?.length || 0})</h2>
          <div className="space-y-3">
            {(company.company_employees || []).map((e:any) => (
              <div key={e.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{e.first_name} {e.last_name}</div>
                  <div className="text-sm text-gray-500">{e.designation} • {e.email}</div>
                </div>
                <div className="text-sm text-gray-600">{e.phone}</div>
              </div>
            ))}
            {(!company.company_employees || company.company_employees.length === 0) && <div className="text-gray-500">No employees added</div>}
          </div>
        </section>

        {/* New Customer Services section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Services</h2>
          <div className="space-y-2">
            {(company.customer_services || []).length > 0 ? (
              (company.customer_services || []).map((s: any) => (
                <div key={s.id ?? `${s.service_key}-${s.price}`} className="flex items-center justify-between p-2 border rounded">
                  <div className="text-sm text-gray-800">{s.service_label}</div>
                  <div className="text-sm font-medium">{formatLakhs(s.price)}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No customer services selected</div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-sm text-gray-500">
          <div>Status: <span className="font-medium text-gray-900">{company.status}</span></div>
          <div>Created: {company.created_at ? new Date(company.created_at).toLocaleString() : "-"}</div>
          <div>Updated: {company.updated_at ? new Date(company.updated_at).toLocaleString() : "-"}</div>
        </section>
      </div>
    </div>
  );
};

export default CompanyDetail;

