// // src/components/FilterPanel.tsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Filter, ChevronDown, X, Search } from "lucide-react";
// import { getCompanies } from "../services/companyService";
// import debounce from "lodash/debounce";

// type FiltersShape = {
//   firmTypes: string[]; // Investor Category / Firm Type
//   sectors: string[]; // Sector Focus
//   aum: string[]; // "<10 cr", "10-50 cr", "50-200 cr", "200+ cr"
//   buySell: string[]; // "Buy", "Sell", "Both"
//   customerIds?: string[]; // selected company/customer ids
// };

// interface FilterPanelProps {
//   onChange?: (filters: FiltersShape) => void;
//   initial?: Partial<FiltersShape>;
// }

// const SAVED_KEY = "investorTargeting_saved_companies_v1";

// const FilterPanel: React.FC<FilterPanelProps> = ({ onChange, initial }) => {
//   const [showFilters, setShowFilters] = useState(false);

//   const defaultState: FiltersShape = {
//     firmTypes: [],
//     sectors: [],
//     aum: [],
//     buySell: [],
//     customerIds: [],
//     ...initial,
//   };

//   const [filters, setFilters] = useState<FiltersShape>(defaultState);

//   // when we are applying the `initial` prop to local state, avoid firing onChange back to parent
//   const applyingInitialRef = useRef(false);

//   // saved preference (can be legacy array or full object). We'll normalize when using.
//   const [savedPreference, setSavedPreference] = useState<any | null>(null);

//   // Emit changes to parent, but skip while applying initial
//   useEffect(() => {
//     if (applyingInitialRef.current) {
//       // first change after syncing initial — consume the flag and do not emit
//       applyingInitialRef.current = false;
//       return;
//     }
//     onChange && onChange(filters);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters]);

//   // If parent passes a new `initial` (e.g. auto-applied saved preference), sync to local filters.
//   useEffect(() => {
//     if (!initial) return;

//     // simple deep-ish compare to avoid unnecessary sets (prevent churn)
//     const normalize = (f: any) => ({
//       firmTypes: Array.isArray(f?.firmTypes) ? f.firmTypes : [],
//       sectors: Array.isArray(f?.sectors) ? f.sectors : [],
//       aum: Array.isArray(f?.aum) ? f.aum : [],
//       buySell: Array.isArray(f?.buySell) ? f.buySell : [],
//       customerIds: Array.isArray(f?.customerIds) ? f.customerIds.map(String) : [],
//     });
//     const cur = normalize(filters);
//     const nxt = normalize(initial);

//     const same =
//       JSON.stringify(cur.firmTypes) === JSON.stringify(nxt.firmTypes) &&
//       JSON.stringify(cur.sectors) === JSON.stringify(nxt.sectors) &&
//       JSON.stringify(cur.aum) === JSON.stringify(nxt.aum) &&
//       JSON.stringify(cur.buySell) === JSON.stringify(nxt.buySell) &&
//       JSON.stringify(cur.customerIds) === JSON.stringify(nxt.customerIds);

//     if (same) return;

//     applyingInitialRef.current = true;
//     setFilters((prev) => ({
//       ...prev,
//       firmTypes: nxt.firmTypes,
//       sectors: nxt.sectors,
//       aum: nxt.aum,
//       buySell: nxt.buySell,
//       customerIds: nxt.customerIds,
//     }));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initial]);

//   // load saved preference from localStorage (support legacy array or object)
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(SAVED_KEY);
//       if (!raw) {
//         setSavedPreference(null);
//         return;
//       }
//       const parsed = JSON.parse(raw);
//       if (Array.isArray(parsed)) {
//         // legacy format: company id array
//         setSavedPreference({ customerIds: parsed.map(String) });
//       } else if (parsed && typeof parsed === "object") {
//         setSavedPreference(parsed);
//       } else {
//         setSavedPreference(null);
//       }
//     } catch (err) {
//       setSavedPreference(null);
//     }
//   }, []);

//   const investorCategoryOptions = [
//     "PMS - Portfolio Management System",
//     "AIF - Alternate Investment Fund",
//     "HNI - High Net Worth Individual",
//     "MF - Mutual Fund",
//     "II - Institutional Investor",
//     "FII - Foreign Institutional Investors",
//     "SIF - Specialized Investment Fund",
//     "IC - Insurance Company",
//     "PE - Private Equity",
//     "FO - Family Office",
//     "BF - Brokerage Firm",
//   ];

//   const sectorOptions = [
//     "FinTech",
//     "HealthTech",
//     "EdTech",
//     "SaaS",
//     "E-commerce",
//     "AI/ML",
//     "Biotech",
//     "CleanTech",
//     "Consumer",
//     "Enterprise",
//     "Gaming",
//     "Media",
//     "Real Estate",
//     "Transportation",
//     "Food & Beverage",
//   ];

//   const aumOptions = ["<10 cr", "10-50 cr", "50-100 cr", "100-200 cr", "200+ cr"];

//   const buySellOptions = ["Buy", "Sell", "Both"];

//   // helper to render selected options first (keeps internal option order otherwise)
//   const sortOptionsWithSelectedFirst = (options: string[], selected: string[] = []) => {
//     const selectedSet = new Set((selected || []).map(String));
//     const selectedOpts: string[] = [];
//     const unselectedOpts: string[] = [];
//     for (const opt of options) {
//       if (selectedSet.has(opt)) selectedOpts.push(opt);
//       else unselectedOpts.push(opt);
//     }
//     return [...selectedOpts, ...unselectedOpts];
//   };

//   const toggleOption = (key: keyof FiltersShape, option: string) => {
//     setFilters((prev) => {
//       const list = (prev as any)[key] || [];
//       const exists = list.includes(option);
//       const updated = exists ? list.filter((s: string) => s !== option) : [...list, option];
//       return { ...prev, [key]: updated };
//     });
//   };

//   const clearAll = () =>
//     setFilters({
//       firmTypes: [],
//       sectors: [],
//       aum: [],
//       buySell: [],
//       customerIds: [],
//     });

//   // ---------------------------
//   // Company / Customer filter
//   // ---------------------------
//   const [companyQuery, setCompanyQuery] = useState("");
//   const [allCompanies, setAllCompanies] = useState<any[]>([]);
//   const [companyResults, setCompanyResults] = useState<any[]>([]);
//   const [companySearching, setCompanySearching] = useState(false);
//   const [companiesLoading, setCompaniesLoading] = useState(false);

//   const loadAllCompanies = async () => {
//     try {
//       setCompaniesLoading(true);
//       const res = await getCompanies({ page: 1, limit: 1000 });
//       const comps = res?.companies ?? [];
//       setAllCompanies(Array.isArray(comps) ? comps : []);
//       setCompanyResults(Array.isArray(comps) ? comps : []);
//     } catch (err) {
//       console.error("Failed to load companies for filter", err);
//       setAllCompanies([]);
//       setCompanyResults([]);
//     } finally {
//       setCompaniesLoading(false);
//       setCompanySearching(false);
//     }
//   };

//   useEffect(() => {
//     loadAllCompanies();
//   }, []);

//   const debouncedLocalSearch = useMemo(
//     () =>
//       debounce((q: string) => {
//         if (!q || q.trim().length === 0) {
//           setCompanyResults(allCompanies);
//           setCompanySearching(false);
//           return;
//         }
//         const lq = q.trim().toLowerCase();
//         const filtered = allCompanies.filter((c) => {
//           const name = (c.name || "").toString().toLowerCase();
//           const domain = (c.domain || c.website || "").toString().toLowerCase();
//           return name.includes(lq) || domain.includes(lq);
//         });
//         setCompanyResults(filtered);
//         setCompanySearching(false);
//       }, 200),
//     [allCompanies]
//   );

//   useEffect(() => {
//     setCompanySearching(true);
//     debouncedLocalSearch(companyQuery);
//     return () => debouncedLocalSearch.cancel();
//   }, [companyQuery, debouncedLocalSearch]);

//   const toggleCompanySelection = (companyId: string) => {
//     setFilters((prev) => {
//       const list = prev.customerIds || [];
//       const exists = list.includes(companyId);
//       const updated = exists ? list.filter((id) => id !== companyId) : [...list, companyId];
//       return { ...prev, customerIds: updated };
//     });
//   };

//   const clearCompanySelections = () => {
//     setFilters((prev) => ({ ...prev, customerIds: [] }));
//   };

//   const isCompanySelected = (id: string) => (filters.customerIds || []).includes(id);

//   const clearSavedPreference = () => {
//     try {
//       localStorage.removeItem(SAVED_KEY);
//       setSavedPreference(null);
//       alert("Cleared saved preference.");
//     } catch (err) {
//       console.error("Failed to clear saved preference", err);
//       alert("Failed to clear saved preference.");
//     }
//   };

//   // Save current selected filters (+ companies) into localStorage (used by Save in header)
//   const saveCurrentPreference = () => {
//     try {
//       const pref = {
//         customerIds: filters.customerIds?.slice() || [],
//         firmTypes: filters.firmTypes?.slice() || [],
//         sectors: filters.sectors?.slice() || [],
//         aum: filters.aum?.slice() || [],
//         buySell: filters.buySell?.slice() || [],
//       };
//       localStorage.setItem(SAVED_KEY, JSON.stringify(pref));
//       setSavedPreference(pref);
//       alert("Saved company & filters preference.");
//     } catch (err) {
//       console.error("Failed to save preferences", err);
//       alert("Failed to save preference.");
//     }
//   };

//   // Render helpers for sorted options (selected first)
//   const renderedInvestorCategoryOptions = sortOptionsWithSelectedFirst(investorCategoryOptions, filters.firmTypes);
//   const renderedSectorOptions = sortOptionsWithSelectedFirst(sectorOptions, filters.sectors);
//   const renderedAumOptions = sortOptionsWithSelectedFirst(aumOptions, filters.aum);
//   const renderedBuySellOptions = sortOptionsWithSelectedFirst(buySellOptions, filters.buySell);

//   // Company results shown with selected companies on top
//   const renderedCompanyResults = useMemo(() => {
//     const selectedSet = new Set((filters.customerIds || []).map(String));
//     const selected: any[] = [];
//     const unselected: any[] = [];
//     for (const c of companyResults || []) {
//       if (selectedSet.has(String(c.id))) selected.push(c);
//       else unselected.push(c);
//     }
//     return [...selected, ...unselected];
//   }, [companyResults, filters.customerIds]);

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//           <Filter className="w-5 h-5 mr-2 text-gray-500" />
//           Filters
//         </h3>

//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
//           >
//             {showFilters ? "Hide" : "Show"} Filters
//             <ChevronDown
//               className={`w-4 h-4 ml-1 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
//             />
//           </button>
//         </div>
//       </div>

//       {/* NOTE: Active filter chips are intentionally hidden per request.
//                 The UI will rely on checked boxes within each filter column. */}

//       {/* Filter Options */}
//       {showFilters && (
//         <>
//           {/* main row: add Customer column to the RIGHT of Buy/Sell */}
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Investor Category (Firm Type) */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-900 mb-3">Investor Category</h4>
//               <div className="space-y-2 max-h-48 overflow-auto pr-2">
//                 {renderedInvestorCategoryOptions.map((opt) => {
//                   const checked = filters.firmTypes.includes(opt);
//                   return (
//                     <label key={opt} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         checked={checked}
//                         onChange={() => toggleOption("firmTypes", opt)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">{opt}</span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Sector Focus */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-900 mb-3">Sector Focus</h4>
//               <div className="space-y-2 max-h-48 overflow-auto pr-2">
//                 {renderedSectorOptions.map((opt) => {
//                   const checked = filters.sectors.includes(opt);
//                   return (
//                     <label key={opt} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         checked={checked}
//                         onChange={() => toggleOption("sectors", opt)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">{opt}</span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* AUM */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-900 mb-3">AUM</h4>
//               <div className="space-y-2">
//                 {renderedAumOptions.map((opt) => {
//                   const checked = filters.aum.includes(opt);
//                   return (
//                     <label key={opt} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         checked={checked}
//                         onChange={() => toggleOption("aum", opt)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">{opt}</span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Buy / Sell */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-900 mb-3">Buy / Sell</h4>
//               <div className="space-y-2">
//                 {renderedBuySellOptions.map((opt) => {
//                   const checked = filters.buySell.includes(opt);
//                   return (
//                     <label key={opt} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         checked={checked}
//                         onChange={() => toggleOption("buySell", opt)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">{opt}</span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Customer (Company) – now RIGHT of Buy/Sell in the grid */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-900 mb-3">Customer (Company)</h4>

//               <div className="mb-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     placeholder="Search companies by name..."
//                     value={companyQuery}
//                     onChange={(e) => setCompanyQuery(e.target.value)}
//                     className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded"
//                   />
//                   {companySearching && (
//                     <div className="absolute right-3 top-2 text-xs text-gray-500">Searching…</div>
//                   )}
//                 </div>
//               </div>

//               {/* selected summary + clear */}
//               <div className="flex items-center justify-between mb-2">
//                 <div className="text-sm text-gray-700">
//                   Selected Customers: <span className="font-medium">{(filters.customerIds || []).length}</span>
//                 </div>
//                 <div>
//                   <button onClick={clearCompanySelections} className="text-sm text-gray-500 hover:text-gray-700">
//                     Clear selection
//                   </button>
//                 </div>
//               </div>

//               {/* Company list */}
//               <div className="max-h-56 overflow-auto border rounded p-2 bg-white">
//                 {companiesLoading ? (
//                   <div className="flex justify-center items-center py-6 text-sm text-gray-500">Loading companies…</div>
//                 ) : renderedCompanyResults && renderedCompanyResults.length > 0 ? (
//                   renderedCompanyResults.map((c: any) => {
//                     const checked = isCompanySelected(c.id);
//                     return (
//                       <label key={c.id} className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded">
//                         <div className="flex items-center space-x-3 min-w-0">
//                           <input
//                             type="checkbox"
//                             checked={checked}
//                             onChange={() => toggleCompanySelection(c.id)}
//                             className="rounded border-gray-300"
//                           />
//                           <div className="min-w-0">
//                             <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
//                             <div className="text-xs text-gray-500 truncate">{c.domain || c.website || ""}</div>
//                           </div>
//                         </div>
//                         <div className="text-xs text-gray-400 ml-3">{c.status || ""}</div>
//                       </label>
//                     );
//                   })
//                 ) : (
//                   <div className="text-sm text-gray-500 p-3">No companies found. Try a different search or clear the search to see all.</div>
//                 )}
//               </div>

//               {/* NOTE: "Selected IDs" line removed per request (we do not show IDs on the screen anymore) */}
//             </div>
//           </div>

//           {/* Buttons area: moved to bottom-right of filter area */}
//           <div className="mt-4 flex justify-end">
//             <div className="flex items-center space-x-3">
//               {/* Clear All resets current filters */}
//               <button
//                 onClick={clearAll}
//                 className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 title="Clear all filters and company selections"
//               >
//                 Clear all
//               </button>

//               {/* Clear saved: enabled when savedPreference exists */}
//               <button
//                 onClick={clearSavedPreference}
//                 className={`px-3 py-1 rounded text-sm ${
//                   savedPreference ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-100 text-gray-500 cursor-not-allowed"
//                 }`}
//                 title="Clear saved preference"
//                 disabled={!savedPreference}
//               >
//                 Clear saved
//               </button>

//               {/* Save: enabled when there are any filters selected */}
//               <button
//                 onClick={saveCurrentPreference}
//                 className={`px-3 py-1 rounded text-sm ${
//                   (filters.customerIds || []).length > 0 ||
//                   (filters.firmTypes || []).length > 0 ||
//                   (filters.sectors || []).length > 0 ||
//                   (filters.aum || []).length > 0 ||
//                   (filters.buySell || []).length > 0
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 text-gray-500 cursor-not-allowed"
//                 }`}
//                 title="Save selected filters & companies as your preference"
//                 disabled={
//                   !(
//                     (filters.customerIds || []).length > 0 ||
//                     (filters.firmTypes || []).length > 0 ||
//                     (filters.sectors || []).length > 0 ||
//                     (filters.aum || []).length > 0 ||
//                     (filters.buySell || []).length > 0
//                   )
//                 }
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default FilterPanel;


















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

  // ✅ MULTI-SELECT TOGGLE
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

  // ✅ NEW: sort selected options to top (GENERIC)
  const sortWithSelectedFirst = (options: string[], selected: string[]) => {
    const selectedSet = new Set(selected);
    const selectedItems: string[] = [];
    const unselectedItems: string[] = [];

    for (const opt of options) {
      if (selectedSet.has(opt)) selectedItems.push(opt);
      else unselectedItems.push(opt);
    }

    return [...selectedItems, ...unselectedItems];
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

            {/* Investor Category */}
            <div>
              <h4 className="text-sm font-medium mb-2">Investor Category</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {sortWithSelectedFirst(
                  investorCategoryOptions,
                  filters.firmTypes
                ).map((opt) => (
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

            {/* Sector Focus */}
            <div>
              <h4 className="text-sm font-medium mb-2">Sector Focus</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {sortWithSelectedFirst(
                  sectorOptions,
                  filters.sectors
                ).map((opt) => (
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

            {/* AUM */}
            <div>
              <h4 className="text-sm font-medium mb-2">AUM</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {sortWithSelectedFirst(
                  aumOptions,
                  filters.aum
                ).map((opt) => (
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

            {/* Buy / Sell */}
            <div>
              <h4 className="text-sm font-medium mb-2">Buy / Sell</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {sortWithSelectedFirst(
                  buySellOptions,
                  filters.buySell
                ).map((opt) => (
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

            {/* Customer (Company) */}
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

