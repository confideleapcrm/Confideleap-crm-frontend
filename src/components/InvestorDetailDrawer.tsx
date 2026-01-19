// src/components/InvestorDetailDrawer.tsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { X, Copy, Link as LinkIcon, ChevronDown } from "lucide-react";
import {
  getInvestorById,
  addInvestorToList,
  createMeeting,
  createFollowup,
  createInteraction,
  getMeetingsForInvestor,
  getFollowupsForInvestor,
  generateMeetForMeeting,
  updateMeeting,
  updateFollowup,
  getInteractionsForInvestor,
  getInvestorsInList,
  updateInvestorList,
  removeInvestorFromListById,
} from "../services/investorService";
import { getCompanies } from "../services/companyService";
import debounce from "lodash/debounce";

type ScheduleMode = "interested" | "followups" | "not_interested";
type InitialActionMode = ScheduleMode | "meetings" | null;

type ScheduleContext = "normal" | "meetingOnly" | "interestedMeta";

type Props = {
  investorId: string;
  onClose: () => void;
  initialActionMode?: InitialActionMode;
  // optional: company filter coming from main page (InvestorTargeting)
  selectedCompanyIds?: string[] | null;
};

/* ======================= helper: generate per-row unique key ======================= */
const makeClientRowKey = (investorId: string | number, companyId: string | null) => {
  // Unique key for each investor+company row on the client. Non-invasive field.
  return `${investorId}::${companyId ?? "null"}::${Date.now()}::${Math.floor(Math.random() * 10000)}`;
};

/* ======================= SCHEDULE MODAL (now INLINE) ======================= */

const ScheduleModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSchedule: (payload: any) => Promise<void>;
  initialType?: "virtual" | "physical";
  initialDate?: string;
  mode?: ScheduleMode;
  context?: ScheduleContext;
  // NEW: parent filter props
  parentFilterActive?: boolean;
  parentCompanyOptions?: any[];
}> = ({
  open,
  onClose,
  onSchedule,
  initialType = "virtual",
  initialDate,
  mode = "interested",
  context = "normal",
  parentFilterActive = false,
  parentCompanyOptions = [],
}) => {
    const [meetingType, setMeetingType] = useState<"virtual" | "physical">(
      initialType
    );
    const [meetingDateTime, setMeetingDateTime] = useState<string>(
      initialDate || ""
    );
    const notesRef = useRef<HTMLTextAreaElement | null>(null);
    const [companyQueryLocal, setCompanyQueryLocal] = useState("");
    const [companyResultsLocal, setCompanyResultsLocal] = useState<any[]>([]);
    const [companySearchingLocal, setCompanySearchingLocal] = useState(false);
    const [selectedCompanyLocal, setSelectedCompanyLocal] = useState<any | null>(
      null
    );
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const doLocalCompanySearch = useMemo(
      () =>
        debounce(async (q: string) => {
          if (!q || q.trim().length < 1) {
            setCompanyResultsLocal([]);
            setCompanySearchingLocal(false);
            return;
          }
          setCompanySearchingLocal(true);
          try {
            const res = await getCompanies({ search: q, limit: 8 });
            const companies = res?.companies ?? res?.data ?? res ?? [];
            setCompanyResultsLocal(Array.isArray(companies) ? companies : []);
          } catch (err) {
            console.error("company search failed", err);
            setCompanyResultsLocal([]);
          } finally {
            setCompanySearchingLocal(false);
          }
        }, 300),
      []
    );

    useEffect(() => {
      if (!open) return;
      // If parent filter isn't active, continue the normal search behavior
      if (!parentFilterActive) doLocalCompanySearch(companyQueryLocal);
      return () => doLocalCompanySearch.cancel();
    }, [companyQueryLocal, doLocalCompanySearch, open, parentFilterActive]);

    useEffect(() => {
      if (open) {
        setMeetingType(initialType);
        setMeetingDateTime(initialDate || "");
        if (notesRef.current) notesRef.current.value = "";
        setCompanyQueryLocal("");
        setCompanyResultsLocal([]);
        setSelectedCompanyLocal(null);
        setHasSubmitted(false);
      }
    }, [open, initialType, initialDate, parentFilterActive, parentCompanyOptions]);

    useEffect(() => {
      // If parent filter is active and exactly one parent company option exists, preselect it
      if (open && parentFilterActive && Array.isArray(parentCompanyOptions) && parentCompanyOptions.length === 1) {
        setSelectedCompanyLocal(parentCompanyOptions[0]);
      }
    }, [open, parentFilterActive, parentCompanyOptions]);

    if (!open) return null;

    const title =
      mode === "interested"
        ? context === "interestedMeta"
          ? "Interested — Add Company & Notes"
          : "Schedule Meeting"
        : mode === "followups"
          ? "Schedule Follow-up"
          : "Not Interested — Add Comment";

    const primaryLabel =
      mode === "not_interested" ||
        (mode === "interested" && context === "interestedMeta")
        ? "Save"
        : "Schedule";

    // small helper to show status text from company object
    const companyStatusText = (c: any) => {
      if (!c) return "";
      if (c.status) return c.status;
      if (c.active !== undefined) return c.active ? "Active" : "Inactive";
      if (c.isActive !== undefined) return c.isActive ? "Active" : "Inactive";
      return c.state || "";
    };

    // ---------- INLINE RENDER ----------
    return (
      <div className="mt-3 p-4 border rounded bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        {/* Company selector */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-2">
            Company {context === "interestedMeta" ? "" : "(optional)"}
          </label>

          {/* If parent filter active → show only those companies as a selectable list (no search) */}
          {parentFilterActive && Array.isArray(parentCompanyOptions) && parentCompanyOptions.length > 0 ? (
            <div className="max-h-48 overflow-auto border rounded p-2">
              {parentCompanyOptions.map((c: any) => {
                const cid = String(c.id ?? c.company_id ?? c.companyId ?? c.uuid ?? c._id ?? "");
                const selectedId = String(selectedCompanyLocal?.id ?? selectedCompanyLocal?.company_id ?? "");
                const isSelected = selectedId === cid;

                return (
                  <div
                    key={cid}
                    className={`flex items-start gap-3 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : ""}`}
                    onClick={() => setSelectedCompanyLocal(c)}
                  >
                    {/* visual checkbox (controlled, still single-select) */}
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        readOnly
                        checked={isSelected}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate">
                          {c.name || c.company_name || c.title || c.label}
                        </div>
                        <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                          {companyStatusText(c)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1">
                        {c.website ?? c.web ?? ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // fallback to legacy behaviour: search + autocomplete
            selectedCompanyLocal ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {selectedCompanyLocal.name}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCompanyLocal(null)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search company by name..."
                  value={companyQueryLocal}
                  onChange={(e) => setCompanyQueryLocal(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                {companySearchingLocal && (
                  <div className="absolute right-3 top-3 text-xs text-gray-500">
                    Searching…
                  </div>
                )}
                {companyResultsLocal &&
                  companyResultsLocal.length > 0 &&
                  companyQueryLocal.trim().length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-50 max-h-48 overflow-auto">
                      {companyResultsLocal.map((c: any) => (
                        <button
                          key={c.id ?? c.name}
                          onClick={() => {
                            setSelectedCompanyLocal(c);
                            setCompanyResultsLocal([]);
                            setCompanyQueryLocal("");
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0"
                        >
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {c.website ?? c.web ?? ""}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            )
          )}
        </div>

        {/* Meeting type only for full meeting scheduling (not interestedMeta) */}
        {mode === "interested" && context !== "interestedMeta" && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded ${meetingType === "virtual"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
                  }`}
                onClick={() => setMeetingType("virtual")}
              >
                Virtual
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded ${meetingType === "physical"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
                  }`}
                onClick={() => setMeetingType("physical")}
              >
                Physical
              </button>
            </div>
          </div>
        )}

        {/* Date & time for meeting / follow-up (hidden for interestedMeta) */}
        {mode !== "not_interested" && context !== "interestedMeta" && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={meetingDateTime}
              onChange={(e) => setMeetingDateTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Notes {mode === "not_interested" ? "(optional)" : ""}
          </label>
          <textarea
            ref={notesRef}
            rows={5}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border rounded bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            disabled={hasSubmitted}
            className={`px-4 py-2 rounded text-white transition-opacity
        ${hasSubmitted ? "bg-blue-400 opacity-50 cursor-not-allowed" : "bg-blue-600"}`}
            onClick={async () => {
              try {
                setHasSubmitted(true);
                const payload: any = {
                  meeting_type: meetingType,
                  meeting_datetime: meetingDateTime || null,
                  notes: notesRef.current?.value || null,
                  company_id: selectedCompanyLocal
                    ? selectedCompanyLocal.id ??
                    selectedCompanyLocal.company_id ??
                    null
                    : null,
                };
                await onSchedule(payload);
              } catch (e) {
                setHasSubmitted(false); // ❗ revert if failed
                throw e;
              }
            }}
          >
            {primaryLabel}
          </button>

        </div>
      </div>
    );
  };
/* ======================= MEETING MANAGE MODAL (now INLINE) ======================= */

const MeetingManageModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onScheduleMeeting: (payload: any) => Promise<void>;
  onUpdateStatus: (
    status: "scheduled" | "completed",
    payload: any
  ) => Promise<void>;
  parentFilterActive?: boolean;
  parentCompanyOptions?: any[];
}> = ({ open, onClose, onScheduleMeeting, onUpdateStatus, parentFilterActive = false, parentCompanyOptions = [] }) => {
  const [meetingType, setMeetingType] = useState<"virtual" | "physical">(
    "virtual"
  );
  const [meetingDateTime, setMeetingDateTime] = useState<string>("");
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const [companyQueryLocal, setCompanyQueryLocal] = useState("");
  const [companyResultsLocal, setCompanyResultsLocal] = useState<any[]>([]);
  const [companySearchingLocal, setCompanySearchingLocal] = useState(false);
  const [selectedCompanyLocal, setSelectedCompanyLocal] = useState<any | null>(
    null
  );

  // new: action selector under Type
  // 'schedule' = create/schedule meeting
  // 'markdone' = mark latest meeting as completed on Save
  const [actionMode, setActionMode] = useState<"schedule" | "markdone">("schedule");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const doLocalCompanySearch = useMemo(
    () =>
      debounce(async (q: string) => {
        if (!q || q.trim().length < 1) {
          setCompanyResultsLocal([]);
          setCompanySearchingLocal(false);
          return;
        }
        setCompanySearchingLocal(true);
        try {
          const res = await getCompanies({ search: q, limit: 8 });
          const companies = res?.companies ?? res?.data ?? res ?? [];
          setCompanyResultsLocal(Array.isArray(companies) ? companies : []);
        } catch (err) {
          console.error("company search failed", err);
          setCompanyResultsLocal([]);
        } finally {
          setCompanySearchingLocal(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    if (!open) return;
    // only search if parent filter not active
    if (!parentFilterActive) doLocalCompanySearch(companyQueryLocal);
    return () => doLocalCompanySearch.cancel();
  }, [companyQueryLocal, doLocalCompanySearch, open, parentFilterActive]);

  useEffect(() => {
    if (open) {
      setMeetingType("virtual");
      setMeetingDateTime("");
      if (notesRef.current) notesRef.current.value = "";
      setCompanyQueryLocal("");
      setCompanyResultsLocal([]);
      setSelectedCompanyLocal(null);
      setActionMode("schedule"); // default action
      setHasSubmitted(false);
    }
  }, [open, parentFilterActive, parentCompanyOptions]);

  useEffect(() => {
    if (open && parentFilterActive && Array.isArray(parentCompanyOptions) && parentCompanyOptions.length === 1) {
      setSelectedCompanyLocal(parentCompanyOptions[0]);
    }
  }, [open, parentFilterActive, parentCompanyOptions]);

  if (!open) return null;

  const companyStatusText = (c: any) => {
    if (!c) return "";
    if (c.status) return c.status;
    if (c.active !== undefined) return c.active ? "Active" : "Inactive";
    if (c.isActive !== undefined) return c.isActive ? "Active" : "Inactive";
    return c.state || "";
  };

  const buildPayload = () => ({
    meeting_type: meetingType,
    meeting_datetime: meetingDateTime || null,
    notes: notesRef.current?.value || null,
    company_id: selectedCompanyLocal ? selectedCompanyLocal.id ?? selectedCompanyLocal.company_id ?? null : null,
  });

  // ---------- INLINE RENDER ----------
  return (
    <div className="mt-3 p-4 border rounded bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Schedule Meeting</h3>

      {/* Company selector */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-2">Company (required)</label>

        {parentFilterActive && Array.isArray(parentCompanyOptions) && parentCompanyOptions.length > 0 ? (
          <div className="max-h-48 overflow-auto border rounded p-2">
            {parentCompanyOptions.map((c: any) => {
              const cid = String(c.id ?? c.company_id ?? "");
              const selectedId = String(selectedCompanyLocal?.id ?? selectedCompanyLocal?.company_id ?? "");
              const isSelected = selectedId === cid;

              return (
                <div
                  key={cid}
                  className={`flex items-start gap-3 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : ""}`}
                  onClick={() => setSelectedCompanyLocal(c)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      readOnly
                      checked={isSelected}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">{companyStatusText(c)}</div>
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">{c.website ?? c.web ?? ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : selectedCompanyLocal ? (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {selectedCompanyLocal.name}
            </div>
            <button type="button" onClick={() => setSelectedCompanyLocal(null)} className="px-2 py-1 border rounded text-sm">Clear</button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Search company by name..."
              value={companyQueryLocal}
              onChange={(e) => setCompanyQueryLocal(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            {companySearchingLocal && <div className="absolute right-3 top-3 text-xs text-gray-500">Searching…</div>}
            {companyResultsLocal && companyResultsLocal.length > 0 && companyQueryLocal.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-50 max-h-48 overflow-auto">
                {companyResultsLocal.map((c: any) => (
                  <button
                    key={c.id ?? c.name}
                    onClick={() => {
                      setSelectedCompanyLocal(c);
                      setCompanyResultsLocal([]);
                      setCompanyQueryLocal("");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0"
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500 truncate">{c.website ?? c.web ?? ""}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Type */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-2">Type</label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className={`px-3 py-1 rounded ${meetingType === "virtual" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setMeetingType("virtual")}
          >
            Virtual
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${meetingType === "physical" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setMeetingType("physical")}
          >
            Physical
          </button>
        </div>

        {/* NEW: small action buttons under Type */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActionMode("schedule")}
            className={`px-3 py-1 rounded text-sm ${actionMode === "schedule" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Schedule
          </button>
          <button
            type="button"
            onClick={() => {
              setActionMode("markdone");
              setHasSubmitted(false); // ✅ UNFREEZE Save button
            }}
            className={`px-3 py-1 rounded text-sm ${actionMode === "markdone" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Mark done
          </button>
          <div className="text-xs text-gray-500 ml-2">(Choose action before Save)</div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-2">Date &amp; Time</label>
        <input
          type="datetime-local"
          value={meetingDateTime}
          onChange={(e) => setMeetingDateTime(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Notes</label>
        <textarea ref={notesRef} rows={5} className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="px-4 py-2 border rounded bg-gray-100" onClick={onClose}>Close</button>
        <button
          type="button"
          disabled={hasSubmitted}
          className={`px-4 py-2 rounded text-white transition-opacity
    ${hasSubmitted
              ? "bg-blue-400 opacity-50 cursor-not-allowed"
              : "bg-blue-600"}`}
          onClick={async () => {
            const payload = buildPayload();

            try {
              setHasSubmitted(true);

              if (actionMode === "markdone") {
                await onUpdateStatus("completed", payload);
                return;
              }

              await onScheduleMeeting(payload);
            } catch (err) {
              console.error("MeetingManageModal Save handler error:", err);
              setHasSubmitted(false); // ❗ revert ONLY on failure
            }
          }}
        >
          Save
        </button>

      </div>
    </div>
  );
};

/* ======================= PORTAL WRAPPER (unchanged) ======================= */

const DrawerPortal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1800]">{children}</div>,
    document.body
  );
};
/* ======================= MAIN DRAWER ======================= */

const InvestorDetailDrawer: React.FC<Props> = ({
  investorId,
  onClose,
  initialActionMode = null,
  selectedCompanyIds = null,
}) => {
  const [loading, setLoading] = useState(true);
  // Company filter passed by parent (InvestorTargeting)
  const parentSelectedCompanyIdsSet = useMemo(() => {
    if (!selectedCompanyIds || !selectedCompanyIds.length) return null;
    return new Set((selectedCompanyIds || []).map((s: any) => String(s)));
  }, [selectedCompanyIds]);

  const parentCompanyFilterActive = !!parentSelectedCompanyIdsSet;
  const [parentCompanyOptions, setParentCompanyOptions] = useState<any[]>([]);

  const [investor, setInvestor] = useState<any | null>(null);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("interested");
  // distinguish:
  //  - "normal"      → add to list + schedule (meetings/followups/NI)
  //  - "meetingOnly" → schedule meeting only (Meet → Schedule)
  //  - "interestedMeta" → after Interested click, only company + notes
  const [scheduleContext, setScheduleContext] =
    useState<ScheduleContext>("normal");

  // full Meeting button modal (we'll render inline instead)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);

  const [meetings, setMeetings] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [openSections, setOpenSections] = useState<{
    interested: boolean;
    meetings: boolean;
    followups: boolean;
    not_interested: boolean;
  }>({
    interested: false,
    meetings: false,
    followups: false,
    not_interested: false,
  });

  const [activityFrom, setActivityFrom] = useState<string>("");
  const [activityTo, setActivityTo] = useState<string>("");

  // sorting, company filter & activity-type filter state for Activities
  const [activitySortKey, setActivitySortKey] = useState<
    "date" | "company" | "activity"
  >("date");
  const [activitySortDir, setActivitySortDir] = useState<"asc" | "desc">(
    "desc"
  );
  const [activityCompanyFilter, setActivityCompanyFilter] =
    useState<string>("ALL");
  const [activityTypeFilter, setActivityTypeFilter] = useState<
    "ALL" | "INTERESTED" | "FOLLOWUPS" | "NOT_INTERESTED"
  >("ALL");

  // map company_id -> company name for activities
  const [activityCompanyMap, setActivityCompanyMap] = useState<
    Record<string, string>
  >({});

  // state for Mark-done modal in drawer
  const [showMeetActions, setShowMeetActions] = useState(false);
  const [markDoneModalOpen, setMarkDoneModalOpen] = useState(false);
  const [markDoneCompanyQuery, setMarkDoneCompanyQuery] = useState("");
  const [markDoneCompanyResults, setMarkDoneCompanyResults] = useState<any[]>(
    []
  );
  const [markDoneCompanySearching, setMarkDoneCompanySearching] =
    useState(false);
  const [markDoneSelectedCompany, setMarkDoneSelectedCompany] =
    useState<any | null>(null);
  const doMarkDoneCompanySearch = useMemo(
    () =>
      debounce(async (q: string) => {
        if (!q || q.trim().length < 1) {
          setMarkDoneCompanyResults([]);
          setMarkDoneCompanySearching(false);
          return;
        }
        setMarkDoneCompanySearching(true);
        try {
          const res = await getCompanies({ search: q, limit: 8 });
          const companies = res?.companies ?? res?.data ?? res ?? [];
          setMarkDoneCompanyResults(Array.isArray(companies) ? companies : []);
        } catch (err) {
          console.error("mark-done company search failed", err);
          setMarkDoneCompanyResults([]);
        } finally {
          setMarkDoneCompanySearching(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    if (!markDoneModalOpen) return;
    // only perform typed search if parent filter is not active
    if (!parentCompanyFilterActive) doMarkDoneCompanySearch(markDoneCompanyQuery);
    return () => {
      doMarkDoneCompanySearch.cancel();
    };
  }, [markDoneModalOpen, markDoneCompanyQuery, doMarkDoneCompanySearch, parentCompanyFilterActive]);

  useEffect(() => {
    if (markDoneModalOpen) {
      setMarkDoneCompanyQuery("");
      setMarkDoneCompanyResults([]);
      setMarkDoneSelectedCompany(null);

      // if parent filter active, try to preselect single or keep options
      if (parentCompanyFilterActive && parentCompanyOptions.length === 1) {
        setMarkDoneSelectedCompany(parentCompanyOptions[0]);
      }
    }
  }, [markDoneModalOpen, parentCompanyFilterActive, parentCompanyOptions]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /* ---------- data fetch helpers ---------- */

  const fetchParentCompanies = async () => {
    if (!parentCompanyFilterActive) {
      setParentCompanyOptions([]);
      return;
    }
    try {
      // Attempt: fetch a reasonably large list and filter locally by ids provided by parent
      const res = await getCompanies({ page: 1, limit: 1000 });
      const companies = res?.companies ?? res?.data ?? res ?? [];
      const wanted = (selectedCompanyIds || []).map((s: any) => String(s));
      const filtered = Array.isArray(companies)
        ? companies.filter((c: any) => {
          const cid = String(c.id ?? c.company_id ?? "");
          return wanted.includes(cid);
        })
        : [];
      setParentCompanyOptions(filtered);
    } catch (err) {
      console.error("Failed to load parent companies", err);
      setParentCompanyOptions([]);
    }
  };

  const fetchInvestor = async () => {
    try {
      setLoading(true);
      const res = await getInvestorById(investorId);
      setInvestor(res || null);
    } catch (err) {
      console.error("Failed to load investor", err);
      setInvestor(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await getMeetingsForInvestor(String(investorId));
      const items = (res?.items || res) ?? [];
      setMeetings(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("fetchMeetings error", err);
      setMeetings([]);
    }
  };

  const fetchFollowups = async () => {
    try {
      const res = await getFollowupsForInvestor(String(investorId));
      const items = (res?.items || res) ?? [];
      setFollowups(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("fetchFollowups error", err);
      setFollowups([]);
    }
  };

  const fetchInteractions = async () => {
    try {
      const res = await getInteractionsForInvestor(String(investorId));
      const items = (res?.items || res) ?? [];
      setInteractions(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("fetchInteractions error", err);
      setInteractions([]);
    }
  };

  // load companies for any company_ids present in activities
  async function loadActivityCompanies(ids: string[]) {
    if (!ids.length) return;
    try {
      const res = await getCompanies({ page: 1, limit: 1000 });
      const companies = res?.companies ?? res?.data ?? res ?? [];
      const map: Record<string, string> = {};
      ids.forEach((id) => {
        const found = companies.find(
          (c: any) =>
            String(c.id) === String(id) ||
            String(c.company_id) === String(id)
        );
        if (found && found.name) {
          map[String(id)] = found.name;
        }
      });
      if (Object.keys(map).length) {
        setActivityCompanyMap((prev) => ({ ...prev, ...map }));
      }
    } catch (err) {
      console.error("Failed to load companies for activities", err);
    }
  }

  /* ---------- initial load ---------- */

  useEffect(() => {
    if (!investorId) return;

    fetchInvestor();
    fetchMeetings();
    fetchFollowups();
    fetchInteractions();
    fetchParentCompanies();

    const now = new Date();
    const toStr = now.toISOString().slice(0, 10);
    const fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 4);
    const fromStr = fromDate.toISOString().slice(0, 10);
    setActivityFrom(fromStr);
    setActivityTo(toStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investorId, selectedCompanyIds]);

  /* ---------- company names for activities ---------- */

  useEffect(() => {
    const idsSet = new Set<string>();

    meetings.forEach((m: any) => {
      if (m.company_id) idsSet.add(String(m.company_id));
    });
    followups.forEach((f: any) => {
      if (f.company_id) idsSet.add(String(f.company_id));
    });
    interactions.forEach((it: any) => {
      if (it.company_id) idsSet.add(String(it.company_id));
    });

    const ids = Array.from(idsSet).filter((id) => !activityCompanyMap[id]);
    if (ids.length) {
      loadActivityCompanies(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetings, followups, interactions, activityCompanyMap]);

  /* ---------- initial action from list card ---------- */

  useEffect(() => {
    if (!initialActionMode) return;

    if (initialActionMode === "meetings") {
      setOpenSections((prev) => ({ ...prev, meetings: true }));
      return;
    }

    setOpenSections((prev) => ({ ...prev, [initialActionMode]: true }));
    setScheduleMode(initialActionMode);
    setScheduleContext("normal");
    // no portal: we render inline via openSections
  }, [initialActionMode]);

  const openScheduleFor = (mode: ScheduleMode) => {
    setScheduleMode(mode);
    setScheduleContext("normal"); // normal flow: add to list + schedule
    setOpenSections((prev) => ({ ...prev, [mode]: !prev[mode] }));
    // setScheduleOpen left for compatibility but we don't rely on it to show UI
    setScheduleOpen(false);
  };

  const normaliseCompanyId = (c: any) => {
    if (!c) return null;
    if (typeof c === "string") {
      if (c === "" || c.toLowerCase() === "null") return null;
      return c;
    }
    return c.id ?? c.company_id ?? null;
  };

  /* ---------- Add to Interested & open company+notes panel (inline) ---------- */

  const handleAddToInterestedOnly = () => {
    if (!investor) return;
    // Only open the Interested meta panel; actual add happens in handleInterestedMeta
    setScheduleMode("interested");
    setScheduleContext("interestedMeta");
    setOpenSections((prev) => ({ ...prev, interested: !prev.interested }));
  };

  /* ---------- Save company & notes for Interested (no meeting) ---------- */

  const handleInterestedMeta = async (payload: {
    meeting_type?: "virtual" | "physical";
    meeting_datetime?: string | null;
    notes?: string | null;
    company_id?: string | null;
  }) => {
    if (!investor) return;

    const companyIdNormalized = normaliseCompanyId(payload.company_id) || null;

    setIsProcessing(true);
    try {
      // Create interested list entry with company_id in snapshot
      const snapshot: any = {
        id: investor.id,
        name:
          investor.name ||
          `${investor.firstName || ""} ${investor.lastName || ""}`.trim(),
        email: investor.email,
        phone: investor.phone,
        firm: investor.firm,
        portfolioFit:
          investor.portfolioFit ||
          investor.portfolioFitScore ||
          investor.portfolio_fit_score ||
          0,
        company_id: companyIdNormalized || null,
        company: companyIdNormalized ? { id: companyIdNormalized } : undefined,
      };

      const addPayload: any = {
        investor_id: investor.id,
        list_type: "interested",
        snapshot,
        company_id: companyIdNormalized || null,
      };

      const added = await addInvestorToList(addPayload);
      const serverSnapshot: any = added?.snapshot || snapshot;
      const serverItem = { ...(added || {}), snapshot: serverSnapshot };

      // Notify UI: added to Interested list
      window.dispatchEvent(
        new CustomEvent("investorListChanged", {
          detail: {
            action: "added",
            listType: "interested",
            item: serverItem,
          },
        })
      );

      // Record an "interested" interaction with notes (so it appears in Activities)
      if (payload.notes && payload.notes.trim() !== "") {
        try {
          const interPayload: any = {
            investor_id: investor.id,
            outcome: "interested",
            source: "manual",
            notes: payload.notes || null,
            related_id: null,
            company_id: companyIdNormalized || null,
            created_by: investor.createdBy || investor.created_by || undefined,
          };
          await createInteraction(interPayload);
        } catch (err) {
          console.warn("createInteraction (interested) failed:", err);
        }
      }

      await fetchInvestor();
      await fetchInteractions();


    } catch (err) {
      console.error("handleInterestedMeta error", err);

    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------- meeting-only schedule (same as InvestorCard Schedule button) ---------- */

  const handleScheduleMeetingOnly = async (payload: {
    meeting_type?: "virtual" | "physical";
    meeting_datetime?: string | null;
    notes?: string | null;
    company_id?: string | null;
  }) => {
    if (!investor) return;

    const investorId = String(investor.id || investor.investor_id);
    if (!investorId) {
      alert("Missing investor id for meeting");
      return;
    }

    if (!payload.meeting_datetime) {
      alert("Please select date & time");
      return;
    }

    const companyIdNormalized = normaliseCompanyId(payload.company_id) || null;

    const meetingPayload: any = {
      investor_id: investorId,
      company_id: companyIdNormalized,
      meeting_type: payload.meeting_type || "virtual",
      meeting_datetime: payload.meeting_datetime,
      notes: payload.notes || null,
      created_by: investor.createdBy || investor.created_by || undefined,
    };

    setIsProcessing(true);
    try {
      // 1️⃣ Create meeting (same as card)
      await createMeeting(meetingPayload);

      // 2️⃣ Ensure investor_lists has this company_id (same idea as card)
      if (companyIdNormalized) {
        try {
          const baseSnap: any = investor.snapshot || investor;
          const snapshot: any = {
            id: baseSnap.id || investorId,
            firm: baseSnap.firm || investor.firm || null,
            name:
              baseSnap.name ||
              investor.name ||
              `${investor.firstName || ""} ${investor.lastName || ""}`.trim(),
            email: baseSnap.email || investor.email || "",
            phone: baseSnap.phone || investor.phone || "",
            portfolioFit:
              baseSnap.portfolioFit ??
              baseSnap.portfolio_fit_score ??
              investor.portfolioFit ??
              investor.portfolio_fit_score ??
              0,
          };

          await addInvestorToList({
            investor_id: investorId,
            list_type: "interested",
            company_id: companyIdNormalized,
            snapshot,
          } as any);
        } catch (e) {
          console.error(
            "addInvestorToList with company_id from meeting-only flow failed (non-blocking)",
            e
          );
        }
      }

      await fetchMeetings();
      await fetchInvestor();
      await fetchInteractions();

      window.dispatchEvent(new Event("investorMeetingCreated"));
      // close the inline panel that opened the meeting-only flow (if any)
      setOpenSections((prev) => ({ ...prev, [scheduleMode]: false }));
    } catch (err) {
      console.error("handleScheduleMeetingOnly error", err);
    } finally {
      setIsProcessing(false);
      setScheduleContext("normal");
    }
  };

  /* ---------- Mark-done (same logic as InvestorCard Meet → Mark done) ---------- */

  const handleMarkDoneFromDrawer = async (companyId: string) => {
    if (!investor) {
      alert("Missing investor");
      return;
    }
    const investorId = String(investor.investor_id || investor.id || "");
    if (!investorId) {
      alert("Missing investor id");
      return;
    }
    if (!companyId) {
      alert("Missing company id");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await getMeetingsForInvestor(investorId);
      const items: any[] = (res?.items || res || []) as any[];

      if (!items || items.length === 0) {
        alert("No meetings found for this investor");
        setIsProcessing(false);
        return;
      }

      const filtered = items.filter(
        (m) =>
          String(m.company_id || "") === String(companyId) &&
          (m.meeting_status || m.status) !== "completed"
      );

      if (!filtered.length) {
        alert("No scheduled meeting found for this investor & company");
        setIsProcessing(false);
        return;
      }

      const latest = filtered.reduce((acc, cur) => {
        const accTime = new Date(
          acc.meeting_datetime || acc.created_at || 0
        ).getTime();
        const curTime = new Date(
          cur.meeting_datetime || cur.created_at || 0
        ).getTime();
        return curTime > accTime ? cur : acc;
      });

      await updateMeeting(latest.id, { meeting_status: "completed" });
      await fetchMeetings();
      window.dispatchEvent(new Event("investorMeetingCreated"));
    } catch (err) {
      console.error("Mark done failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------- helper: remove Interested rows for same investor+company ---------- */
  const removeInterestedRowsForCompany = async (
    investorIdStr: string,
    companyIdStr: string
  ) => {
    try {
      const res = await getInvestorsInList("interested");
      const items = (res?.items || res || []) as any[];

      const matches = items.filter((row: any) => {
        const rowInvestorId = String(row.investor_id || "");
        const rowCompanyId =
          row.company_id ||
          row.snapshot?.company_id ||
          row.snapshot?.company?.id ||
          null;

        return (
          rowInvestorId === investorIdStr &&
          rowCompanyId &&
          String(rowCompanyId) === companyIdStr
        );
      });

      for (const row of matches) {
        if (row.id == null) continue;
        try {
          await removeInvestorFromListById(row.id);
          // notify UI so card disappears from Interested list
          window.dispatchEvent(
            new CustomEvent("investorListChanged", {
              detail: {
                action: "removed",
                listType: "interested",
                item: {
                  id: row.id,
                  investor_id: investor?.id || investorIdStr,
                },
              },
            })
          );
        } catch (err) {
          console.error(
            "Failed to remove interested row after meeting schedule",
            err
          );
        }
      }
    } catch (err) {
      console.error("removeInterestedRowsForCompany error", err);
    }
  };

  /* ---------- Meeting button: Schedule + convert / remove Interested ---------- */

  const handleScheduleFromMeetingButton = async (payload: {
    meeting_type?: "virtual" | "physical";
    meeting_datetime?: string | null;
    notes?: string | null;
    company_id?: string | null;
  }) => {
    if (!investor) return;

    const investorId = String(investor.id || investor.investor_id);
    if (!investorId) {
      alert("Missing investor id for meeting");
      return;
    }

    const companyIdNormalized = normaliseCompanyId(payload.company_id) || null;
    if (!companyIdNormalized) {
      alert("Please select a company for this meeting");
      return;
    }
    if (!payload.meeting_datetime) {
      alert("Please select date & time");
      return;
    }

    const meetingPayload: any = {
      investor_id: investorId,
      company_id: companyIdNormalized,
      meeting_type: payload.meeting_type || "virtual",
      meeting_datetime: payload.meeting_datetime,
      notes: payload.notes || null,
      created_by: investor.createdBy || investor.created_by || undefined,
    };

    setIsProcessing(true);
    try {
      // 1️⃣ Create the meeting record
      const meetingResp = await createMeeting(meetingPayload);
      const mr = meetingResp?.meeting ?? meetingResp ?? {};

      const baseName =
        investor.name ||
        `${investor.firstName || ""} ${investor.lastName || ""}`.trim();

      // Build snapshot with meeting + scheduling info
      const snapshot: any = {
        id: investor.id,
        name: baseName,
        email: investor.email,
        phone: investor.phone,
        firm: investor.firm,
        portfolioFit:
          investor.portfolioFit ||
          investor.portfolioFitScore ||
          investor.portfolio_fit_score ||
          0,
        list_type: "meeting",
        company_id: companyIdNormalized,
        company: { id: companyIdNormalized },
      };

      const meetingObj = {
        id: mr.id ?? mr.meeting_id ?? null,
        meet_link: mr.meet_link || mr.meetLink || null,
        meeting_datetime:
          mr.meeting_datetime || meetingPayload.meeting_datetime,
        meeting_type: mr.meeting_type || meetingPayload.meeting_type,
        notes: mr.notes || meetingPayload.notes || null,
        status: mr.meeting_status || mr.status || "scheduled",
        company_id: mr.company_id ?? companyIdNormalized,
      };

      snapshot.meeting = meetingObj;
      snapshot.scheduling = {
        meeting_id: meetingObj.id,
        meet_link: meetingObj.meet_link,
        meeting_datetime: meetingObj.meeting_datetime,
        meetingType: meetingObj.meeting_type,
        notes: meetingObj.notes,
        status: meetingObj.status,
      };

      // 2️⃣ Try to find existing investor_lists row with list_type='interested'
      //    for this investor + company, so we can CONVERT it instead of creating a new row.
      let convertedViaUpdate = false;
      let serverItem: any = null;

      try {
        const listRes = await getInvestorsInList("interested");
        const items = (listRes?.items || listRes || []) as any[];

        const existing = items.find((row: any) => {
          const rowInvestorId = String(row.investor_id || "");
          const rowCompanyId =
            row.company_id ||
            row.snapshot?.company_id ||
            row.snapshot?.company?.id ||
            null;

          return (
            rowInvestorId === investorId &&
            rowCompanyId &&
            String(rowCompanyId) === String(companyIdNormalized)
          );
        });

        if (existing && existing.id != null) {
          // 2a️⃣ Update that row in DB: change list_type → 'meeting' and snapshot
          const updatePayload: any = {
            list_type: "meeting",
            snapshot,
            company_id: companyIdNormalized,
          };
          await updateInvestorList(existing.id, updatePayload);

          // 2b️⃣ Build updated item for UI (Meeting list)
          serverItem = {
            ...existing,
            list_type: "meeting",
            snapshot,
            company_id: companyIdNormalized,
          };

          // 2c️⃣ Notify UI: add to Meeting, remove from Interested
          window.dispatchEvent(
            new CustomEvent("investorListChanged", {
              detail: {
                action: "added",
                listType: "meeting",
                item: serverItem,
              },
            })
          );

          window.dispatchEvent(
            new CustomEvent("investorListChanged", {
              detail: {
                action: "removed",
                listType: "interested",
                item: { id: existing.id, investor_id: investor.id },
              },
            })
          );

          convertedViaUpdate = true;
        }
      } catch (innerErr) {
        console.error(
          "Failed to convert interested row to meeting; will fallback to creating meeting row",
          innerErr
        );
      }

      // 3️⃣ Fallback: if we didn't find an existing interested row, create a fresh meeting row
      if (!convertedViaUpdate) {
        const addPayload: any = {
          investor_id: investor.id,
          list_type: "meeting",
          snapshot,
          company_id: companyIdNormalized,
        };

        const added = await addInvestorToList(addPayload);
        const serverSnapshot: any = added?.snapshot || snapshot;
        serverItem = { ...(added || {}), snapshot: serverSnapshot };

        // add to Meeting list
        window.dispatchEvent(
          new CustomEvent("investorListChanged", {
            detail: {
              action: "added",
              listType: "meeting",
              item: serverItem,
            },
          })
        );
      }

      // 4️⃣ Ensure any remaining Interested rows for same investor+company are removed
      await removeInterestedRowsForCompany(
        investorId,
        String(companyIdNormalized)
      );

      // 5️⃣ Refresh local data (panel stays open)
      await fetchMeetings();
      await fetchInvestor();
      await fetchInteractions();

      window.dispatchEvent(new Event("investorMeetingCreated"));

      // inline panel intentionally NOT closed on Schedule (preserve previous behavior)
    } catch (err) {
      console.error("handleScheduleFromMeetingButton error", err);

    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------- Meeting button: update latest meeting status by company ---------- */

  const handleMeetingStatusFromMeetingButton = async (
    status: "scheduled" | "completed",
    payload: {
      meeting_type?: "virtual" | "physical";
      meeting_datetime?: string | null;
      notes?: string | null;
      company_id?: string | null;
    }
  ) => {
    if (!investor) return;
    const investorId = String(investor.investor_id || investor.id || "");
    if (!investorId) {
      alert("Missing investor id");
      return;
    }

    const companyIdNormalized = normaliseCompanyId(payload.company_id) || null;
    if (!companyIdNormalized) {
      alert("Please select a company first.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await getMeetingsForInvestor(investorId);
      const items: any[] = (res?.items || res || []) as any[];

      if (!items || items.length === 0) {
        alert("No meetings found for this investor");
        setIsProcessing(false);
        return;
      }

      const filtered = items.filter(
        (m) => String(m.company_id || "") === String(companyIdNormalized)
      );

      if (!filtered.length) {
        alert("No meeting found for this investor & company");
        setIsProcessing(false);
        return;
      }

      const latest = filtered.reduce((acc, cur) => {
        const accTime = new Date(
          acc.meeting_datetime || acc.created_at || 0
        ).getTime();
        const curTime = new Date(
          cur.meeting_datetime || cur.created_at || 0
        ).getTime();
        return curTime > accTime ? cur : acc;
      });

      await updateMeeting(latest.id, { meeting_status: status });
      await fetchMeetings();


      window.dispatchEvent(new Event("investorMeetingCreated"));
    } catch (err) {
      console.error("update meeting status from Meeting button failed", err);

    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------- shared schedule handler (meeting / followup / NI) ---------- */

  const handleSchedule = async (payload: {
    meeting_type?: "virtual" | "physical";
    meeting_datetime?: string | null;
    notes?: string | null;
    company_id?: string | null;
  }) => {
    if (!investor) return;
    setIsProcessing(true);


    const listType: "interested" | "followups" | "not_interested" =
      scheduleMode === "interested"
        ? "interested"
        : scheduleMode === "followups"
          ? "followups"
          : "not_interested";

    const optimisticTempId = `tmp-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    const companyIdNormalized = normaliseCompanyId(payload.company_id) || null;

    const optimisticSnapshot: any = {
      id: investor.id,
      name:
        investor.name ||
        `${investor.firstName || ""} ${investor.lastName || ""}`.trim(),
      email: investor.email,
      phone: investor.phone,
      firm: investor.firm,
      portfolioFit:
        investor.portfolioFit ||
        investor.portfolioFitScore ||
        investor.portfolio_fit_score ||
        0,
      scheduling: undefined,
      notInterestedNote: undefined,
      company: companyIdNormalized ? { id: companyIdNormalized } : undefined,
      company_id: companyIdNormalized || null,
    };

    if (listType === "interested") {
      optimisticSnapshot.scheduling = {
        meetingType: payload.meeting_type || "virtual",
        meeting_datetime: payload.meeting_datetime || null,
        notes: payload.notes || null,
      };
    } else if (listType === "followups") {
      optimisticSnapshot.scheduling = {
        followup_datetime: payload.meeting_datetime || null,
        followup_notes: payload.notes || null,
      };
    } else if (listType === "not_interested") {
      optimisticSnapshot.notInterestedNote = payload.notes || null;
    }

    const optimisticItem: any = {
      id: optimisticTempId,
      investor_id: investor.id,
      list_type: listType,
      snapshot: optimisticSnapshot,
      _optimistic: true,
    };

    window.dispatchEvent(
      new CustomEvent("investorListChanged", {
        detail: { action: "added", listType, item: optimisticItem },
      })
    );

    try {
      const addPayload: any = {
        investor_id: investor.id,
        list_type: listType,
        snapshot: optimisticSnapshot,
        company_id: companyIdNormalized || null,
      };

      const added = await addInvestorToList(addPayload);

      let meetingResp: any = null;
      let followupResp: any = null;

      if (listType === "interested") {
        try {
          const meetingPayload: any = {
            investor_id: investor.id,
            company_id: companyIdNormalized || null,
            meeting_type: payload.meeting_type || "virtual",
            meeting_datetime: payload.meeting_datetime || null,
            notes: payload.notes || null,
            created_by: investor.createdBy || investor.created_by || undefined,
          };
          meetingResp = await createMeeting(meetingPayload);
        } catch (err) {
          console.warn("createMeeting failed:", err);
        }
      } else if (listType === "followups") {
        try {
          const fuPayload: any = {
            investor_id: investor.id,
            company_id: companyIdNormalized || null,
            followup_datetime:
              payload.meeting_datetime || new Date().toISOString(),
            notes: payload.notes || null,
            created_by: investor.createdBy || investor.created_by || undefined,
          };
          followupResp = await createFollowup(fuPayload);
        } catch (err) {
          console.warn("createFollowup failed:", err);
        }
      } else if (listType === "not_interested") {
        try {
          const interPayload: any = {
            investor_id: investor.id,
            outcome: "not_interested",
            source: "manual",
            notes: payload.notes || null,
            related_id: null,
            company_id: companyIdNormalized || null,
            created_by: investor.createdBy || investor.created_by || undefined,
          };
          await createInteraction(interPayload);
        } catch (err) {
          console.warn("createInteraction failed:", err);
        }
      }

      const serverSnapshot: any = (added && added.snapshot) || {};
      if (!serverSnapshot.company_id && companyIdNormalized)
        serverSnapshot.company_id = companyIdNormalized;

      if (meetingResp) {
        const mr = meetingResp.meeting ?? meetingResp ?? {};
        serverSnapshot.meeting = {
          id: mr.id ?? mr.meeting_id ?? null,
          meet_link: mr.meet_link || mr.meetLink || null,
          meeting_datetime: mr.meeting_datetime || mr.scheduled_at || null,
          meeting_type:
            mr.meeting_type || payload.meeting_type || "virtual",
          notes: mr.notes || payload.notes || null,
          status: mr.meeting_status || mr.status || "scheduled",
          company_id: mr.company_id ?? companyIdNormalized ?? null,
        };
        serverSnapshot.scheduling = {
          meeting_id: serverSnapshot.meeting.id,
          meet_link: serverSnapshot.meeting.meet_link,
          meeting_datetime: serverSnapshot.meeting.meeting_datetime,
          meetingType: serverSnapshot.meeting.meeting_type,
          notes: serverSnapshot.meeting.notes,
          status: serverSnapshot.meeting.status,
        };
      }

      if (followupResp) {
        const fr = followupResp.followup ?? followupResp ?? {};
        serverSnapshot.followup = {
          id: fr.id ?? fr.followup_id ?? null,
          followup_datetime: fr.followup_datetime ?? null,
          notes: fr.notes ?? null,
          status: fr.status ?? "scheduled",
          company_id: fr.company_id ?? companyIdNormalized ?? null,
          company_name:
            fr.company_name ?? (fr.company && fr.company.name) ?? null,
        };
        serverSnapshot.scheduling = {
          ...(serverSnapshot.scheduling || {}),
          followup_id: serverSnapshot.followup.id,
          followup_datetime: serverSnapshot.followup.followup_datetime,
          followup_notes: serverSnapshot.followup.notes,
          followup_status: serverSnapshot.followup.status,
        };
      }

      const serverItem = { ...(added || {}), snapshot: serverSnapshot };
      window.dispatchEvent(
        new CustomEvent("investorListChanged", {
          detail: {
            action: "confirmed",
            listType,
            tempId: optimisticTempId,
            serverItem,
          },
        })
      );

      await fetchMeetings();
      await fetchFollowups();
      await fetchInvestor();
      await fetchInteractions();

      if (listType === "interested")
        window.dispatchEvent(new Event("investorMeetingCreated"));
      if (listType === "followups")
        window.dispatchEvent(new Event("investorFollowupCreated"));
      if (listType === "not_interested")
        window.dispatchEvent(new Event("investorInteractionCreated"));

    } catch (err) {
      console.error("handleSchedule error", err);
      window.dispatchEvent(
        new CustomEvent("investorListChanged", {
          detail: {
            action: "removed",
            listType,
            item: { id: optimisticTempId, investor_id: investor.id },
            error: err,
          },
        })
      );

    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateMeet = async (meetingId: string | number) => {
    if (!meetingId) return alert("Meeting id missing");
    setIsProcessing(true);
    try {
      const resp = await generateMeetForMeeting(String(meetingId));
      const meetingObj = resp?.meeting ?? resp ?? null;

      if (
        resp?.google_create_status === "NO_REFRESH_TOKEN" ||
        meetingObj?.google_create_status === "NO_REFRESH_TOKEN"
      ) {
        alert(
          "Google account not connected. Please connect Google in Settings to auto-create Meet links."
        );
        return;
      }

      if (!meetingObj) {
        alert("Failed to generate meeting link (no meeting returned)");
        return;
      }

      await fetchMeetings();
      await fetchInvestor();

      window.dispatchEvent(new Event("investorMeetingCreated"));
      alert("Meeting link created and saved.");
    } catch (err: any) {
      console.error("generate meet failed", err);
      const payload = err?.payload ?? err;
      if (payload && payload.google_create_status === "NO_REFRESH_TOKEN") {
        alert("Google account not connected. Please connect Google in Settings.");
      } else {
        alert("Failed to generate meeting link");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateMeetingStatus = async (
    meetingId: string | number,
    status: "scheduled" | "completed"
  ) => {
    if (!meetingId) return;
    const prev = meetings;
    const updated = prev.map((m) =>
      m.id === meetingId ? { ...m, meeting_status: status, status } : m
    );
    setMeetings(updated);

    setIsProcessing(true);
    try {
      const resp = await updateMeeting(meetingId, { meeting_status: status });
      const updatedMeetingFromServer = resp?.meeting ?? resp ?? null;
      if (updatedMeetingFromServer && updatedMeetingFromServer.id) {
        setMeetings((cur) =>
          cur.map((m) =>
            m.id === updatedMeetingFromServer.id
              ? { ...m, ...updatedMeetingFromServer }
              : m
          )
        );
      } else {
        await fetchMeetings();
      }
      alert("Meeting status updated");
      window.dispatchEvent(new Event("investorMeetingCreated"));
    } catch (err) {
      console.error("update meeting status failed", err);
      setMeetings(prev);
      alert("Failed to update meeting status");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateFollowupStatus = async (
    followupId: string | number,
    status: "scheduled" | "completed"
  ) => {
    if (!followupId) return;
    try {
      setIsProcessing(true);
      await updateFollowup(followupId, { status });
      await fetchFollowups();
      window.dispatchEvent(new Event("investorFollowupCreated"));
    } catch (err) {
      console.error("update followup status failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!investor && loading) return null;

  const investorName =
    investor?.name ||
    `${investor?.firstName || ""} ${investor?.lastName || ""}`.trim();

  /* ---------- Build activities table rows ---------- */

  // will be filled inside activities builder for Company dropdown
  let activityCompanyOptions: string[] = [];

  const activities = (() => {
    type ActivityRow = {
      key: string;
      filterDate: Date | null;
      displayDate: string;
      companyName?: string | null;
      callText?: string | null;
      meetingText?: string | null;
      interestedText?: string | null;
      followupText?: string | null;
      notInterestedText?: string | null;
      comments?: string | null;
      activityType?: string | null;
    };

    const rows: ActivityRow[] = [];

    const formatDateOnly = (value: string | null | undefined) => {
      if (!value) return "";
      const d = new Date(value);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString();
    };

    const formatDateTime = (value: string | null | undefined) => {
      if (!value) return "";
      const d = new Date(value);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleString();
    };

    const getCompanyName = (obj: any): string | null => {
      if (!obj) return null;
      const cid =
        obj.company_id ||
        obj.companyId ||
        obj.company?.id ||
        obj.company?.company_id ||
        null;

      if (cid && activityCompanyMap[String(cid)]) {
        return activityCompanyMap[String(cid)];
      }

      return (
        obj.company_name ||
        obj.companyName ||
        (obj.company && obj.company.name) ||
        null
      );
    };

    // meetings
    meetings.forEach((m: any) => {
      // If parent company filter is active, skip meetings that don't belong to selected companies
      if (parentCompanyFilterActive) {
        const cid =
          m.company_id ||
          m.companyId ||
          (m.company && (m.company.id || m.company.company_id)) ||
          null;
        if (!cid || !parentSelectedCompanyIdsSet!.has(String(cid))) return;
      }

      const filterDate = m.created_at
        ? new Date(m.created_at)
        : m.meeting_datetime
          ? new Date(m.meeting_datetime)
          : null;

      const displayDate = formatDateOnly(m.created_at || m.meeting_datetime);
      const meetingText = formatDateTime(m.meeting_datetime);

      rows.push({
        key: `m-${m.id}`,
        filterDate,
        displayDate,
        companyName: getCompanyName(m),
        meetingText: meetingText || "—",
        comments: m.notes || null,
        activityType: "Meeting",
      });
    });

    // follow-ups
    followups.forEach((f: any) => {
      // If parent company filter is active, skip followups that don't belong to selected companies
      if (parentCompanyFilterActive) {
        const cid =
          f.company_id ||
          f.companyId ||
          (f.company && (f.company.id || f.company.company_id)) ||
          null;
        if (!cid || !parentSelectedCompanyIdsSet!.has(String(cid))) return;
      }

      const filterDate = f.created_at
        ? new Date(f.created_at)
        : f.followup_datetime
          ? new Date(f.followup_datetime)
          : null;

      const displayDate = formatDateOnly(f.created_at || f.followup_datetime);
      const followupText = formatDateTime(f.followup_datetime);

      rows.push({
        key: `f-${f.id}`,
        filterDate,
        displayDate,
        companyName: getCompanyName(f),
        followupText: followupText || "—",
        comments: f.notes || f.note || null,
        activityType: "Followup",
      });
    });

    // interactions
    interactions.forEach((it: any) => {
      // If parent company filter is active, skip interactions that don't belong to selected companies
      if (parentCompanyFilterActive) {
        const cid =
          it.company_id ||
          it.companyId ||
          (it.company && (it.company.id || it.company.company_id)) ||
          null;
        if (!cid || !parentSelectedCompanyIdsSet!.has(String(cid))) return;
      }

      const filterDate = it.created_at ? new Date(it.created_at) : null;
      const displayDate = formatDateOnly(it.created_at);

      let interestedText: string | null = null;
      let notInterestedText: string | null = null;
      let followupText: string | null = null;
      let activityType: string | null = null;

      if (it.outcome === "interested") {
        interestedText = "Interested";
        activityType = "Interested";
      } else if (it.outcome === "not_interested") {
        notInterestedText = "Not Interested";
        activityType = "Not Interested";
      } else if (it.outcome === "follow_up") {
        followupText = "Follow-up";
        activityType = "Followup";
      }

      rows.push({
        key: `i-${it.id}`,
        filterDate,
        displayDate,
        companyName: getCompanyName(it),
        interestedText,
        notInterestedText,
        followupText,
        comments: it.notes || it.note || null,
        activityType,
      });
    });

    // date filter
    let filtered = rows;
    if (activityFrom || activityTo) {
      const fromDate = activityFrom
        ? new Date(activityFrom + "T00:00:00")
        : null;
      const toDate = activityTo
        ? new Date(activityTo + "T23:59:59")
        : null;

      filtered = rows.filter((r) => {
        if (!r.filterDate) return false;
        const t = r.filterDate.getTime();
        if (fromDate && t < fromDate.getTime()) return false;
        if (toDate && t > toDate.getTime()) return false;
        return true;
      });
    }

    // build company options from date-filtered rows
    const companySet = new Set<string>();
    filtered.forEach((r) => {
      if (r.companyName) companySet.add(r.companyName);
    });
    activityCompanyOptions = Array.from(companySet).sort((a, b) =>
      a.localeCompare(b)
    );

    // company filter
    if (activityCompanyFilter !== "ALL") {
      filtered = filtered.filter(
        (r) => (r.companyName || "") === activityCompanyFilter
      );
    }

    // activity type filter (Interested / Followups / Not Interested)
    if (activityTypeFilter === "INTERESTED") {
      // companies where there is an Interested row
      const interestedCompanies = new Set(
        filtered
          .filter(
            (r) => r.activityType === "Interested" && r.companyName
          )
          .map((r) => r.companyName as string)
      );

      filtered = filtered.filter((r) => {
        if (r.activityType === "Interested") return true;
        // also include meetings for those interested companies
        if (
          r.activityType === "Meeting" &&
          r.companyName &&
          interestedCompanies.has(r.companyName)
        ) {
          return true;
        }
        return false;
      });
    } else if (activityTypeFilter === "FOLLOWUPS") {
      filtered = filtered.filter((r) => r.activityType === "Followup");
    } else if (activityTypeFilter === "NOT_INTERESTED") {
      filtered = filtered.filter(
        (r) => r.activityType === "Not Interested"
      );
    }

    // sorting
    filtered.sort((a, b) => {
      let cmp = 0;

      if (activitySortKey === "date") {
        const ad = a.filterDate ? a.filterDate.getTime() : 0;
        const bd = b.filterDate ? b.filterDate.getTime() : 0;
        cmp = ad - bd;
      } else if (activitySortKey === "company") {
        cmp = (a.companyName || "").localeCompare(b.companyName || "");
      } else if (activitySortKey === "activity") {
        cmp = (a.activityType || "").localeCompare(b.activityType || "");
      }

      return activitySortDir === "asc" ? cmp : -cmp;
    });

    return filtered;
  })();

  /* ---------- Clear activity filters ---------- */
  const handleClearActivityFilters = () => {
    const now = new Date();
    const toStr = now.toISOString().slice(0, 10);
    const fromDate = new Date(now);
    fromDate.setDate(fromDate.getDate() - 4);
    const fromStr = fromDate.toISOString().slice(0, 10);

    setActivityFrom(fromStr);
    setActivityTo(toStr);
    setActivityCompanyFilter("ALL");
    setActivityTypeFilter("ALL");
    setActivitySortKey("date");
    setActivitySortDir("desc");
  };

  /* ---------- RENDER ---------- */

  return (
    <DrawerPortal>
      <div className="fixed inset-0 z-[1800] flex">
        <div className="flex-1" onClick={onClose} />
        <div className="w-[720px] max-w-full bg-white h-full shadow-xl overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <img
                src={
                  investor?.avatarUrl ||
                  investor?.avatar ||
                  investor?.avatar_url ||
                  "https://ui-avatars.com/api/?name=Investor&background=0D8ABC&color=fff"
                }
                alt={investorName || ""}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{investorName}</h3>
                <div className="text-sm text-gray-600">
                  {investor?.jobTitle ||
                    investor?.job_title ||
                    investor?.role ||
                    "—"}
                </div>
                <div className="text-sm text-blue-600">
                  {investor?.firm?.name || "—"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {investor?.firm?.type ? `Category: ${investor.firm.type}` : ""}
                </div>
              </div>
            </div>

            <button
              className="px-3 py-2 rounded border hover:bg-gray-50"
              onClick={onClose}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Investor meta */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>Location:</strong> {investor?.location || "—"}
              </div>
              <div>
                <strong>AUM:</strong>{" "}
                {investor?.aum ||
                  (investor?.minCheckSize
                    ? `${investor.minCheckSize} - ${investor.maxCheckSize}`
                    : "—")}
              </div>
              <div>
                <strong>Portfolio Fit:</strong>{" "}
                {investor?.portfolioFitScore ?? investor?.portfolio_fit_score ?? "—"}
              </div>
              <div>
                <strong>Stages:</strong>{" "}
                {(investor?.investmentStages || investor?.investment_stages || []).join(", ") || "—"}
              </div>
              <div>
                <strong>Sectors:</strong>{" "}
                {(investor?.sectorPreferences || investor?.sector_preferences || []).join(", ") || "—"}
              </div>
              <div>
                <strong>Check Size:</strong>{" "}
                {investor?.minCheckSize || investor?.maxCheckSize
                  ? `${investor.minCheckSize || "?"} - ${investor.maxCheckSize || "?"}`
                  : "—"}
              </div>
              <div>
                <strong>Email:</strong> {investor?.email || "—"}
              </div>
              <div>
                <strong>Phone:</strong> {investor?.phone || "—"}
              </div>
            </div>

            {/* Pills row */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-wrap gap-3 items-start">
                <button
                  type="button"
                  onClick={handleAddToInterestedOnly}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold shadow-sm hover:bg-green-700"
                >
                  Interested
                </button>
                <button
                  type="button"
                  onClick={() => openScheduleFor("followups")}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-full bg-yellow-400 text-yellow-900 text-sm font-semibold shadow-sm hover:bg-yellow-500"
                >
                  Followups
                </button>
                <button
                  type="button"
                  onClick={() => openScheduleFor("not_interested")}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold shadow-sm hover:bg-red-600"
                >
                  Not Interested
                </button>

                {/* Meeting button (now toggles inline MeetingManageModal) */}
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, meetings: !prev.meetings }))
                  }
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-full border border-blue-300 bg-blue-50 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100"
                >
                  Meeting
                </button>
              </div>

              {/* Inline panels: render immediately below pills when openSections are true */}
              <div>
                {/* Interested inline panel */}
                {openSections.interested && (
                  <ScheduleModal
                    open={openSections.interested}
                    onClose={() => {
                      setOpenSections((prev) => ({ ...prev, interested: false }));
                      setScheduleContext("normal");
                    }}
                    onSchedule={async (p) => {
                      if (scheduleContext === "meetingOnly") {
                        await handleScheduleMeetingOnly(p);
                      } else if (scheduleContext === "interestedMeta") {
                        await handleInterestedMeta(p);
                      } else {
                        await handleSchedule(p);
                      }
                    }}
                    initialType="virtual"
                    initialDate={undefined}
                    mode={"interested"}
                    context={scheduleContext}
                    parentFilterActive={parentCompanyFilterActive}
                    parentCompanyOptions={parentCompanyOptions}
                  />
                )}

                {/* Followups inline panel */}
                {openSections.followups && (
                  <ScheduleModal
                    open={openSections.followups}
                    onClose={() => {
                      setOpenSections((prev) => ({ ...prev, followups: false }));
                      setScheduleContext("normal");
                    }}
                    onSchedule={async (p) => {
                      if (scheduleContext === "meetingOnly") {
                        await handleScheduleMeetingOnly(p);
                      } else if (scheduleContext === "interestedMeta") {
                        await handleInterestedMeta(p);
                      } else {
                        await handleSchedule(p);
                      }
                    }}
                    initialType="virtual"
                    initialDate={undefined}
                    mode={"followups"}
                    context={scheduleContext}
                    parentFilterActive={parentCompanyFilterActive}
                    parentCompanyOptions={parentCompanyOptions}
                  />
                )}

                {/* Not Interested inline panel */}
                {openSections.not_interested && (
                  <ScheduleModal
                    open={openSections.not_interested}
                    onClose={() => {
                      setOpenSections((prev) => ({ ...prev, not_interested: false }));
                      setScheduleContext("normal");
                    }}
                    onSchedule={async (p) => {
                      if (scheduleContext === "meetingOnly") {
                        await handleScheduleMeetingOnly(p);
                      } else if (scheduleContext === "interestedMeta") {
                        await handleInterestedMeta(p);
                      } else {
                        await handleSchedule(p);
                      }
                    }}
                    initialType="virtual"
                    initialDate={undefined}
                    mode={"not_interested"}
                    context={scheduleContext}
                    parentFilterActive={parentCompanyFilterActive}
                    parentCompanyOptions={parentCompanyOptions}
                  />
                )}

                {/* Meeting Manage inline panel */}
                {openSections.meetings && (
                  <MeetingManageModal
                    open={openSections.meetings}
                    onClose={() => setOpenSections((prev) => ({ ...prev, meetings: false }))}
                    onScheduleMeeting={handleScheduleFromMeetingButton}
                    onUpdateStatus={handleMeetingStatusFromMeetingButton}
                    parentFilterActive={parentCompanyFilterActive}
                    parentCompanyOptions={parentCompanyOptions}
                  />
                )}
              </div>
            </div>

            {/* ONLY Activities below pills */}
            <div>
              <h4 className="text-md font-semibold mb-3">Activities</h4>

              <div className="flex flex-wrap gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">From</span>
                  <input
                    type="date"
                    value={activityFrom}
                    onChange={(e) => setActivityFrom(e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">To</span>
                  <input
                    type="date"
                    value={activityTo}
                    onChange={(e) => setActivityTo(e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  />
                </div>

                {/* Company Filter */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Company</span>
                  <select
                    value={activityCompanyFilter}
                    onChange={(e) =>
                      setActivityCompanyFilter(e.target.value)
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="ALL">All Companies</option>
                    {activityCompanyOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Activity Type Filter */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Activity Type</span>
                  <select
                    value={activityTypeFilter}
                    onChange={(e) =>
                      setActivityTypeFilter(
                        e.target.value as
                        | "ALL"
                        | "INTERESTED"
                        | "FOLLOWUPS"
                        | "NOT_INTERESTED"
                      )
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="ALL">All Activities</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="FOLLOWUPS">Followups</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Sort By</span>
                  <select
                    value={activitySortKey}
                    onChange={(e) =>
                      setActivitySortKey(
                        e.target.value as "date" | "company" | "activity"
                      )
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="date">Date</option>
                    <option value="company">Company Name</option>
                  </select>
                  <select
                    value={activitySortDir}
                    onChange={(e) =>
                      setActivitySortDir(e.target.value as "asc" | "desc")
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="desc">
                      {activitySortKey === "date"
                        ? "Newest → Oldest"
                        : "Z → A"}
                    </option>
                    <option value="asc">
                      {activitySortKey === "date"
                        ? "Oldest → Newest"
                        : "A → Z"}
                    </option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={handleClearActivityFilters}
                    className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Clear filters
                  </button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 text-xs font-semibold bg-gray-50 border-b px-3 py-2 text-gray-700">
                  <div>Date</div>
                  <div>Investor Name</div>
                  <div>Company</div>
                  <div>Meetings</div>
                  <div>Interested</div>
                  <div>Followups</div>
                  <div>Not Interested</div>
                  <div>Comments / Notes</div>
                </div>

                {activities.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-gray-500">
                    No activities in this period (last 5 days by default).
                  </div>
                ) : (
                  activities.map((act) => (
                    <div
                      key={act.key}
                      className="grid grid-cols-8 text-xs px-3 py-2 border-b last:border-b-0 text-gray-700"
                    >
                      <div className="truncate" title={act.displayDate || ""}>
                        {act.displayDate || "—"}
                      </div>
                      <div className="truncate" title={investorName || ""}>
                        {investorName || "—"}
                      </div>
                      <div
                        className="truncate"
                        title={act.companyName || ""}
                      >
                        {act.companyName || "—"}
                      </div>
                      <div
                        className="truncate"
                        title={act.meetingText || ""}
                      >
                        {act.meetingText || "—"}
                      </div>
                      <div
                        className="truncate"
                        title={act.interestedText || ""}
                      >
                        {act.interestedText || "—"}
                      </div>
                      <div
                        className="truncate"
                        title={act.followupText || ""}
                      >
                        {act.followupText || "—"}
                      </div>
                      <div
                        className="truncate"
                        title={act.notInterestedText || ""}
                      >
                        {act.notInterestedText || "—"}
                      </div>
                      <div className="truncate" title={act.comments || ""}>
                        {act.comments || "—"}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-1 text-[11px] text-gray-400">
                Showing last 5 days by default. Use the date filter above to
                view a custom range.
              </div>
            </div>
          </div>

          {/* Mark Done Modal (same UX as InvestorCard Mark-done modal) */}
          {markDoneModalOpen && (
            <div
              className="fixed inset-0 z-[1950] flex items-center justify-center"
              role="dialog"
              aria-modal
              onClick={() => setMarkDoneModalOpen(false)}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div
                className="relative z-10 bg-white rounded-lg shadow-lg w-[480px] max-w-[95%] p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Mark Meeting Done
                </h3>

                {/* Company selector (required) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Company (required)
                  </label>
                  {markDoneSelectedCompany ? (
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {markDoneSelectedCompany.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => setMarkDoneSelectedCompany(null)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  ) : parentCompanyFilterActive && parentCompanyOptions.length > 0 ? (
                    <div className="max-h-48 overflow-auto border rounded p-2">
                      {parentCompanyOptions.map((c: any) => {
                        const cid = String(c.id ?? c.company_id ?? c.companyId ?? "");
                        const selectedId = String(markDoneSelectedCompany?.id ?? markDoneSelectedCompany?.company_id ?? "");
                        const isSelected = selectedId === cid;
                        const statusText =
                          c.status ??
                          (c.active !== undefined ? (c.active ? "Active" : "Inactive") : (c.isActive !== undefined ? (c.isActive ? "Active" : "Inactive") : c.state || ""));

                        return (
                          <div
                            key={cid}
                            className={`flex items-start gap-3 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-blue-50 ring-1 ring-blue-200" : ""}`}
                            onClick={() => setMarkDoneSelectedCompany(c)}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <input
                                type="checkbox"
                                readOnly
                                checked={isSelected}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium truncate">{c.name}</div>
                                <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">{statusText}</div>
                              </div>
                              <div className="text-xs text-gray-500 truncate mt-1">{c.website ?? c.web ?? ""}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search company by name..."
                        value={markDoneCompanyQuery}
                        onChange={(e) =>
                          setMarkDoneCompanyQuery(e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                      {markDoneCompanySearching && (
                        <div className="absolute right-3 top-3 text-xs text-gray-500">
                          Searching…
                        </div>
                      )}
                      {markDoneCompanyResults &&
                        markDoneCompanyResults.length > 0 &&
                        markDoneCompanyQuery.trim().length > 0 && (
                          <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow z-50 max-h-48 overflow-auto">
                            {markDoneCompanyResults.map((c: any) => (
                              <button
                                key={c.id ?? c.name}
                                onClick={() => {
                                  setMarkDoneSelectedCompany(c);
                                  setMarkDoneCompanyResults([]);
                                  setMarkDoneCompanyQuery("");
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0"
                              >
                                <div className="font-medium">{c.name}</div>
                                <div className="text-xs text-gray-500 truncate">
                                  {c.website ?? c.web ?? ""}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded bg-gray-100"
                    onClick={() => setMarkDoneModalOpen(false)}
                    disabled={isProcessing}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-green-600 text-white"
                    disabled={isProcessing}
                    onClick={() => {
                      if (!markDoneSelectedCompany) {
                        alert("Please select a company first.");
                        return;
                      }
                      const companyId =
                        markDoneSelectedCompany.id ??
                        markDoneSelectedCompany.company_id ??
                        null;
                      if (!companyId) {
                        alert("Selected company is missing an id.");
                        return;
                      }
                      handleMarkDoneFromDrawer(String(companyId));
                      setMarkDoneModalOpen(false);
                    }}
                  >
                    Mark done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DrawerPortal>
  );
};

export default InvestorDetailDrawer;


































