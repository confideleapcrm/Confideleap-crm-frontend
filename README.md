<<<<<<< HEAD
# investor-relations
=======
# Confideleap-crm-frontend
>>>>>>> 210f1469300fb4da86fc0102b8cca90362db8e77



















i want 1 more small modification here
when i select fields in these 4 filters
Investor Category
Sector Focus
AUM
Buy / Sell

it is not moving to top but in  Customer (Company) it is working fine when we select any field it moves to top

please also solve this 

this is my updated FilterPanel.tsx
// src/components/FilterPanel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Filter, ChevronDown, Search } from "lucide-react";
import { getCompanies } from "../services/companyService";
import debounce from "lodash/debounce";

type FiltersShape = {
  firmTypes: string[];
  sectors: string[];
  aum: string[];
  buySell: string[];
  customerIds?: string[];
};

interface FilterPanelProps {
  onChange?: (filters: FiltersShape) => void;
  initial?: Partial<FiltersShape>;
}

const SAVED_KEY = "investorTargeting_saved_companies_v1";

const FilterPanel: React.FC<FilterPanelProps> = ({ onChange, initial }) => {
  const [showFilters, setShowFilters] = useState(false);

  const defaultState: FiltersShape = {
    firmTypes: [],
    sectors: [],
    aum: [],
    buySell: [],
    customerIds: [],
    ...initial,
  };

  const [filters, setFilters] = useState<FiltersShape>(defaultState);
  const applyingInitialRef = useRef(false);
  const [savedPreference, setSavedPreference] = useState<any | null>(null);

  useEffect(() => {
    if (applyingInitialRef.current) {
      applyingInitialRef.current = false;
      return;
    }
    onChange && onChange(filters);
  }, [filters]);

  useEffect(() => {
    if (!initial) return;

    const normalize = (f: any) => ({
      firmTypes: Array.isArray(f?.firmTypes) ? f.firmTypes : [],
      sectors: Array.isArray(f?.sectors) ? f.sectors : [],
      aum: Array.isArray(f?.aum) ? f.aum : [],
      buySell: Array.isArray(f?.buySell) ? f.buySell : [],
      customerIds: Array.isArray(f?.customerIds) ? f.customerIds.map(String) : [],
    });

    const cur = normalize(filters);
    const nxt = normalize(initial);

    if (JSON.stringify(cur) === JSON.stringify(nxt)) return;

    applyingInitialRef.current = true;
    setFilters(nxt);
  }, [initial]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (!raw) return;
      setSavedPreference(JSON.parse(raw));
    } catch {
      setSavedPreference(null);
    }
  }, []);

  const investorCategoryOptions = [
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

  const aumOptions = ["<10 cr", "10-50 cr", "50-100 cr", "100-200 cr", "200+ cr"];
  const buySellOptions = ["Buy", "Sell", "Both"];

  const toggleOption = (key: keyof FiltersShape, value: string) => {
    setFilters((prev) => {
      const list = (prev[key] as string[]) || [];
      const exists = list.includes(value);
      return {
        ...prev,
        [key]: exists ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  };

  const clearAll = () =>
    setFilters({
      firmTypes: [],
      sectors: [],
      aum: [],
      buySell: [],
      customerIds: [],
    });

  const clearSavedPreference = () => {
    try {
      localStorage.removeItem(SAVED_KEY);
      setSavedPreference(null);
      alert("Cleared saved preference.");
    } catch {
      alert("Failed to clear saved preference.");
    }
  };
  // ---------------------------
  // Company / Customer
  // ---------------------------
  const [companyQuery, setCompanyQuery] = useState("");
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [companyResults, setCompanyResults] = useState<any[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const loadAllCompanies = async () => {
    try {
      setCompaniesLoading(true);
      const res = await getCompanies({ page: 1, limit: 1000 });
      const comps = res?.companies ?? [];
      setAllCompanies(comps);
      setCompanyResults(comps);
    } finally {
      setCompaniesLoading(false);
    }
  };

  useEffect(() => {
    loadAllCompanies();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        if (!q) return setCompanyResults(allCompanies);
        const lq = q.toLowerCase();
        setCompanyResults(
          allCompanies.filter((c) =>
            (c.name || "").toLowerCase().includes(lq)
          )
        );
      }, 200),
    [allCompanies]
  );

  useEffect(() => {
    debouncedSearch(companyQuery);
    return () => debouncedSearch.cancel();
  }, [companyQuery]);

  const saveCurrentPreference = () => {
    const pref = {
      firmTypes: filters.firmTypes,
      sectors: filters.sectors,
      aum: filters.aum,
      buySell: filters.buySell,
      customerIds: filters.customerIds,
    };
    localStorage.setItem(SAVED_KEY, JSON.stringify(pref));
    setSavedPreference(pref);
    alert("Saved preference");
  };

  const sortCompaniesWithSelectedFirst = (companies: any[], selectedIds?: string[]) => {
    if (!selectedIds || !selectedIds.length) return companies;
    const selId = selectedIds[0];
    return [
      ...companies.filter((c) => String(c.id) === selId),
      ...companies.filter((c) => String(c.id) !== selId),
    ];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 text-sm"
        >
          {showFilters ? "Hide" : "Show"} Filters
        </button>
      </div>

      {showFilters && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Investor Category – MULTI + SCROLL */}
            <div>
              <h4 className="text-sm font-medium mb-2">Investor Category</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {investorCategoryOptions.map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.firmTypes.includes(opt)}
                      onChange={() => toggleOption("firmTypes", opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sector Focus – MULTI + SCROLL */}
            <div>
              <h4 className="text-sm font-medium mb-2">Sector Focus</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {sectorOptions.map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.sectors.includes(opt)}
                      onChange={() => toggleOption("sectors", opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AUM – MULTI + SCROLL */}
            <div>
              <h4 className="text-sm font-medium mb-2">AUM</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {aumOptions.map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.aum.includes(opt)}
                      onChange={() => toggleOption("aum", opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buy / Sell – MULTI + SCROLL */}
            <div>
              <h4 className="text-sm font-medium mb-2">Buy / Sell</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {buySellOptions.map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.buySell.includes(opt)}
                      onChange={() => toggleOption("buySell", opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer (Company) – already scroll */}
            <div>
              <h4 className="text-sm font-medium mb-2">Customer (Company)</h4>
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Search company"
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
              />

              <div className="border rounded max-h-48 overflow-auto">
                {companiesLoading ? (
                  <div className="p-3 text-sm text-gray-500">Loading…</div>
                ) : (
                  sortCompaniesWithSelectedFirst(companyResults, filters.customerIds).map((c) => {
                    const active = filters.customerIds?.[0] === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            customerIds: active ? [] : [c.id],
                          }))
                        }
                        className={`px-3 py-2 cursor-pointer ${
                          active ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"
                        }`}
                      >
                        {c.name}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-3">
            <button onClick={clearAll} className="px-3 py-1 bg-gray-100 rounded">
              Clear all
            </button>

            <button
              onClick={clearSavedPreference}
              disabled={!savedPreference}
              className={`px-3 py-1 rounded ${
                savedPreference
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Clear saved
            </button>

            <button
              onClick={saveCurrentPreference}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterPanel;


please do this update in this code also retrun full modified code after modification, also make sure do not skip anything even a single line , if code is big provide me in 2 or 3 parts