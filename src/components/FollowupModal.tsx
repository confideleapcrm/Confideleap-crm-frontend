// // src/components/FollowupModal.tsx
// import React, { useState } from 'react';
// import { createFollowup } from '../services/investorService';

// interface Props {
//   open: boolean;
//   investorId: string;
//   onClose: () => void;
//   onSaved?: (followup: any) => void;
//   defaultCompanyId?: string | null;
// }

// const FollowupModal: React.FC<Props> = ({ open, investorId, onClose, onSaved, defaultCompanyId = null }) => {
//   const [datetime, setDatetime] = useState<string>('');
//   const [notes, setNotes] = useState<string>('');
//   const [saving, setSaving] = useState(false);

//   if (!open) return null;

//   const handleSubmit = async () => {
//     if (!datetime) return alert('Please select date & time for follow-up');
//     setSaving(true);
//     try {
//       const payload = {
//         investor_id: investorId,
//         followup_datetime: datetime,
//         notes: notes || null,
//         company_id: defaultCompanyId || null,
//       };
//       const res = await createFollowup(payload);
//       onSaved && onSaved(res);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create follow-up');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>
//       <div className="bg-white rounded-lg shadow-lg p-6 z-60 w-full max-w-md">
//         <h3 className="text-lg font-semibold mb-4">Schedule Follow-up</h3>

//         <div className="space-y-3">
//           <div>
//             <label className="block text-sm font-medium">Date & Time</label>
//             <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Notes</label>
//             <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" rows={3} />
//           </div>

//           <div className="flex items-center justify-end gap-2 mt-4">
//             <button onClick={onClose} className="px-3 py-2 rounded border bg-gray-50">Cancel</button>
//             <button onClick={handleSubmit} disabled={saving} className="px-3 py-2 rounded bg-yellow-600 text-white">{saving ? 'Saving...' : 'Schedule'}</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FollowupModal;







