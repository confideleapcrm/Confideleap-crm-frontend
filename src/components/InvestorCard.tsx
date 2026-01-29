// src/components/InvestorCard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Star,
  ChevronDown,
  Copy,
} from "lucide-react";
import {
  recordInvestorContactStatus,
  getMeetingsForInvestor,
  updateMeeting,
  createMeeting,
  // ✅ used to ensure company_id is stored in investor_lists
  addInvestorToList,
} from "../services/investorService";
import { getCompanies } from "../services/companyService";
import debounce from "lodash/debounce";

/* Inline WhatsApp SVG icon (small, monochrome) */
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 0 5.373 0 12c0 2.116.552 4.172 1.6 6.005L0 24l6.182-1.604A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.205-1.249-6.205-3.48-8.52zM12 21.6a9.58 9.58 0 01-4.89-1.3l-.35-.21-3.67.95.98-3.57-.23-.37A9.6 9.6 0 1121.6 12 9.57 9.57 0 0112 21.6z" />
    <path d="M17.04 14.43c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.71.9-.87 1.09-.16.18-.33.2-.61.07a6.3 6.3 0 01-1.86-1.15 7.05 7.05 0 01-1.31-1.62c-.13-.23 0-.35.1-.47.1-.1.22-.25.33-.37.11-.12.14-.21.22-.36.08-.15.04-.28-.02-.42-.06-.14-.61-1.47-.84-2.02-.22-.52-.45-.44-.61-.45l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.28s.98 2.65 1.12 2.83c.14.19 1.93 2.96 4.68 4.13 1.29.53 2.3.84 3.09 1.07.65.19 1.25.16 1.72.1.52-.07 1.65-.67 1.88-1.32.23-.66.23-1.22.16-1.34-.07-.12-.25-.18-.53-.32z" />
  </svg>
);

const prettyStatus = (s?: string | null) => {
  if (!s) return "";
  return String(s)
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

type CardListContext =
  | "interested"
  | "followups"
  | "not_interested"
  | "meetings"
  | "meeting" // NEW: list_type = 'meeting'
  | "all"
  | "matching"
  | undefined;

const InvestorCard: React.FC<{
  investor: any;
  onOpenDetails?: (
    id: string,
    mode?: "interested" | "followups" | "not_interested" | "meetings",
  ) => void;
  contextListType?: CardListContext;
}> = ({ investor, onOpenDetails, contextListType }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // === state for Meetings / Followups interested actions + schedule modal ===
  const [showMeetActions, setShowMeetActions] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [meetingType, setMeetingType] = useState<"virtual" | "physical">(
    "virtual",
  );
  const [meetingDateTime, setMeetingDateTime] = useState("");
  const meetingNotesRef = useRef<HTMLTextAreaElement | null>(null);
  const [companyQueryLocal, setCompanyQueryLocal] = useState("");
  const [companyResultsLocal, setCompanyResultsLocal] = useState<any[]>([]);
  const [companySearchingLocal, setCompanySearchingLocal] = useState(false);
  const [selectedCompanyLocal, setSelectedCompanyLocal] = useState<any | null>(
    null,
  );
  const [isMeetingActionLoading, setIsMeetingActionLoading] = useState(false);

  // === state for Mark-done modal ===
  const [markDoneModalOpen, setMarkDoneModalOpen] = useState(false);
  const [markDoneCompanyQuery, setMarkDoneCompanyQuery] = useState("");
  const [markDoneCompanyResults, setMarkDoneCompanyResults] = useState<any[]>(
    [],
  );
  const [markDoneCompanySearching, setMarkDoneCompanySearching] =
    useState(false);
  const [markDoneSelectedCompany, setMarkDoneSelectedCompany] = useState<
    any | null
  >(null);

  // debounced company search for schedule modal
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
    [],
  );

  // debounced company search for Mark-done modal
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
    [],
  );

  useEffect(() => {
    if (!scheduleModalOpen) return;
    doLocalCompanySearch(companyQueryLocal);
    return () => {
      doLocalCompanySearch.cancel();
    };
  }, [companyQueryLocal, doLocalCompanySearch, scheduleModalOpen]);

  useEffect(() => {
    if (!markDoneModalOpen) return;
    doMarkDoneCompanySearch(markDoneCompanyQuery);
    return () => {
      doMarkDoneCompanySearch.cancel();
    };
  }, [markDoneModalOpen, markDoneCompanyQuery, doMarkDoneCompanySearch]);

  useEffect(() => {
    if (markDoneModalOpen) {
      setMarkDoneCompanyQuery("");
      setMarkDoneCompanyResults([]);
      setMarkDoneSelectedCompany(null);
    }
  }, [markDoneModalOpen]);

  const initialStatus =
    investor?.latest_contact_status ||
    investor?.contact_status ||
    investor?.lastContactStatus ||
    investor?.last_contact_status ||
    null;
  const [contactStatusInternal, setContactStatusInternal] = useState<
    string | null
  >(initialStatus ? prettyStatus(initialStatus) : null);

  const getStatusColor = (statusRaw: string | undefined | null) => {
    const status = (statusRaw || "").toString().toLowerCase();
    if (status === "called") return "bg-blue-100 text-blue-800 border-blue-200";
    if (status === "messaged")
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    if (status === "not_picked" || status === "not picked")
      return "bg_gray-100 text-gray-800 border-gray-200";
    if (status === "not_reachable" || status === "not reachable")
      return "bg-gray-100 text-gray-800 border-gray-200";
    switch (status) {
      case "hot":
        return "bg-red-100 text-red-800 border-red-200";
      case "warm":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "contacted":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFitColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

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
      `Hi,\n\nI am reaching out regarding Investor record with ID: ${decodedId}\n\n(Please add message here)\n\nRegards,`,
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const telHref = investor.phone ? `tel:${investor.phone}` : undefined;
  const mailHref = investor.email
    ? buildMailTo(investor.email, investor.id)
    : undefined;

  const firmType =
    investor.firm?.type ||
    (investor.firm_type ? investor.firm_type : "") ||
    investor.firm?.category ||
    "";

  const investorAum = investor.aum || investor.firm?.aum || "";
  const buySell =
    investor.buy_sell_side ||
    investor.buySell ||
    investor.buySellSide ||
    investor.buy_sell ||
    "";

  const derivedStatusRaw =
    (contactStatusInternal && contactStatusInternal.trim()) ||
    investor?.latest_contact_status ||
    investor?.contact_status ||
    investor?.last_contact_status ||
    // investor?.status ||
    // null;
    "not called";
  const derivedStatusDisplay = derivedStatusRaw
    ? prettyStatus(String(derivedStatusRaw))
    : "Unknown";

  const portfolioFitScore =
    typeof investor?.portfolioFit === "number"
      ? investor.portfolioFit
      : (investor?.portfolioFit?.overallFitScore ??
        investor?.snapshot?.portfolioFit?.overallFitScore ??
        investor?.portfolio_fit_score ??
        0);

  const effectiveListType = (): string | null => {
    // Prefer explicit contextListType if present (and not generic "matching"/"all")
    if (
      contextListType &&
      contextListType !== "matching" &&
      contextListType !== "all"
    ) {
      return contextListType;
    }

    return (
      investor?.list_type ||
      investor?.snapshot?.list_type ||
      investor?.__listSource ||
      (investor &&
        (investor._listType || (investor._optimistic && investor.list_type))) ||
      null
    );
  };

  // contact status recording
  const handleSetContactStatus = async (
    status: "called" | "not_picked" | "not_reachable",
  ) => {
    try {
      await recordInvestorContactStatus({ investor_id: investor.id, status });
      setContactStatusInternal(prettyStatus(status));
      window.dispatchEvent(
        new CustomEvent("investorContactStatusChanged", {
          detail: { investor_id: investor.id, status },
        }),
      );
      // alert(`Status saved: ${prettyStatus(status)}`);
    } catch (err) {
      console.error(err);
      // alert("Failed to save status");
    } finally {
      setShowStatusMenu(false);
    }
  };

  const handleMailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!mailHref) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    try {
      window.location.href = mailHref;
    } catch {
      window.location.assign(mailHref);
    }
  };

  // Render snapshot metadata
  const renderSnapshotMetadata = () => {
    const snap =
      investor?.snapshot || investor?.scheduling || (investor && investor);
    const notInterested =
      investor?.notInterestedNote ||
      investor?.snapshot?.notInterestedNote ||
      investor?.snapshot?.not_interested_note ||
      investor?.not_interested_note;
    const latestContact =
      investor?.latest_contact_status ||
      investor?.snapshot?.latest_contact_status;

    const listType = effectiveListType();

    // ❗ Hide scheduled / follow-up date-time info on
    // Interested, Followups, Meetings and Meeting lists (per requirement).
    const hideTimelineInfo =
      listType === "interested" ||
      listType === "followups" ||
      listType === "meetings" ||
      listType === "meeting";

    // ❗ For NOT INTERESTED list on Investor Targeting page,
    // we don't want to show the "Not interested" text + comment block.
    if (
      listType === "not_interested" &&
      notInterested &&
      contextListType !== "not_interested"
    ) {
      return (
        <div className="px-6 pb-2">
          <div className="text-xs text-gray-500">Not interested</div>
          <div className="text-sm text-gray-600 mt-1 truncate">
            {notInterested}
          </div>
        </div>
      );
    }

    const meetLink =
      (snap && (snap.meet_link || snap.meetLink || snap.link)) ||
      investor?.meet_link ||
      investor?.snapshot?.meet_link ||
      null;

    const dateTimeRaw =
      (snap &&
        (snap.meeting_datetime ||
          snap.meetingDate ||
          snap.dateTime ||
          snap.date)) ||
      snap?.dateTime ||
      null;
    const dt = dateTimeRaw ? new Date(dateTimeRaw).toLocaleString() : null;

    const isFollowup =
      listType === "followups" ||
      Boolean(
        snap &&
        (snap.followup_id ||
          snap.followup_datetime ||
          snap.followupDatetime ||
          snap.followupDate),
      );

    // ✅ Only show meeting / followup label + date/time when NOT in
    // Interested, Followups, Meetings or Meeting lists
    if (
      !hideTimelineInfo &&
      snap &&
      (dateTimeRaw ||
        snap?.notes ||
        meetLink ||
        (snap.meetingType && snap.meetingType))
    ) {
      const label = isFollowup
        ? "Follow-up call"
        : snap.meetingType
          ? `Scheduled ${snap.meetingType}`
          : "Scheduled meeting";

      return (
        <div className="px-6 pb-2">
          <div className="text-xs text-gray-500">{label}</div>

          {dt && <div className="text-sm font-medium text-gray-800">{dt}</div>}

          {snap?.notes && (
            <div className="text-sm text-gray-600 mt-1 truncate">
              {snap.notes}
            </div>
          )}

          {listType === "interested" && meetLink && (
            <div className="mt-2 flex items-center space-x-3">
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Open meeting link
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(meetLink);
                      alert("Meeting link copied to clipboard");
                    } else {
                      const dummy = document.createElement("textarea");
                      dummy.value = meetLink;
                      dummy.style.position = "fixed";
                      dummy.style.left = "-9999px";
                      document.body.appendChild(dummy);
                      dummy.select();
                      // eslint-disable-next-line deprecation/deprecation
                      document.execCommand("copy");
                      document.body.removeChild(dummy);
                      alert("Meeting link copied to clipboard");
                    }
                  } catch (err) {
                    console.error("copy failed", err);
                    alert("Unable to copy link");
                  }
                }}
                title="Copy meeting link"
                className="text-sm px-2 py-1 border rounded bg-gray-50 hover:bg-gray-100 inline-flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    if (
      listType !== "not_interested" && // we already handled this above
      notInterested
    ) {
      return (
        <div className="px-6 pb-2">
          <div className="text-xs text-gray-500">Not interested</div>
          <div className="text-sm text-gray-600 mt-1 truncate">
            {notInterested}
          </div>
        </div>
      );
    }

    if (latestContact) {
      return (
        <div className="px-6 pb-2">
          <div className="text-xs text-gray-500">Latest</div>
          <div className="text-sm font-medium text-gray-800">
            {prettyStatus(latestContact)}
          </div>
        </div>
      );
    }

    return null;
  };
  // ===== Helpers for Meetings / Followups list actions =====
  const resolveInvestorId = () =>
    String(investor.investor_id || investor.id || "");

  const handleScheduleMeetingFromCard = async () => {
    const investorId = resolveInvestorId();
    if (!investorId) {
      alert("Missing investor id for meeting");
      return;
    }
    if (!meetingDateTime) {
      alert("Please select date & time");
      return;
    }

    const notes = meetingNotesRef.current?.value || null;
    const companyId =
      (selectedCompanyLocal &&
        (selectedCompanyLocal.id || selectedCompanyLocal.company_id)) ||
      null;

    const payload = {
      investor_id: investorId,
      company_id: companyId,
      meeting_type: meetingType,
      meeting_datetime: meetingDateTime,
      notes,
    };

    setIsMeetingActionLoading(true);
    try {
      // 1️⃣ Create meeting as before
      await createMeeting(payload as any);

      // 2️⃣ Additionally ensure investor_lists has this company_id
      if (companyId) {
        try {
          const baseSnap: any = investor.snapshot || investor;

          const snapshot: any = {
            id: baseSnap.id || investorId,
            firm: baseSnap.firm || null,
            name: baseSnap.name,
            email: baseSnap.email || "",
            phone: baseSnap.phone || "",
            portfolioFit:
              baseSnap.portfolioFit ?? baseSnap.portfolio_fit_score ?? 0,
          };

          await addInvestorToList({
            investor_id: investorId,
            list_type: "interested",
            company_id: companyId,
            snapshot,
          } as any);
        } catch (e) {
          console.error(
            "addInvestorToList with company_id failed (non-blocking)",
            e,
          );
        }
      }

      alert("Meeting scheduled successfully");
      setScheduleModalOpen(false);
      window.dispatchEvent(new Event("investorMeetingCreated"));
    } catch (err) {
      console.error("createMeeting from card failed", err);
      alert("Failed to schedule meeting");
    } finally {
      setIsMeetingActionLoading(false);
    }
  };

  // Mark-done logic that requires a companyId (from modal)
  const handleMarkDoneFromCard = async (companyId: string) => {
    const investorId = resolveInvestorId();
    if (!investorId) {
      alert("Missing investor id");
      return;
    }
    if (!companyId) {
      alert("Missing company id");
      return;
    }

    setIsMeetingActionLoading(true);
    try {
      const res = await getMeetingsForInvestor(investorId);
      const items: any[] = (res?.items || res || []) as any[];

      if (!items || items.length === 0) {
        alert("No meetings found for this investor");
        setIsMeetingActionLoading(false);
        return;
      }

      const filtered = items.filter(
        (m) =>
          String(m.company_id || "") === String(companyId) &&
          (m.meeting_status || m.status) !== "completed",
      );

      if (!filtered.length) {
        alert("No scheduled meeting found for this investor & company");
        setIsMeetingActionLoading(false);
        return;
      }

      const latest = filtered.reduce((acc, cur) => {
        const accTime = new Date(
          acc.meeting_datetime || acc.created_at || 0,
        ).getTime();
        const curTime = new Date(
          cur.meeting_datetime || cur.created_at || 0,
        ).getTime();
        return curTime > accTime ? cur : acc;
      });

      await updateMeeting(latest.id, { meeting_status: "completed" });
      alert("Meeting marked as completed");
      window.dispatchEvent(new Event("investorMeetingCreated"));
    } catch (err) {
      console.error("Mark done failed", err);
      alert("Failed to update meeting status");
    } finally {
      setIsMeetingActionLoading(false);
    }
  };

  // ✅ helper: open Schedule Meeting modal from Followups → Interested
  const handleInterestedFromFollowups = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();

    // reset modal fields similar to drawer behaviour
    setMeetingType("virtual");
    setMeetingDateTime("");
    if (meetingNotesRef.current) meetingNotesRef.current.value = "";
    setCompanyQueryLocal("");
    setCompanyResultsLocal([]);
    setSelectedCompanyLocal(null);

    setScheduleModalOpen(true);
  };

  // ===== List action buttons (pills + meet actions) =====
  const listActionButtons = () => {
    if (!onOpenDetails) return null;

    const listType = effectiveListType();
    const ctx = contextListType;

    // For Investor Targeting lists, user does not want these pills/buttons.
    if (
      ctx === "interested" ||
      ctx === "followups" ||
      ctx === "not_interested" ||
      ctx === "meetings" ||
      ctx === "meeting"
    ) {
      return null;
    }

    const investorId = String(investor.id || investor.investor_id);

    // 🔹 Interested list: ONLY Followups + Not Interested
    if (listType === "interested") {
      return (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(investorId, "followups");
            }}
            className="px-3 py-1 rounded-full border border-yellow-300 bg-yellow-50 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
          >
            Followups
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(investorId, "not_interested");
            }}
            className="px-3 py-1 rounded-full border border-red-300 bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100"
          >
            Not Interested
          </button>
        </div>
      );
    }

    // 🔹 Followups list: ALL THREE (Interested + Followups + Not Interested)
    //     Interested now opens the Schedule Meeting modal directly
    if (listType === "followups") {
      return (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleInterestedFromFollowups}
            className="px-3 py-1 rounded-full border border-green-300 bg-green-50 text-xs font-medium text-green-700 hover:bg-green-100"
          >
            Interested
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(investorId, "followups");
            }}
            className="px-3 py-1 rounded-full border border-yellow-300 bg-yellow-50 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
          >
            Followups
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(investorId, "not_interested");
            }}
            className="px-3 py-1 rounded-full border border-red-300 bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100"
          >
            Not Interested
          </button>
        </div>
      );
    }

    // 🔹 Meetings & Meeting lists: add Followups & Not Interested pills, keep Meet/Schedule/Mark done
    if (listType === "meetings" || listType === "meeting") {
      return (
        <div className="px-6 pb-2 flex flex-col gap-2">
          {/* Pills row */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(investorId, "followups");
              }}
              className="px-3 py-1 rounded-full border border-yellow-300 bg-yellow-50 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
            >
              Followups
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(investorId, "not_interested");
              }}
              className="px-3 py-1 rounded-full border border-red-300 bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100"
            >
              Not Interested
            </button>
          </div>

          {/* Meet + Schedule / Mark done (existing behaviour) */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMeetActions((prev) => !prev);
              }}
              className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              Meet
            </button>

            {showMeetActions && (
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScheduleModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  disabled={isMeetingActionLoading}
                >
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMarkDoneModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-full border border-green-300 bg-green-50 text-xs font-medium text-green-700 hover:bg-green-100"
                  disabled={isMeetingActionLoading}
                >
                  Mark done
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 relative h-full overflow-visible flex flex-col cursor-pointer"
        onClick={() =>
          onOpenDetails &&
          onOpenDetails(String(investor.id || investor.investor_id))
        }
        role="button"
        aria-label={`Open details for ${
          investor.name || investor.first_name || ""
        }`}
      >
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4 min-h-[64px] relative z-20">
            <div className="flex items-center min-w-0">
              <img
                src={
                  investor.avatarUrl ||
                  investor.avatar ||
                  investor.avatar_url ||
                  "https://ui-avatars.com/api/?name=Investor&background=0D8ABC&color=fff"
                }
                alt={
                  investor.name ||
                  `${investor.first_name} ${investor.last_name}`
                }
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="ml-4 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {investor.firm?.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {investor.job_title || investor.role}
                </p>
                <p className="text-sm font-medium text-blue-600 truncate">
                  {/* {investor.firm?.name} */}
                  {investor.name ||
                    `${investor.first_name || ""} ${investor.last_name || ""}`}
                </p>
                {firmType && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Category: {firmType}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 min-w-[88px]">
              {/* ❗ Hide the Unknown/Hot/Cold/Warm badge on Investor Targeting lists */}
              {!(
                contextListType === "interested" ||
                contextListType === "followups" ||
                contextListType === "not_interested" ||
                contextListType === "meetings" ||
                contextListType === "meeting"
              ) && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    (derivedStatusRaw || "").toString().toLowerCase(),
                  )} whitespace-nowrap`}
                >
                  {derivedStatusDisplay}
                </span>
              )}
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span
                  className={`text-sm font-semibold ${getFitColor(portfolioFitScore)} max-w-[90px] truncate whitespace-nowrap text-right`}
                >
                  {portfolioFitScore}% fit
                </span>
              </div>
            </div>
          </div>

          {/* Snapshot metadata */}
          {renderSnapshotMetadata()}

          {/* List action buttons (pills / Meet etc.) */}
          {listActionButtons()}

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 min-h-[64px]">
            <div className="flex items-center truncate">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{investor.location}</span>
            </div>
            <div className="flex items-center truncate">
              <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {investorAum || investor.averageInvestment || "—"}
              </span>
            </div>
            <div className="flex items-center truncate">
              <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {investor.portfolioSize || investor.portfolio_size || "—"}
              </span>
            </div>
            <div className="flex items-center truncate">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {investor.stages && investor.stages.join
                  ? investor.stages.join(", ")
                  : investor.investment_stages
                    ? investor.investment_stages.join(", ")
                    : ""}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Sector Focus
            </p>
            <div className="flex flex-wrap gap-1">
              {(
                investor.sectors ||
                investor.sector_preferences ||
                investor.sectorPreferences ||
                []
              ).map((sector: any) => (
                <span
                  key={sector}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {sector}
                </span>
              ))}
              {((investor.sectors && investor.sectors.length === 0) ||
                (investor.sector_preferences &&
                  investor.sector_preferences.length === 0)) && (
                <span className="text-xs text-gray-400">
                  No sector specified
                </span>
              )}
            </div>

            {buySell && (
              <div className="mt-2 text-sm text-gray-700">
                <strong>Buy/Sell:</strong> {buySell}
              </div>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="p-6 pt-0 border-t border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <a
              href={telHref || "#"}
              className={`flex-1 px-3 py-2 rounded-full text-sm font-medium flex items-center justify-center ${
                telHref
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!telHref) e.preventDefault();
                e.stopPropagation();
              }}
              aria-disabled={!telHref}
              title={telHref ? "Call investor" : "Phone not available"}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </a>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setShowStatusMenu(!showStatusMenu);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-blue-300 bg-blue-50 text-blue-700 shadow-sm hover:bg-blue-100 transition-colors"
                title="Record contact status"
              >
                <span className="text-sm">
                  {contactStatusInternal || "Called"}
                </span>

                <ChevronDown className="w-4 h-4" />
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => handleSetContactStatus("called")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Called
                  </button>
                  <div className="border-t" />
                  <button
                    onClick={() => handleSetContactStatus("not_picked")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Not Picked
                  </button>
                  <div className="border-t" />
                  <button
                    onClick={() => handleSetContactStatus("not_reachable")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Not Reachable
                  </button>
                </div>
              )}
            </div>

            <a
              href={mailHref || "#"}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleMailClick(e);
              }}
              title={mailHref ? "Email investor" : "Email not available"}
            >
              <Mail className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const phone = investor.phone
                  ? String(investor.phone).replace(/\D/g, "").replace(/^0+/, "")
                  : null;
                const text = encodeURIComponent(
                  `Hello ${investor.name || ""},`,
                );
                const url = phone
                  ? `https://wa.me/${phone}?text=${text}`
                  : `https://web.whatsapp.com/send?text=${text}`;
                window.open(url, "_blank");
              }}
              className="px-3 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              title="WhatsApp"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </button>

            <a
              href={investor.linkedin || investor.linkedin_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                if (!investor.linkedin && !investor.linkedin_url)
                  e.preventDefault();
              }}
              title={
                investor.linkedin || investor.linkedin_url
                  ? "Open LinkedIn profile"
                  : "LinkedIn not available"
              }
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Compact indicator area  */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Click card for more details
            </div>
            <div className="text-xs text-gray-400"> </div>
          </div>
        </div>
      </div>

      {/* ===== Schedule Meeting Modal ===== */}
      {scheduleModalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center"
          role="dialog"
          aria-modal
          onClick={() => setScheduleModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative z-10 bg-white rounded-lg shadow-lg w-[560px] max-w-[95%] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Schedule Meeting</h3>

            {/* Company selector */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">
                Company (optional)
              </label>
              {selectedCompanyLocal ? (
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
              )}
            </div>

            {/* Type */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${
                    meetingType === "virtual"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setMeetingType("virtual")}
                >
                  Virtual
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${
                    meetingType === "physical"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setMeetingType("physical")}
                >
                  Physical
                </button>
              </div>
            </div>

            {/* Date & Time */}
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

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                ref={meetingNotesRef}
                rows={5}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border rounded bg-gray-100"
                onClick={() => setScheduleModalOpen(false)}
                disabled={isMeetingActionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleScheduleMeetingFromCard}
                disabled={isMeetingActionLoading}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Mark Done Modal ===== */}
      {markDoneModalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center"
          role="dialog"
          aria-modal
          onClick={() => setMarkDoneModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative z-10 bg-white rounded-lg shadow-lg w-[480px] max-w-[95%] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Mark Meeting Done</h3>

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
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search company by name..."
                    value={markDoneCompanyQuery}
                    onChange={(e) => setMarkDoneCompanyQuery(e.target.value)}
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
                disabled={isMeetingActionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-green-600 text-white"
                disabled={isMeetingActionLoading}
                onClick={() => {
                  if (!markDoneSelectedCompany) {
                    alert("Please select a company first.");
                    return;
                  }
                  const companyId =
                    markDoneSelectedCompany.id ||
                    markDoneSelectedCompany.company_id ||
                    null;
                  if (!companyId) {
                    alert("Selected company is missing an id.");
                    return;
                  }
                  handleMarkDoneFromCard(String(companyId));
                  setMarkDoneModalOpen(false);
                }}
              >
                Mark done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestorCard;
