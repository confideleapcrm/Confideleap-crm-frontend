// src/components/InvestorDatabase.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Eye,
  Star,
  MapPin,
  DollarSign,
  Building,
  Mail,
  ExternalLink,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
// IMPORTANT: use the targeting list service (same behaviour as InvestorTargeting)
import { getInvestorTargetingList } from "../services/investorService";
import debounce from "lodash/debounce";

const InvestorDatabase = () => {
  // controlled input shown to user
  const [searchInput, setSearchInput] = useState("");
  // debounced token actually sent to backend
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [investors, setInvestors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  // Build params for the targeting endpoint (keeps behaviour same as InvestorTargeting)
  const buildQueryParams = () => {
    const params: any = {
      page: currentPage,
      limit,
      search: search && search.trim() !== "" ? search.trim() : undefined,
      // pass status via `status` param if you want to map filterBy -> status for backend
      status: filterBy === "all" ? undefined : filterBy,
      // we don't have firmTypes/sectors selected in this small header, so leave blank
      sectors: undefined,
      firmTypes: undefined,
      aum: undefined,
      buySell: undefined,
      sortBy: undefined, // keep backend defaults for now. If you want mapping, add here.
    };
    return params;
  };

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const params = buildQueryParams();
      // calling targeting list to reuse the advanced search/categorization logic on backend
      const data = await getInvestorTargetingList(params);
      if (data?.investors && data.investors.length) {
        setInvestors(data.investors);
        setTotalResults(data.pagination?.total || 0);
        setTotalPages(data.pagination?.pages || 0);
      } else {
        setInvestors([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.log("Error fetching investors:", error);
      setInvestors([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Debounce commit from searchInput -> search (500ms)
  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        // when committing a new search, reset to page 1 (same behaviour as InvestorTargeting)
        setCurrentPage(1);
        setSearch(val);
      }, 500),
    [],
  );

  // wire controlled input -> debounced token
  const onSearchInputChange = (value: string) => {
    setSearchInput(value);

    // if user cleared the textbox, cancel debounce and immediately clear the search token
    if (value.trim() === "") {
      debouncedSetSearch.cancel();
      setSearch("");
      setCurrentPage(1);
      // immediate fetch will happen via effect below (search changed)
    } else {
      debouncedSetSearch(value);
    }
  };

  // cancel debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // fetch whenever search, filterBy, sortBy or currentPage change
  useEffect(() => {
    fetchInvestors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterBy, sortBy, currentPage]);

  // initial load
  useEffect(() => {
    fetchInvestors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectInvestor = (id: string) => {
    setSelectedInvestors((prev) =>
      prev.includes(id)
        ? prev.filter((investorId) => investorId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedInvestors(
      selectedInvestors.length === investors.length
        ? []
        : investors.map((inv: any) => inv.id),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "bg-red-100 text-red-800";
      case "warm":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFitColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // helper to build mailto with id
  const buildMailTo = (email: string, id: string) => {
    const decodedId = (() => {
      try {
        return decodeURIComponent(id);
      } catch {
        return id;
      }
    })();

    const subject = encodeURIComponent(
      `Introduction / Opportunity — InvestorID: ${decodedId}`,
    );
    const body = encodeURIComponent(
      `Hi,\n\nReferencing investor record ID: ${decodedId}\n\n(Write message here)\n\nRegards,`,
    );

    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // Pagination helpers
  const goToPage = (p: number) => {
    if (p < 1) p = 1;
    if (totalPages && p > totalPages) p = totalPages;
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Investor Database
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and organize your investor relationships
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>

              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <Link
                to={"/add-investor"}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Investor</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search investors, firms, or sectors..."
                  value={searchInput}
                  onChange={(e) => onSearchInputChange(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="firm">Sort by Firm</option>
                <option value="fit">Sort by Portfolio Fit</option>
                <option value="status">Sort by Status</option>
              </select>

              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                <Filter className="w-5 h-5" />
              </button>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Investors
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {totalResults}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  High Fit (90%+)
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    investors.filter((inv: any) => inv.portfolioFit >= 90)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    investors.filter(
                      (inv: any) =>
                        inv.status === "hot" || inv.status === "warm",
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Unique Firms
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    new Set(
                      investors.map((inv: any) => JSON.stringify(inv.firm)),
                    ).size
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Actions */}
        {selectedInvestors.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedInvestors.length} investor
                {selectedInvestors.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Add to Campaign
                </button>
                <button className="px-3 py-1 border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-100">
                  Export Selected
                </button>
                <button className="px-3 py-1 border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-100">
                  Bulk Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedInvestors.length === investors.length &&
                          investors.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Firm & Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Focus Areas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Portfolio Fit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investors.map((investor: any) => (
                    <tr key={investor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInvestors.includes(investor.id)}
                          onChange={() => handleSelectInvestor(investor.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={
                              investor.avatarUrl ||
                              "https://ui-avatars.com/api/?name=Investor&background=0D8ABC&color=fff"
                            }
                            alt={investor.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {investor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {investor.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {investor.firm?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {investor.role}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {investor.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {investor.sectors &&
                            investor.sectors.slice(0, 2).map((sector: any) => (
                              <span
                                key={sector}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {sector}
                              </span>
                            ))}
                          {investor.sectors && investor.sectors.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{investor.sectors.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span
                            className={`text-sm font-semibold ${getFitColor(investor.portfolioFit)}`}
                          >
                            {investor.portfolioFit}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investor.status)}`}
                        >
                          {investor.status.charAt(0).toUpperCase() +
                            investor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/investor-detail/${investor.id}`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/edit-investor/${investor.id}`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <a
                            href={
                              investor.email
                                ? buildMailTo(investor.email, investor.id)
                                : "#"
                            }
                            className="p-1 text-gray-400 hover:text-blue-600"
                            onClick={(e) => {
                              if (!investor.email) e.preventDefault();
                            }}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {investors.map((investor: any) => (
              <div
                key={investor.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedInvestors.includes(investor.id)}
                        onChange={() => handleSelectInvestor(investor.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <img
                        src={
                          investor.avatarUrl ||
                          "https://ui-avatars.com/api/?name=Investor&background=0D8ABC&color=fff"
                        }
                        alt={investor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {investor.name}
                    </h3>
                    <p className="text-sm text-gray-600">{investor.role}</p>
                    <p className="text-sm font-medium text-blue-600">
                      {investor.firm?.name}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {investor.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {investor.averageInvestment}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span
                        className={`text-sm font-semibold ${getFitColor(investor.portfolioFit)}`}
                      >
                        {investor.portfolioFit}% fit
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(investor.status)}`}
                    >
                      {investor.status.charAt(0).toUpperCase() +
                        investor.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={investor.phone ? `tel:${investor.phone}` : "#"}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${investor.phone ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                      onClick={(e) => {
                        if (!investor.phone) e.preventDefault();
                      }}
                      title={
                        investor.phone ? "Call investor" : "Phone not available"
                      }
                    >
                      Contact
                    </a>
                    <a
                      href={
                        investor.email
                          ? buildMailTo(investor.email, investor.id)
                          : "#"
                      }
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                      onClick={(e) => {
                        if (!investor.email) e.preventDefault();
                      }}
                      title={
                        investor.email
                          ? "Email investor"
                          : "Email not available"
                      }
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <a
                      href={investor.firm?.website || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                      onClick={(e) => {
                        if (!investor.firm?.website) e.preventDefault();
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * limit, totalResults)}
              </span>{" "}
              of <span className="font-medium">{totalResults}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {(() => {
                const pages = [];
                const maxVisible = 5;
                const start = Math.max(2, currentPage - 2);
                const end = Math.min(totalPages - 1, currentPage + 2);

                if (totalPages > 0) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={`px-3 py-2 rounded-lg text-sm ${currentPage === 1 ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                    >
                      1
                    </button>,
                  );
                  if (start > 2)
                    pages.push(
                      <span key="start-ellipsis" className="px-2">
                        ...
                      </span>,
                    );
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 rounded-lg text-sm ${currentPage === i ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                      >
                        {i}
                      </button>,
                    );
                  }
                  if (end < totalPages - 1)
                    pages.push(
                      <span key="end-ellipsis" className="px-2">
                        ...
                      </span>,
                    );
                  if (totalPages > 1)
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-3 py-2 rounded-lg text-sm ${currentPage === totalPages ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                      >
                        {totalPages}
                      </button>,
                    );
                }
                return pages;
              })()}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDatabase;
