// src/components/CustomerDatabase.tsx
import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Eye, Edit, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { getCompanies } from "../services/companyService";
import debounce from "lodash/debounce";

const CustomerDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [companies, setCompanies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  // Helper to format price in lakhs: accept "10.00", 12.6, "12", etc.
  function formatLakhs(price: any) {
    if (price === null || typeof price === "undefined" || price === "") return "-";
    // If it's an object with numeric field, try to extract
    // But normally price is primitive (string/number)
    const n = Number(price);
    if (Number.isNaN(n)) return "-";
    // Round to 2 decimals, then trim trailing zeros
    const rounded = Math.round(n * 100) / 100;
    let s = rounded.toFixed(2).replace(/\.?0+$/, ""); // removes trailing zeros and optional dot
    return `₹${s} lakhs`;
  }

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: currentPage,
        limit,
        search: searchTerm,
        status: filterBy === "all" ? undefined : filterBy,
      };
      const data = await getCompanies(queryParams);

      // data should be { companies, pagination }
      const comps = data?.companies ?? [];
      const pagination = data?.pagination ?? { page: 1, limit: comps.length, total: comps.length, pages: 1 };

      // Defensive: ensure array
      setCompanies(Array.isArray(comps) ? comps : []);
      setTotalResults(pagination.total ?? comps.length ?? 0);
      setTotalPages(pagination.pages ?? (pagination.total ? Math.ceil(pagination.total / limit) : 1));
    } catch (error) {
      console.log("Error fetching companies:", error);
      setCompanies([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = React.useMemo(
    () => debounce(fetchCompanies, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchTerm, filterBy, sortBy, currentPage]
  );

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [searchTerm, filterBy, sortBy, currentPage, debouncedFetch]);

  const handleSelectCompany = (id: string) => {
    setSelectedCompanies((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    setSelectedCompanies(selectedCompanies.length === companies.length ? [] : companies.map((c: any) => c.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Database</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and organize companies and their employees</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link to={"/add-company"} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search / Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search name, domain, industry, website, contact... (or customer services e.g. Investor Relation Entry)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select value={filterBy} onChange={(e)=>setFilterBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>

            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="name">Sort by Name</option>
              <option value="domain">Sort by Domain</option>
              <option value="industry">Sort by Industry</option>
              <option value="createdAt">Sort by Created Date</option>
            </select>

            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"><Filter className="w-5 h-5" /></button>

            <div className="flex border border-gray-300 rounded-lg">
              <button onClick={()=>setViewMode("table")} className={`px-3 py-2 text-sm ${viewMode==="table" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>Table</button>
              <button onClick={()=>setViewMode("grid")} className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode==="grid" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>Grid</button>
            </div>
          </div>
        </div>

        {/* Table view */}
        {loading ? (
          <div className="flex justify-center items-center h-40"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left"><input type="checkbox" checked={selectedCompanies.length === companies.length && companies.length > 0} onChange={handleSelectAll} className="rounded border-gray-300" /></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>

                    {/* Employees column (compact) */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>

                    {/* New: Customer Service column */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Service</th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((c:any) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4"><input type="checkbox" checked={selectedCompanies.includes(c.id)} onChange={()=>handleSelectCompany(c.id)} className="rounded border-gray-300" /></td>
                      <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{c.name ?? "-"}</div></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{c.domain ?? "-"}</div></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{c.industry ?? "-"}</div></td>
                      <td className="px-6 py-4"><a href={c.website ?? "#"} target="_blank" rel="noreferrer" className="text-blue-600">{c.website ?? "-"}</a></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{c.contact_number ?? "-"}</div></td>

                      {/* Employees (compact: only count) */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{c.employeeCount ?? (c.company_employees?.length ?? 0)}</div>
                      </td>

                      {/* Customer Service (separate column) */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {(c.customer_services || []).length > 0
                            ? (c.customer_services || []).map((s: any) => `${s.service_label} ${formatLakhs(s.price)}`).join(" • ")
                            : "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4"><div className="text-sm text-gray-900">{c.status ?? "-"}</div></td>

                      {/* Updated Actions cell */}
                      <td className="px-6 py-4 flex space-x-2">
                        <Link to={`/company-detail/${c.id}`} className="text-gray-400 hover:text-blue-600" title="See company">
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link to={`/edit-company/${c.id}`} className="text-blue-600 hover:text-blue-900" title="Edit company">
                          <Edit className="w-4 h-4" />
                        </Link>

                        {(() => {
                          const firstEmp = (c.company_employees && c.company_employees[0]) || null;
                          const mailTo = firstEmp?.email || c.contact_email || "";
                          return (
                            <a
                              href={mailTo ? `mailto:${mailTo}` : "#"}
                              onClick={(e) => { if (!mailTo) e.preventDefault(); }}
                              className={`text-gray-400 hover:text-blue-600 ${!mailTo ? "opacity-40 cursor-not-allowed" : ""}`}
                              title={mailTo ? `Send email to ${mailTo}` : "No email available"}
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* grid view — keep customer_services visible but separate from employees */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c:any) => (
              <div key={c.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-gray-600">{c.industry} • {c.domain}</p>
                    <a href={c.website} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">{c.website}</a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/company-detail/${c.id}`} className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></Link>
                    <Link to={`/edit-company/${c.id}`} className="p-1 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></Link>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">Employees: <span className="font-medium">{c.employeeCount ?? (c.company_employees?.length ?? 0)}</span></div>
                  <div className="text-sm text-gray-700">Status: <span className="font-medium">{c.status}</span></div>
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  {(c.customer_services || []).length > 0 ? (c.customer_services || []).map((s:any)=> `${s.service_label} ${formatLakhs(s.price)}`).join(" • ") : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDatabase;
