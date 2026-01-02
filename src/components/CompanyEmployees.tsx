// src/components/CompanyEmployees.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCompanyEmployees } from "../services/companyService";
import { Mail, Phone, ArrowLeft } from "lucide-react";

const CompanyEmployees: React.FC = () => {
  const { companyId } = useParams<{ companyId?: string }>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await getCompanyEmployees(companyId);
        if (!cancelled) {
          // res could be { employees: [...] } or an array; normalize:
          const arr = Array.isArray(res) ? res : res?.employees ?? res?.company_employees ?? [];
          setEmployees(arr);
        }
      } catch (e: any) {
        console.error("Error fetching employees", e);
        if (!cancelled) setError("Failed to load employees");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  if (!companyId) return <div className="p-6">Missing company id.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center">
          <Link to="/customer-database" className="mr-3 text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
          <h2 className="text-lg font-semibold">Employees</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          {loading ? (
            <div className="py-8 text-center">Loading employees...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-600">{error}</div>
          ) : employees.length === 0 ? (
            <div className="py-8 text-center text-gray-600">No employees found</div>
          ) : (
            <ul className="space-y-3">
              {employees.map((emp: any) => {
                const first = emp.first_name ?? emp.firstName ?? "";
                const last = emp.last_name ?? emp.lastName ?? "";
                const email = emp.email ?? "";
                const phone = emp.phone ?? "";
                const designation = emp.designation ?? emp.title ?? "";
                return (
                  <li key={emp.id ?? `${email}-${phone}`} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{first} {last}</div>
                      <div className="text-sm text-gray-600">{designation}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {email && <a href={`mailto:${email}`} className="text-blue-600 flex items-center space-x-2"><Mail className="w-4 h-4"/><span className="text-xs">{email}</span></a>}
                      {phone && <a href={`tel:${phone}`} className="text-gray-600 flex items-center space-x-2"><Phone className="w-4 h-4"/><span className="text-xs">{phone}</span></a>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyEmployees;
