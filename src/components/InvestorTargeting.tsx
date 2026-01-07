// src/components/InvestorTargeting.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import MetricsPanel from "./MetricsPanel";
import FilterPanel from "./FilterPanel";
import InvestorCard from "./InvestorCard";
import InvestorDetailDrawer from "./InvestorDetailDrawer";
import {
    getInvestorTargetingList,
    getInvestorsInList,
    removeInvestorFromListById,
    bulkRemoveInvestorsFromList,
    addInvestorToList,
    getMeetingsForInvestor, // 🔹 to read meeting_status from meetings table
} from "../services/investorService";
import debounce from "lodash/debounce";
import { Trash2 } from "lucide-react";

type FiltersShape = {
    firmTypes: string[];
    sectors: string[];
    aum: string[];
    buySell: string[];
    customerIds?: string[];
};

type ListViewType =
    | "matching"
    | "all"
    | "interested"
    | "followups"
    | "not_interested"
    | "meeting"; // list_type = 'meeting'

type DrawerInitialMode =
    | "interested"
    | "followups"
    | "not_interested"
    | "meetings"
    | null;

const SAVED_KEY = "investorTargeting_saved_companies_v1";

const InvestorTargeting: React.FC = () => {
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Controlled input for the search bar (immediate)
    const [searchInput, setSearchInput] = useState("");
    // Actual search token sent to backend (debounced)
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<FiltersShape>({
        firmTypes: [],
        sectors: [],
        aum: [],
        buySell: [],
        customerIds: [],
    });

    // Pagination
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(12);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalResults, setTotalResults] = useState<number>(0);

    // ----- LIST view states -----
    const [listView, setListView] = useState<ListViewType>("matching");
    const [listItems, setListItems] = useState<any[]>([]);
    const [selectedListIds, setSelectedListIds] = useState<number[]>([]);
    const [listLoading, setListLoading] = useState(false);

    // counts for buttons
    const [counts, setCounts] = useState<{
        interested: number;
        followups: number;
        not_interested: number;
        meetings: number; // legacy mirror of interested; no tab now
        meeting: number; // list_type = 'meeting'
    }>({
        interested: 0,
        followups: 0,
        not_interested: 0,
        meetings: 0,
        meeting: 0,
    });

    // 🔹 cache full list items for accurate company-based counts
    const [allListItems, setAllListItems] = useState<{
        interested: any[];
        followups: any[];
        not_interested: any[];
        meeting: any[];
    }>({
        interested: [],
        followups: [],
        not_interested: [],
        meeting: [],
    });


    const [filtersReady, setFiltersReady] = useState(false);
    // track current load to prevent duplicate concurrent loads
    const currentLoadRef = useRef<string | null>(null);

    // Drawer state for investor details
    const [openInvestorId, setOpenInvestorId] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerInitialActionMode, setDrawerInitialActionMode] =
        useState<DrawerInitialMode>(null);

    // 🔹 Meeting tab filter: "all" (default when Meeting clicked) / "scheduled" / "completed"
    const [meetingStatusFilter, setMeetingStatusFilter] = useState<
        "all" | "scheduled" | "completed"
    >("all");

    // 🔹 Map (investor_id + company_id) -> latest meeting_status from meetings table
    const [meetingStatusMap, setMeetingStatusMap] = useState<
        Record<string, string>
    >({});

    // -------------------------
    // Auto-apply saved preference on initial load (if present)
    // -------------------------
    useEffect(() => {
        try {
            const raw = localStorage.getItem(SAVED_KEY);
            if (!raw) {
                setFiltersReady(true);
                return;
            }

            const parsed = JSON.parse(raw);
            let pref: any;

            if (Array.isArray(parsed)) {
                pref = { customerIds: parsed.map(String), firmTypes: [], sectors: [], aum: [], buySell: [] };
            } else if (parsed && typeof parsed === "object") {
                pref = {
                    customerIds: Array.isArray(parsed.customerIds) ? parsed.customerIds.map(String) : [],
                    firmTypes: Array.isArray(parsed.firmTypes) ? parsed.firmTypes : [],
                    sectors: Array.isArray(parsed.sectors) ? parsed.sectors : [],
                    aum: Array.isArray(parsed.aum) ? parsed.aum : [],
                    buySell: Array.isArray(parsed.buySell) ? parsed.buySell : [],
                };
            } else {
                setFiltersReady(true);
                return;
            }

            setFilters((prev) => ({
                ...prev,
                ...pref,
            }));

            setPage(1);
            setFiltersReady(true);
        } catch (err) {
            console.error("Failed to auto-apply saved preference", err);
            setFiltersReady(true);
        }
    }, []);


    // Build query object
    const buildQueryParams = () => {
        const params: any = {};
        if (search && search.trim() !== "") params.search = search.trim();

        if (filters.sectors && filters.sectors.length)
            params.sectors = filters.sectors;
        if (filters.firmTypes && filters.firmTypes.length)
            params.firmTypes = filters.firmTypes;
        if (filters.aum && filters.aum.length) params.aum = filters.aum;
        if (filters.buySell && filters.buySell.length)
            params.buySell = filters.buySell;

        if (filters.customerIds && filters.customerIds.length) {
            params.company_ids = filters.customerIds.join(",");
        }

        params.page = page;
        params.limit = limit;

        return params;
    };

    const fetchList = async (params: any) => {
        setLoading(true);
        try {
            const data = await getInvestorTargetingList(params);
            if (data?.investors) {
                setInvestors(data.investors);
                setTotalResults(data.pagination?.total || 0);
                setTotalPages(data.pagination?.pages || 0);
            } else {
                setInvestors(Array.isArray(data) ? data : []);
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
                setPage(1); // reset page when search changes
                setSearch(val);
            }, 500),
        []
    );

    const onSearchInputChange = (v: string) => {
        setSearchInput(v);
        if (v.trim() === "") {
            debouncedSetSearch.cancel();
            setSearch("");
            setPage(1);
        } else {
            debouncedSetSearch(v);
        }
    };

    useEffect(() => {
        return () => {
            debouncedSetSearch.cancel();
        };
    }, [debouncedSetSearch]);

    // trigger fetch on search/filters/page change (when viewing matching)
    useEffect(() => {
        if (!filtersReady) return;

        if (listView === "matching") {
            const params = buildQueryParams();
            fetchList(params);
        }
    }, [search, filters, page, listView, filtersReady]);


    // useEffect(() => {
    //     // initial load: load matching investors + refresh counts
    //     const params = buildQueryParams();
    //     fetchList(params).catch(() => { });
    //     refreshListCounts().catch(() => { });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const handleFilterChange = (f: FiltersShape) => {
        setFilters(f);
        setPage(1);
    };

    const goToPage = (p: number) => {
        if (p < 1) p = 1;
        if (totalPages && p > totalPages) p = totalPages;
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // helper to consistently extract investor_id from any list item
    const getInvestorIdFromListItem = (item: any): string => {
        return String(
            item.investor_id ||
            item.snapshot?.investor_id ||
            item.snapshot?.id ||
            item.id ||
            ""
        );
    };

    // helper to consistently extract company_id from any list item
    const getCompanyIdFromListItem = (item: any): string | null => {
        const cid =
            item.company_id ||
            item.snapshot?.company_id ||
            item.snapshot?.company?.id ||
            null;
        return cid ? String(cid) : null;
    };

    // key for meetingStatusMap
    const meetingKey = (investorId: string, companyId: string | null) =>
        `${investorId}||${companyId ?? ""}`;

    // 🔹 read meeting_status for a meeting list item:
    //    1) first from meetings table (meetingStatusMap)
    //    2) fallback to snapshot / item fields
    const getMeetingStatusFromListItem = (item: any): string => {
        const investorId = getInvestorIdFromListItem(item);
        const companyId = getCompanyIdFromListItem(item);
        const key = meetingKey(investorId, companyId);

        const mapped = meetingStatusMap[key];
        if (mapped) return String(mapped).toLowerCase();

        const snap = item?.snapshot || {};
        const meeting = snap.meeting || item.meeting || {};
        const sched = snap.scheduling || {};

        const raw =
            meeting.meeting_status ||
            meeting.status ||
            snap.meeting_status ||
            item.meeting_status ||
            sched.status ||
            "";
        return String(raw || "scheduled").toLowerCase();
    };

    // 🔹 load meeting_status from meetings table for all meeting list items
    const refreshMeetingStatusMap = async (items: any[]) => {
        const groupedByInvestor: Record<string, Set<string>> = {};

        items.forEach((it) => {
            const inv = getInvestorIdFromListItem(it);
            const cid = getCompanyIdFromListItem(it);
            if (!inv || !cid) return;
            if (!groupedByInvestor[inv]) groupedByInvestor[inv] = new Set();
            groupedByInvestor[inv].add(cid);
        });

        const newMap: Record<string, string> = {};

        const investorIds = Object.keys(groupedByInvestor);
        for (const invId of investorIds) {
            try {
                const res = await getMeetingsForInvestor(invId);
                const meetings = (res?.items || res || []) as any[];
                if (!meetings || meetings.length === 0) continue;

                const companyIds = Array.from(groupedByInvestor[invId]);
                companyIds.forEach((cid) => {
                    const related = meetings.filter(
                        (m) => String(m.company_id || "") === String(cid)
                    );
                    if (!related.length) return;

                    const latest = related.reduce((acc, cur) => {
                        const accTime = new Date(
                            acc.meeting_datetime || acc.created_at || 0
                        ).getTime();
                        const curTime = new Date(
                            cur.meeting_datetime || cur.created_at || 0
                        ).getTime();
                        return curTime > accTime ? cur : acc;
                    });

                    const status =
                        latest.meeting_status || latest.status || "scheduled";
                    newMap[meetingKey(invId, cid)] = String(status).toLowerCase();
                });
            } catch (err) {
                console.error("Failed to fetch meetings for investor", invId, err);
            }
        }

        if (Object.keys(newMap).length) {
            setMeetingStatusMap((prev) => ({ ...prev, ...newMap }));
        }
    };

    // ----- list helpers -----
    const loadList = async (
        listType:
            | "interested"
            | "followups"
            | "not_interested"
            | "all"
            | "matching"
            | "meeting"
    ) => {
        if (currentLoadRef.current === listType && listLoading) {
            return;
        }

        if (listView !== listType) setListView(listType);

        setSelectedListIds([]);

        if (listType === "matching") {
            const params = buildQueryParams();
            currentLoadRef.current = "matching";
            try {
                await fetchList(params);
                setListItems([]); // matching uses investors[] not listItems
            } finally {
                currentLoadRef.current = null;
            }
            return;
        }


        setListLoading(true);
        currentLoadRef.current = listType;
        try {
            if (listType === "all") {
                const params = buildQueryParams();

                // ✅ Reuse SAME backend filtering logic as Matching tab
                const data = await getInvestorTargetingList({
                    ...params,
                    includeLists: true, // backend already supports this
                });

                setListItems(data?.investors || []);
                return; // ⛔ IMPORTANT: prevents falling into other branches
            }

            else if (listType === "meeting") {
                // 🔹 Meeting list – ALWAYS load ALL meeting items (scheduled + completed)
                let res;
                try {
                    res = await getInvestorsInList("meeting");
                } catch (err) {
                    console.error("getInvestorsInList('meeting') failed", err);
                    res = { items: [] as any[] };
                }
                const allItems = res?.items || [];

                setListItems(allItems);
                setCounts((prev) => ({
                    ...prev,
                    meeting: allItems.length,
                }));

                // Load real statuses from meetings table (used for filters)
                await refreshMeetingStatusMap(allItems);
            } else {
                // specific list (interested / followups / not_interested)
                let res;
                try {
                    res = await getInvestorsInList(listType);
                } catch (err) {
                    console.error("getInvestorsInList failed", err);
                    res = { items: [] as any[] };
                }
                const items = res?.items || [];

                setListItems(items);

                setCounts((prev) => ({
                    ...prev,
                    ...(listType === "interested"
                        ? { interested: items.length, meetings: items.length }
                        : {}),
                    ...(listType === "followups" ? { followups: items.length } : {}),
                    ...(listType === "not_interested" ? { not_interested: items.length } : {}),
                }));
            }
        } catch (err) {
            console.error("loadList error", err);
            setListItems([]);
        } finally {
            setListLoading(false);
            currentLoadRef.current = null;
        }
    };

    const handleDeleteSingleFromList = async (id: number) => {
        try {
            await removeInvestorFromListById(id);
            await loadList(listView);
            await refreshListCounts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleBulkDeleteSelected = async () => {
        try {
            for (const id of selectedListIds) {
                await removeInvestorFromListById(id);
            }
            await loadList(listView);
            setSelectedListIds([]);
            await refreshListCounts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAllInList = async () => {
        try {
            await bulkRemoveInvestorsFromList(listView);
            await loadList(listView);
            await refreshListCounts();
        } catch (err) {
            console.error(err);
        }
    };

    // refresh counts for Interested/Followups/Not Interested/Meeting
    const refreshListCounts = async () => {
        try {
            const [iRes, fRes, nRes, mRes] = await Promise.all([
                (async () => {
                    try {
                        return await getInvestorsInList("interested");
                    } catch {
                        return { items: [] as any[] };
                    }
                })(),
                (async () => {
                    try {
                        return await getInvestorsInList("followups");
                    } catch {
                        return { items: [] as any[] };
                    }
                })(),
                (async () => {
                    try {
                        return await getInvestorsInList("not_interested");
                    } catch {
                        return { items: [] as any[] };
                    }
                })(),
                (async () => {
                    try {
                        return await getInvestorsInList("meeting");
                    } catch {
                        return { items: [] as any[] };
                    }
                })(),
            ]);
            const interestedCount = (iRes?.items || []).length;
            const iItems = iRes?.items || [];
            const fItems = fRes?.items || [];
            const nItems = nRes?.items || [];
            const mItems = mRes?.items || [];

            setCounts({
                interested: iItems.length,
                followups: fItems.length,
                not_interested: nItems.length,
                meetings: iItems.length,
                meeting: mItems.length,
            });

            // 🔹 STORE full data for filteredCounts
            setAllListItems({
                interested: iItems,
                followups: fItems,
                not_interested: nItems,
                meeting: mItems,
            });

        } catch (err) {
            console.error("refreshListCounts error", err);
        }
    };

    // Event handler for optimistic UI updates coming from InvestorCard / Drawer
    useEffect(() => {
        const handler = (e: Event) => {
            const ev = e as CustomEvent;
            const payload = ev.detail;
            if (!payload) return;

            const { action, listType, item, tempId, serverItem } = payload;

            if (action === "added") {
                setCounts((prev) => {
                    const next = { ...prev } as any;
                    if (listType === "interested") {
                        next.interested = (prev as any).interested + 1;
                        next.meetings = (prev as any).meetings + 1;
                    } else if (listType === "followups") {
                        next.followups = (prev as any).followups + 1;
                    } else if (listType === "not_interested") {
                        next.not_interested = (prev as any).not_interested + 1;
                    } else if (listType === "meeting") {
                        next.meeting = (prev as any).meeting + 1;
                    }
                    return next;
                });

                if (listView === listType || listView === "all") {
                    setListItems((prev) => {
                        const exists = prev.some(
                            (it: any) =>
                                it.investor_id === item.investor_id ||
                                it.snapshot?.id === item.snapshot?.id ||
                                it.id === item.id
                        );
                        if (exists) return prev;
                        return [item, ...prev];
                    });
                }
            }

            if (action === "confirmed" && tempId) {
                setListItems((prev) =>
                    prev.map((it: any) => (it.id === tempId ? serverItem : it))
                );
            }

            if (action === "removed") {
                setCounts((prev) => {
                    const next = { ...prev } as any;
                    if (listType === "interested") {
                        next.interested = Math.max(0, (prev as any).interested - 1);
                        next.meetings = Math.max(0, (prev as any).meetings - 1);
                    } else if (listType === "followups") {
                        next.followups = Math.max(0, (prev as any).followups - 1);
                    } else if (listType === "not_interested") {
                        next.not_interested = Math.max(
                            0,
                            (prev as any).not_interested - 1
                        );
                    } else if (listType === "meeting") {
                        next.meeting = Math.max(0, (prev as any).meeting - 1);
                    }
                    return next;
                });
                setListItems((prev) =>
                    prev.filter(
                        (it: any) =>
                            !(
                                it.id === item.id ||
                                it.investor_id === item.investor_id
                            )
                    )
                );
            }
        };

        window.addEventListener("investorListChanged", handler as EventListener);

        return () => {
            window.removeEventListener(
                "investorListChanged",
                handler as EventListener
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listView]);

    useEffect(() => {
        refreshListCounts().catch(() => { });
    }, []);

    useEffect(() => {
        const handler = () => {
            refreshListCounts().catch(() => { });
            // if we are on Meeting tab and a meeting changes, reload list + statuses
            if (listView === "meeting") {
                loadList("meeting").catch(() => { });
            }
        };
        window.addEventListener("investorMeetingCreated", handler);
        window.addEventListener("investorFollowupCreated", handler);
        window.addEventListener("investorInteractionCreated", handler);
        return () => {
            window.removeEventListener("investorMeetingCreated", handler);
            window.removeEventListener("investorFollowupCreated", handler);
            window.removeEventListener("investorInteractionCreated", handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listView]);

    /* ----------------------------------------------------
       🔹 QUICK "INTERESTED" FROM FOLLOWUPS (no modal)
    ----------------------------------------------------- */
    const quickMarkInterestedFromFollowups = async (investorId: string) => {
        // Try to find the current list item to reuse its snapshot
        const baseItem = listItems.find((it: any) => {
            const snapId =
                it.snapshot?.investor_id ||
                it.snapshot?.id ||
                it.investor_id ||
                it.id;
            return String(snapId) === String(investorId);
        });

        const snapshot = baseItem?.snapshot
            ? { ...baseItem.snapshot }
            : { id: investorId };

        // ensure list_type is interested in snapshot (helps UI)
        (snapshot as any).list_type = "interested";

        const optimisticTempId = `tmp-int-${Date.now()}-${Math.floor(
            Math.random() * 10000
        )}`;

        const optimisticItem: any = {
            id: optimisticTempId,
            investor_id: investorId,
            list_type: "interested",
            snapshot,
            _optimistic: true,
        };

        // optimistic add to lists (and increments counts via listener)
        window.dispatchEvent(
            new CustomEvent("investorListChanged", {
                detail: {
                    action: "added",
                    listType: "interested",
                    item: optimisticItem,
                },
            })
        );

        try {
            const payload: any = {
                investor_id: investorId,
                list_type: "interested",
                snapshot,
            };

            const added = await addInvestorToList(payload);
            const serverSnapshot = added?.snapshot || snapshot;
            const serverItem = { ...(added || {}), snapshot: serverSnapshot };

            window.dispatchEvent(
                new CustomEvent("investorListChanged", {
                    detail: {
                        action: "confirmed",
                        listType: "interested",
                        tempId: optimisticTempId,
                        serverItem,
                    },
                })
            );

            // keep counts fully accurate
            await refreshListCounts().catch(() => { });

            alert("Investor added to Interested list");
        } catch (err) {
            console.error("quickMarkInterestedFromFollowups error", err);
            window.dispatchEvent(
                new CustomEvent("investorListChanged", {
                    detail: {
                        action: "removed",
                        listType: "interested",
                        item: { id: optimisticTempId, investor_id: investorId },
                        error: err,
                    },
                })
            );
            alert("Failed to add investor to Interested");
        }
    };

    // When a card is clicked, open drawer with investor id (and optional initial mode)
    const openInvestorDrawer = (
        investorId: string,
        mode?: DrawerInitialMode
    ) => {
        if (listView === "followups" && mode === "interested") {
            quickMarkInterestedFromFollowups(investorId);
            return;
        }

        setOpenInvestorId(investorId);
        setDrawerInitialActionMode(mode ?? null);
        setDrawerOpen(true);
        refreshListCounts().catch(() => { });
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setOpenInvestorId(null);
        setDrawerInitialActionMode(null);
    };

    // 🔹 Items actually displayed in UI:
    //    - Meeting tab: filter by Scheduled / Completed
    //    - All other list tabs: show all listItems
    //    - PLUS: when Customer (Company) filter is used, narrow to those companies
    const companyFilterActive =
        !!filters.customerIds && filters.customerIds.length > 0;

    let displayedListItems =
        listView === "meeting"
            ? listItems.filter((item) => {
                const status = getMeetingStatusFromListItem(item);
                if (meetingStatusFilter === "scheduled") {
                    return status === "scheduled";
                }
                if (meetingStatusFilter === "completed") {
                    return status === "completed";
                }
                // "all" – show everything
                return true;
            })
            : listItems;

    if (companyFilterActive && listView !== "matching") {
        // For Interested / Followups / Not Interested / Meeting:
        // keep only items whose company_id matches any selected Customer (Company)
        const selectedCompanyIds = (filters.customerIds || []).map(String);
        displayedListItems = displayedListItems.filter((item) => {
            const cid = getCompanyIdFromListItem(item);
            return cid ? selectedCompanyIds.includes(String(cid)) : false;
        });
    }

    if (companyFilterActive && listView !== "matching") {
        const selectedCompanyIds = (filters.customerIds || []).map(String);
        displayedListItems = displayedListItems.filter((item) => {
            const cid = getCompanyIdFromListItem(item);
            return cid ? selectedCompanyIds.includes(String(cid)) : false;
        });
    }

    /* 🔹 ADD THIS BLOCK HERE — EXACTLY HERE */
    const filteredCounts = useMemo(() => {
        if (!companyFilterActive) return counts;

        const selectedCompanyIds = (filters.customerIds || []).map(String);

        const byCompany = (items: any[]) =>
            items.filter((item) => {
                const cid = getCompanyIdFromListItem(item);
                return cid && selectedCompanyIds.includes(cid);
            });

        return {
            interested: byCompany(allListItems.interested).length,
            followups: byCompany(allListItems.followups).length,
            not_interested: byCompany(allListItems.not_interested).length,
            meetings: byCompany(allListItems.interested).length,
            meeting: byCompany(allListItems.meeting).length,
        };
    }, [companyFilterActive, filters.customerIds, allListItems, counts]);



    // -------- Preference persistence handlers (localStorage) --------
    const handleSavePreferences = () => {
        try {
            const ids = filters.customerIds || [];
            localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
            alert("Saved company preference.");
        } catch (err) {
            console.error("Failed to save preferences", err);
            alert("Failed to save preference.");
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <Header
                searchValue={searchInput}
                onSearch={(v: string) => onSearchInputChange(v)}
            />

            <main className="flex-1 p-6 overflow-auto">
                <MetricsPanel />

                <div className="mb-6">
                    <FilterPanel
                        onChange={(f) => handleFilterChange(f)}
                        initial={filters}
                    />
                </div>

                {/* ====== LIST-FILTER BAR ====== */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-11 mb-6">
                    {/* TOP ROW: tabs */}
                    <div className="flex items-center justify-between">
                        {/* LEFT SIDE: tabs */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => loadList("matching")}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${listView === "matching"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-50 text-gray-700 border border-gray-200"
                                    }`}
                            >
                                All
                            </button>

                            <button
                                onClick={() => loadList("interested")}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${listView === "interested"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-50 text-gray-700 border border-gray-200"
                                    }`}
                            >
                                {`Interested (${companyFilterActive ? filteredCounts.interested : counts.interested})`}
                            </button>

                            <button
                                onClick={() => loadList("followups")}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${listView === "followups"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-50 text-gray-700 border border-gray-200"
                                    }`}
                            >
                                {`Followups (${companyFilterActive ? filteredCounts.followups : counts.followups})`}
                            </button>

                            <button
                                onClick={() => loadList("not_interested")}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${listView === "not_interested"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-50 text-gray-700 border border-gray-200"
                                    }`}
                            >
                                {`Not Interested (${companyFilterActive ? filteredCounts.not_interested : counts.not_interested})`}
                            </button>

                            {/* Meeting investor list (list_type = 'meeting') */}
                            {/* Modified: render Meeting button and show Scheduled/Done buttons absolutely below it so Meeting stays aligned */}
                            <div className="relative inline-flex"> {/* inline-flex keeps Meeting aligned with other buttons */}
                                <button
                                    onClick={() => {
                                        setMeetingStatusFilter("all"); // ➜ first show ALL cards
                                        loadList("meeting");
                                    }}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${listView === "meeting"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-50 text-gray-700 border border-gray-200"
                                        }`}
                                >
                                    {`Meeting (${companyFilterActive ? filteredCounts.meeting : counts.meeting})`}
                                </button>

                                {/* absolutely positioned so it doesn't affect layout/height of the tabs row */}
                                {listView === "meeting" && (
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex space-x-2 z-10">
                                        <button
                                            onClick={() => setMeetingStatusFilter("scheduled")}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${meetingStatusFilter === "scheduled"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }`}
                                        >
                                            Scheduled
                                        </button>
                                        <button
                                            onClick={() => setMeetingStatusFilter("completed")}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${meetingStatusFilter === "completed"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }`}
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE: removed Save (moved into FilterPanel) */}
                        <div className="flex items-center space-x-3">
                            {/* intentionally left empty */}
                        </div>
                    </div>

                    {/* NOTE: Second row for Meeting filters removed — buttons now live under the Meeting tab button above (absolutely positioned). */}
                </div>

                {/* ====== Matching Investors / Lists ====== */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {listView === "matching"
                                ? `Matching Investors (${totalResults})`
                                : listView === "all"
                                    ? `All Lists (${displayedListItems.length})`
                                    : `${listView
                                        .charAt(0)
                                        .toUpperCase() + listView.slice(1).replace("_", " ")
                                    } (${displayedListItems.length})`}
                            {companyFilterActive &&
                                listView !== "matching" &&
                                " — Filtered by selected companies"}
                        </h2>
                        <div />
                    </div>

                    {listView === "matching" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl-grid-cols-3 gap-6">
                            {loading ? (
                                <p>Loading investors...</p>
                            ) : investors.length === 0 ? (
                                <p>No investors match the selected filters.</p>
                            ) : (
                                investors.map((investor) => (
                                    <InvestorCard
                                        key={investor.id}
                                        investor={investor}
                                        onOpenDetails={(id: string) =>
                                            openInvestorDrawer(String(id))
                                        }
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        <div>
                            {listLoading ? (
                                <p>Loading list...</p>
                            ) : displayedListItems.length === 0 ? (
                                <p className="text-sm text-gray-500">No items in this list.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedListItems.map((item) => {
                                        const snapshot = item.snapshot
                                            ? { ...item.snapshot }
                                            : { ...item };
                                        snapshot.list_type =
                                            snapshot.list_type || item.list_type || listView;
                                        snapshot.investor_id =
                                            snapshot.investor_id ||
                                            snapshot.id ||
                                            item.investor_id ||
                                            item.id;
                                        return (
                                            <div key={item.id} className="relative">
                                                <InvestorCard
                                                    investor={snapshot}
                                                    contextListType={listView}
                                                    onOpenDetails={(
                                                        id: string,
                                                        mode?: DrawerInitialMode
                                                    ) => openInvestorDrawer(String(id), mode)}
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleDeleteSingleFromList(item.id)
                                                    }
                                                    className="absolute top-3 right-3 p-1 bg-white rounded-full border shadow-sm z-[60]"
                                                    title="Remove from list"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                                <label className="absolute top-3 left-3 inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedListIds.includes(item.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked)
                                                                setSelectedListIds((prev) => [
                                                                    ...prev,
                                                                    item.id,
                                                                ]);
                                                            else
                                                                setSelectedListIds((prev) =>
                                                                    prev.filter((x) => x !== item.id)
                                                                );
                                                        }}
                                                        className="rounded border-gray-300"
                                                    />
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination (only for 'matching' view) */}
                {listView === "matching" && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing page{" "}
                            <span className="font-medium">{page}</span> of{" "}
                            <span className="font-medium">{totalPages || 1}</span>
                            {totalResults ? ` — ${totalResults} results` : ""}
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => goToPage(page - 1)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <div className="flex items-center space-x-1">
                                {(() => {
                                    const pages = [];
                                    const maxVisible = 5;
                                    const half = Math.floor(maxVisible / 2);
                                    let start = Math.max(1, page - half);
                                    let end = Math.min(
                                        totalPages || 1,
                                        start + maxVisible - 1
                                    );
                                    if (end - start < maxVisible - 1) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }
                                    for (let i = start; i <= end; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => goToPage(i)}
                                                className={`px-3 py-2 rounded-lg text-sm ${page === i
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    return pages;
                                })()}
                            </div>

                            <button
                                disabled={totalPages ? page === totalPages : true}
                                onClick={() => goToPage(page + 1)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Drawer - investor detail */}
            {drawerOpen && openInvestorId && (
                <InvestorDetailDrawer
                    investorId={openInvestorId}
                    onClose={closeDrawer}
                    initialActionMode={drawerInitialActionMode || undefined}
                    selectedCompanyIds={filters.customerIds}
                />
            )}
        </div>
    );
};

export default InvestorTargeting;







