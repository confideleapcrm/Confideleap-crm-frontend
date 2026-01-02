// src/components/MeetingModal.tsx
import React, { useState } from "react";
import { createMeeting } from "../services/investorService";
import { generateMeetForMeeting } from "../services/investorService";

interface Props {
  open: boolean;
  investorId: string;
  onClose: () => void;
  onSaved?: (meeting: any) => void;
  defaultCompanyId?: string | null;
}

const MeetingModal: React.FC<Props> = ({ open, investorId, onClose, onSaved, defaultCompanyId = null }) => {
  const [meetingType, setMeetingType] = useState<"virtual" | "physical">("virtual");
  const [datetime, setDatetime] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [createGoogleMeet, setCreateGoogleMeet] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState<any | null>(null);
  const [googleStatus, setGoogleStatus] = useState<string | null>(null);

  if (!open) return null;

  const isoDateString = (dtLocal: string) => {
    if (!dtLocal) return null;
    const d = new Date(dtLocal);
    if (isNaN(d.getTime())) return dtLocal;
    return d.toISOString();
  };

  const onGenerateMeetManually = async (meetingId: string | number) => {
    try {
      setSaving(true);
      const resp = await generateMeetForMeeting(meetingId);
      // resp may be { meeting: {...}, google_event: {...} } or raw meeting
      const meeting = resp?.meeting ?? resp ?? null;
      setCreatedMeeting(meeting);
      if (resp?.google_create_status) setGoogleStatus(resp.google_create_status);
      if (meeting && (meeting.meet_link || meeting.meet_link === "")) {
        alert("Meet info updated.");
      } else {
        alert("No meet link returned.");
      }
      onSaved && onSaved(meeting);
    } catch (err: any) {
      console.error("manual generate meet failed", err);
      if (err?.google_create_status === "NO_REFRESH_TOKEN" || (err?.message && String(err.message).toLowerCase().includes("no_refresh"))) {
        setGoogleStatus("no_refresh_token");
        alert("Google not connected — please connect your Google account in Settings.");
      } else {
        alert("Failed to create meeting link");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!datetime) return alert("Choose date & time");
    setSaving(true);
    try {
      const payload: any = {
        investor_id: investorId,
        company_id: defaultCompanyId || null,
        meeting_type: meetingType,
        meeting_datetime: isoDateString(datetime),
        notes: notes || null,
        status: "scheduled",
      };
      if (meetingType === "physical") payload.location = location || null;
      if (meetingType === "virtual") payload.generate_google_meet = createGoogleMeet;

      const res = await createMeeting(payload);
      const meeting = res?.meeting ?? res ?? null;
      setCreatedMeeting(meeting);

      // handle google create status returned by server
      const gcs = (res && (res.google_create_status || res.google_create_status)) || (meeting && meeting.google_create_status);
      if (gcs) {
        setGoogleStatus(String(gcs));
        if (String(gcs).toLowerCase().includes("no_refresh")) {
          // prompt user to connect Google
          if (window.confirm("Google account not connected; connect now in settings?")) {
            // open connect in new tab so user can return here
            const uid = localStorage.getItem("currentUserId") || "";
            const url = uid ? `/api/googleAuth/connect?userId=${encodeURIComponent(uid)}` : `/api/googleAuth/connect`;
            window.open(url, "_blank");
          }
        }
      }

      // If created meeting didn't come back with meet_link but user wanted a meet, we can optionally call generate_meet
      const hasLink = meeting && (meeting.meet_link || meeting.meetLink || meeting.link);
      if (!hasLink && meeting && meeting.id && createGoogleMeet) {
        // you could auto-call generate endpoint here, but safer to ask user
        if (window.confirm("No meet link created automatically. Try to generate now?")) {
          await onGenerateMeetManually(meeting.id);
        }
      }

      onSaved && onSaved(meeting);
      onClose();
      alert("Meeting scheduled.");
    } catch (err: any) {
      console.error("create meeting failed", err);
      // show actionable message if google error flagged by backend
      if (err?.google_create_status) {
        setGoogleStatus(err.google_create_status);
        if (String(err.google_create_status).toLowerCase().includes("refresh")) {
          if (window.confirm("Google account not connected. Connect now?")) {
            const uid = localStorage.getItem("currentUserId") || "";
            const url = uid ? `/api/googleAuth/connect?userId=${encodeURIComponent(uid)}` : `/api/googleAuth/connect`;
            window.open(url, "_blank");
          }
        }
      } else {
        alert("Failed to schedule meeting.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Schedule Meeting</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <div className="mt-2 flex gap-2">
              <button
                className={`px-3 py-2 rounded ${meetingType === "virtual" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                onClick={() => { setMeetingType("virtual"); setCreateGoogleMeet(true); }}
              >
                Virtual
              </button>
              <button
                className={`px-3 py-2 rounded ${meetingType === "physical" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                onClick={() => { setMeetingType("physical"); setCreateGoogleMeet(false); }}
              >
                Physical
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Date & Time</label>
            <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" />
          </div>

          {meetingType === "physical" && (
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" rows={3} />
          </div>

          {meetingType === "virtual" && (
            <div className="flex items-center space-x-2">
              <input id="createGoogle" type="checkbox" checked={createGoogleMeet} onChange={(e) => setCreateGoogleMeet(e.target.checked)} className="rounded border-gray-300" />
              <label htmlFor="createGoogle" className="text-sm text-gray-700">Create Google Meet link (requires backend + connected Google account)</label>
            </div>
          )}

          {googleStatus && (
            <div className="text-sm text-yellow-700">
              Google status: {googleStatus}. If it says "no_refresh_token" please connect Google in Settings.
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-3 py-2 rounded border bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={saving} className="px-3 py-2 rounded bg-blue-600 text-white">
              {saving ? "Saving..." : "Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
