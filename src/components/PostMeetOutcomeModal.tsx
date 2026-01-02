// src/components/PostMeetOutcomeModal.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  createInteraction,
  createFollowup,
  addInvestorToList,
  updateMeeting
} from "../services/investorService";

type Outcome = "interested" | "not_interested" | "follow_up";

interface Props {
  open: boolean;
  onClose: () => void;
  meeting: any; // meeting object from backend
  investorId: string;
  onSaved?: (result: { interaction?: any; updatedMeeting?: any }) => void;
}

const PostMeetOutcomeModal: React.FC<Props> = ({ open, onClose, meeting, investorId, onSaved }) => {
  const [selected, setSelected] = useState<Outcome | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!selected) return alert("Please choose an outcome");
    setSaving(true);
    try {
      // 1) mark meeting completed (if not already)
      const meetingId = meeting?.id ?? meeting?.meeting_id;
      let updatedMeeting: any = null;
      try {
        updatedMeeting = await updateMeeting(meetingId, { meeting_status: "completed" });
      } catch (err) {
        // log but continue: interaction is most important
        console.warn("updateMeeting (complete) failed", err);
      }

      // 2) create interaction record (post-meet outcome)
      const interactionPayload: any = {
        investor_id: investorId,
        source: "meeting",
        outcome: selected,
        notes: notes || null,
        related_id: meetingId || null,
      };

      const interaction = await createInteraction(interactionPayload);

      // 3) update investor lists / snapshots depending on outcome
      // If interested -> ensure investor in 'interested' list with snapshot/meta
      if (selected === "interested") {
        const snapshot = {
          meeting: {
            id: meetingId,
            meet_link: meeting?.meet_link || meeting?.meetLink || null,
            meeting_datetime: meeting?.meeting_datetime || meeting?.scheduled_at || null,
            meeting_type: meeting?.meeting_type || meeting?.meetingType || null,
            status: "COMPLETED",
            notes: meeting?.notes || null,
          },
          meta: { postOutcome: "INTERESTED" },
        };
        try {
          const listRes = await addInvestorToList({ investor_id: investorId, list_type: "interested", snapshot });
          // dispatch event for optimistic UI updates
          window.dispatchEvent(new CustomEvent("investorListChanged", { detail: { action: "added_or_updated", listType: "interested", serverItem: listRes ?? { investor_id: investorId, snapshot } } }));
        } catch (err) {
          console.warn("addInvestorToList (interested) failed", err);
        }
      }

      // If not interested -> add to not_interested list with note
      if (selected === "not_interested") {
        const snapshot = {
          notInterestedNote: notes || null,
          meta: { postOutcome: "NOT_INTERESTED" },
        };
        try {
          const listRes = await addInvestorToList({ investor_id: investorId, list_type: "not_interested", snapshot });
          window.dispatchEvent(new CustomEvent("investorListChanged", { detail: { action: "added_or_updated", listType: "not_interested", serverItem: listRes ?? { investor_id: investorId, snapshot } } }));
        } catch (err) {
          console.warn("addInvestorToList (not_interested) failed", err);
        }
      }

      // If follow_up -> create followup and add to followups list
      if (selected === "follow_up") {
        const followupPayload: any = {
          investor_id: investorId,
          followup_datetime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // default to 24h later, UI can edit
          notes: notes || null,
        };
        try {
          const followupRes = await createFollowup(followupPayload);
          const snapshot = {
            followup: {
              id: followupRes?.id ?? followupRes?.followup_id ?? null,
              followup_datetime: followupRes?.followup_datetime ?? followupPayload.followup_datetime,
              notes: followupRes?.notes ?? followupPayload.notes,
            },
            meta: { postOutcome: "FOLLOW_UP" },
          };
          const listRes = await addInvestorToList({ investor_id: investorId, list_type: "followups", snapshot });
          window.dispatchEvent(new CustomEvent("investorListChanged", { detail: { action: "added_or_updated", listType: "followups", serverItem: listRes ?? { investor_id: investorId, snapshot } } }));
        } catch (err) {
          console.warn("createFollowup/addInvestorToList (followup) failed", err);
        }
      }

      // final: dispatch generic events and call onSaved
      window.dispatchEvent(new Event("investorPostMeetOutcomeSaved"));
      onSaved && onSaved({ interaction, updatedMeeting });
      alert("Outcome saved");
      onClose();
    } catch (err) {
      console.error("PostMeetOutcome save failed", err);
      alert("Failed to save outcome");
    } finally {
      setSaving(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        <h3 className="text-lg font-semibold mb-4">Post-Meeting Outcome</h3>

        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">Select outcome</div>
          <div className="flex gap-2">
            <label className={`px-3 py-2 rounded border ${selected === "interested" ? "bg-green-50 border-green-300" : "bg-white"}`}>
              <input type="radio" name="outcome" value="interested" className="mr-2" checked={selected === "interested"} onChange={() => setSelected("interested")} />
              Interested
            </label>
            <label className={`px-3 py-2 rounded border ${selected === "not_interested" ? "bg-red-50 border-red-300" : "bg-white"}`}>
              <input type="radio" name="outcome" value="not_interested" className="mr-2" checked={selected === "not_interested"} onChange={() => setSelected("not_interested")} />
              Not Interested
            </label>
            <label className={`px-3 py-2 rounded border ${selected === "follow_up" ? "bg-yellow-50 border-yellow-300" : "bg-white"}`}>
              <input type="radio" name="outcome" value="follow_up" className="mr-2" checked={selected === "follow_up"} onChange={() => setSelected("follow_up")} />
              Follow-up
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded bg-gray-100">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white">{saving ? "Saving..." : "Save Outcome"}</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostMeetOutcomeModal;
