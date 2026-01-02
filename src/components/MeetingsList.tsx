// src/components/MeetingsList.tsx
import React, { useEffect, useState } from "react";
import { Clock, Link as LinkIcon, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import {
  getMeetingsForInvestor,
  updateMeeting,
  generateMeetForMeeting,
} from "../services/investorService";
import PostMeetOutcomeModal from "./PostMeetOutcomeModal";

interface Props {
  investorId: string;
  // optional callbacks
  onMeetingUpdated?: () => void;
}

const MeetingsList: React.FC<Props> = ({ investorId, onMeetingUpdated }) => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);
  const [outcomeModalOpen, setOutcomeModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<number | string | null>(null);

  async function load() {
    if (!investorId) return;
    setLoading(true);
    try {
      const res = await getMeetingsForInvestor(investorId);
      const items = res?.items ?? res ?? [];
      setMeetings(items);
    } catch (err) {
      console.error("Failed to load meetings", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // listen for events that indicate new meetings/changes
    const onCreated = () => load();
    window.addEventListener("investorMeetingCreated", onCreated);
    window.addEventListener("investorPostMeetOutcomeSaved", onCreated);
    window.addEventListener("investorMeetingUpdated", onCreated);
    return () => {
      window.removeEventListener("investorMeetingCreated", onCreated);
      window.removeEventListener("investorPostMeetOutcomeSaved", onCreated);
      window.removeEventListener("investorMeetingUpdated", onCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investorId]);

  const setStatus = async (m: any, newStatus: string) => {
    const id = m?.id ?? m?.meeting_id;
    if (!id) return alert("Meeting id missing");
    setProcessingId(id);
    try {
      await updateMeeting(id, { meeting_status: newStatus });
      // optimistic update
      setMeetings((cur) => cur.map((x) => ( (x.id === id || x.meeting_id === id) ? { ...x, meeting_status: newStatus, status: newStatus } : x )));
      window.dispatchEvent(new Event("investorMeetingUpdated"));
      onMeetingUpdated && onMeetingUpdated();
    } catch (err) {
      console.error("setStatus failed", err);
      alert("Failed to update meeting status");
    } finally {
      setProcessingId(null);
    }
  };

  const handleGenerateMeet = async (m: any) => {
    const id = m?.id ?? m?.meeting_id;
    if (!id) return alert("Meeting ID missing");
    setProcessingId(id);
    try {
      const resp = await generateMeetForMeeting(id);
      const meeting = resp?.meeting ?? resp ?? null;
      if (resp?.google_create_status) {
        alert("Google not connected. Please connect Google in Profile/Settings.");
      } else if (meeting && (meeting.meet_link || meeting.meetLink || meeting.link)) {
        alert("Meet link created");
        // update local list
        setMeetings((cur) => cur.map((x) => ((x.id === id || x.meeting_id === id) ? { ...x, ...meeting, meet_link: meeting.meet_link ?? meeting.meetLink ?? meeting.link } : x)));
        window.dispatchEvent(new Event("investorMeetingUpdated"));
      } else {
        alert("No meet link returned");
      }
    } catch (err: any) {
      console.error("generate meet failed", err);
      if (err?.google_create_status === "NO_REFRESH_TOKEN" || (err?.message && String(err.message).toLowerCase().includes("no_refresh"))) {
        alert("Google account not connected. Please connect Google in Settings.");
      } else {
        alert("Failed to generate meet link");
      }
    } finally {
      setProcessingId(null);
    }
  };

  const openShareMail = (m: any) => {
    const to = (window as any).investorEmailLookup?.[investorId] ?? m?.investor_email ?? "";
    const time = m?.meeting_datetime ?? m?.scheduled_at ?? "";
    const link = m?.meet_link ?? m?.meetLink ?? "";
    const subject = encodeURIComponent(`Meeting: ${time}`);
    const body = encodeURIComponent(`Hi,\n\nMeeting scheduled.\n\nTime: ${time}\nLink: ${link}\n\nRegards,`);
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank");
  };

  const openWhatsApp = (m: any) => {
    const phone = (window as any).investorPhoneLookup?.[investorId] ?? m?.investor_phone ?? "";
    const ph = phone ? String(phone).replace(/\D/g, "").replace(/^0+/, "") : "";
    const time = m?.meeting_datetime ?? m?.scheduled_at ?? "";
    const link = m?.meet_link ?? m?.meetLink ?? "";
    const text = encodeURIComponent(`Meeting scheduled: ${time}\n${link}`);
    const url = ph ? `https://wa.me/${ph}?text=${text}` : `https://web.whatsapp.com/send?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Meetings</h4>
        <button onClick={() => load()} className="px-2 py-1 text-sm rounded border bg-gray-50 inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading meetings...</div>}

      {!loading && meetings.length === 0 && <div className="text-sm text-gray-500">No meetings scheduled</div>}

      <div className="space-y-2">
        {meetings.map((m) => {
          const id = m?.id ?? m?.meeting_id;
          const dt = m?.meeting_datetime ?? m?.scheduled_at ?? m?.meetingDatetime ?? null;
          const displayDt = dt ? new Date(dt).toLocaleString() : "—";
          const status = (m?.meeting_status || m?.status || "scheduled").toString().toUpperCase();
          const meetLink = m?.meet_link ?? m?.meetLink ?? m?.link ?? null;
          return (
            <div key={id} className="p-3 border rounded bg-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div className="font-medium">{displayDt}</div>
                  <div className="text-xs px-2 py-1 rounded ml-2 bg-gray-100 text-gray-800">{status}</div>
                </div>
                {m?.meeting_type && <div className="text-sm text-gray-600 mt-1">Type: {m.meeting_type}</div>}
                {m?.notes && <div className="text-sm text-gray-600 mt-1 truncate">{m.notes}</div>}
                {meetLink && (
                  <div className="mt-2">
                    <a href={meetLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline inline-flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Open meeting link
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  {status !== "CONFIRMED" && (
                    <button disabled={processingId === id} onClick={() => setStatus(m, "confirmed")} className="px-2 py-1 border rounded text-sm inline-flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Confirm
                    </button>
                  )}
                  {status !== "CANCELLED" && (
                    <button disabled={processingId === id} onClick={() => setStatus(m, "cancelled")} className="px-2 py-1 border rounded text-sm inline-flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      Cancel
                    </button>
                  )}
                  <button disabled={processingId === id} onClick={() => { setSelectedMeeting(m); setOutcomeModalOpen(true); }} className="px-2 py-1 border rounded text-sm">
                    Complete
                  </button>
                </div>

                <div className="flex gap-2">
                  {!meetLink && (
                    <button disabled={processingId === id} onClick={() => handleGenerateMeet(m)} className="px-2 py-1 border rounded text-sm">
                      Generate Meet
                    </button>
                  )}

                  <button onClick={() => openShareMail(m)} className="px-2 py-1 border rounded text-sm">Mail</button>
                  <button onClick={() => openWhatsApp(m)} className="px-2 py-1 border rounded text-sm">WhatsApp</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMeeting && (
        <PostMeetOutcomeModal
          open={outcomeModalOpen}
          onClose={() => { setOutcomeModalOpen(false); setSelectedMeeting(null); }}
          meeting={selectedMeeting}
          investorId={investorId}
          onSaved={() => {
            setOutcomeModalOpen(false);
            setSelectedMeeting(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default MeetingsList;
