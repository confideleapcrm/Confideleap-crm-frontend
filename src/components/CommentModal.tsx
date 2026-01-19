// src/components/CommentModal.tsx (for Not Interested)
import React, { useState } from 'react';
import { createInteraction } from '../services/investorService';

interface Props {
  open: boolean;
  investorId: string;
  onClose: () => void;
  onSaved?: (interaction: any) => void;
  defaultCompanyId?: string | null;
}

const CommentModal: React.FC<Props> = ({ open, investorId, onClose, onSaved, defaultCompanyId = null }) => {
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        investor_id: investorId,
        source: 'manual',
        outcome: 'not_interested',
        notes: notes || null,
        company_id: defaultCompanyId || null,
      };
      const res = await createInteraction(payload);
      onSaved && onSaved(res);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save comment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-60 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Not Interested — Add Comment</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" rows={4} />
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-3 py-2 rounded border bg-gray-50">Cancel</button>
            <button onClick={handleSubmit} disabled={saving} className="px-3 py-2 rounded bg-red-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
