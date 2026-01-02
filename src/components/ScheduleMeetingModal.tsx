// src/components/ScheduleMeetingModal.tsx
import React, { useState, useEffect } from "react";
import { generateMeetForMeeting } from "../services/investorService";

interface Props {
  open: boolean;
  investorId?: string | null;
  initialMeetingId?: string | null;
  onClose: () => void;
  onSaved?: (meeting: any) => void;
}

const ScheduleMeetingModal: React.FC<Props> = ({ open, investorId = null, initialMeetingId = null, onClose, onSaved }) => {
  const [meetingType, setMeetingType] = useState<"virtual" | "physical">("virtual");
  const [datetime, setDatetime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) {
      setMeetingType("virtual");
      setDatetime("");
      setNotes("");
      setCreating(false);
    }
  }, [open]);

  if (!open) return null;

  const iso = (localDt: string | null) => {
    if (!localDt) return null;
    const d = new Date(localDt);
    return isNaN(d.getTime()) ? localDt : d.toISOString();
  };

  // Optionally your app can call your createMeeting endpoint here.
  // This modal includes a convenience to "Generate Meet" later for an existing meeting.
  const handleGenerateMeet = async (meetingId: string) => {
    try {
      setCreating(true);
      const resp = await generateMeetForMeeting(meetingId);
      const meeting = resp?.meeting ?? resp ?? null;
      onSaved && meeting && onSaved(meeting);
      alert("Meet link generated (if Google connected).");
    } catch (err: any) {
      console.error("generate meet failed", err);
      if (err?.payload?.google_create_status || err?.google_create_status) {
        const code = err?.payload?.google_create_status || err?.google_create_status;
        alert("Google not connected for the meeting owner: " + code);
      } else alert("Failed to generate meet link.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-5 z-10">
        <h3 className="text-lg font-semibold mb-3">Schedule Meeting</h3>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Type</label>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded ${meetingType === "virtual" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setMeetingType("virtual")}>Virtual</button>
              <button className={`px-3 py-1 rounded ${meetingType === "physical" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setMeetingType("physical")}>Physical</button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Date & Time</label>
            <input type="datetime-local" className="w-full px-3 py-2 border rounded" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Notes</label>
            <textarea className="w-full px-3 py-2 border rounded" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <button className="px-3 py-2 border rounded bg-gray-100" onClick={onClose}>Cancel</button>
            <button
              className="px-3 py-2 rounded bg-blue-600 text-white"
              onClick={() => {
                // Your app should call createMeeting endpoint here. This modal is intentionally lightweight.
                alert("This modal is a helper. Call your createMeeting endpoint from the parent and then call generateMeetForMeeting(meetingId) if needed.");
              }}
            >
              Save
            </button>
          </div>

          {initialMeetingId && (
            <div className="mt-3 border-t pt-3">
              <div className="text-sm text-gray-600 mb-2">Existing meeting actions</div>
              <div className="flex gap-2">
                <button className="px-3 py-2 border rounded bg-gray-50" onClick={() => handleGenerateMeet(initialMeetingId)} disabled={creating}>
                  {creating ? "Generating..." : "Generate Meet"}
                </button>
                <button className="px-3 py-2 border rounded bg-gray-50" onClick={() => { navigator.clipboard?.writeText(`Meeting scheduled: ${datetime || "See app"}`); alert("Meeting info copied"); }}>
                  Copy Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;

