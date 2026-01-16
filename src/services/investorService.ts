// src/services/investorService.ts
import httpClient from "../lib/httpClient";

/**
 * Investors CRUD / lists / meetings service
 * NOTE: ensure we forward company_id exactly as backend expects.
 */

// helper to clean payload by removing undefined fields but keep nulls (so DB receives null where explicit)
function cleanPayloadKeepNulls(obj: any) {
  if (!obj || typeof obj !== "object") return obj;
  const out: any = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    out[k] = v;
  });
  return out;
}

// existing investor endpoints (unchanged)
export const getInvestors = async (queryParams: any) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams)
      .filter(([_, value]) => value !== "" && value != null)
      .map(([key, value]) => [key, String(value)])
  );
  const queryString = new URLSearchParams(filteredParams).toString();
  const url = `/api/investors${queryString ? `?${queryString}` : ""}`;
  const res = await httpClient.get(url);
  return res.data;
};

export const addInvestor = async (investorData: any) => {
  const res = await httpClient.post("/api/investors/", investorData);
  return res.data;
};

export const updateInvestor = async (id: string, investorData: any) => {
  const res = await httpClient.put(`/api/investors/${id}`, investorData);
  return res.data;
};

export const importInvestors = async (file: File) => {
  const formData = new FormData();
  formData.append("excelFile", file);
  const res = await httpClient.post("/api/investors/import/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getInvestorById = async (id: string) => {
  const res = await httpClient.get(`/api/investors/${id}`);
  return res.data;
};

export const getInvestorTargetingList = async (queryParams: any = {}) => {
  const params = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  const queryString = params.toString();
  const url = `/api/investors/targeting/list${queryString ? `?${queryString}` : ""}`;
  const res = await httpClient.get(url);
  console.log("Query Params:", params);
  console.log("Final URL:", url);
  console.log(res.data);
  
  return res.data;
};

// ---- list related functions ----
export const addInvestorToList = async (payload: {
  investor_id: string;
  list_type: 'interested' | 'followups' | 'not_interested' | 'maybe' | 'meeting'; // 👈 added 'meeting' to match usage
  snapshot?: object;
  company_id?: string | null;
}) => {
  // clean but keep nulls (so DB gets explicit null if intentionally passed)
  const body = cleanPayloadKeepNulls(payload);
  // DEBUG - inspect outgoing request body in browser console
  try {
    console.debug("SERVICE -> POST /api/investor_lists body:", body);
  } catch {}
  const res = await httpClient.post('/api/investor_lists', body);
  return res.data;
};

export const removeInvestorFromListById = async (id: number) => {
  const url = `/api/investor_lists/${id}`;
  const res = await httpClient.delete(url);
  return res.data;
};

export const bulkRemoveInvestorsFromList = async (list_type: string) => {
  const url = `/api/investor_lists?list=${encodeURIComponent(list_type)}`;
  const res = await httpClient.delete(url);
  return res.data;
};

export const getInvestorsInList = async (list_type: string) => {
  const url = `/api/investor_lists?list=${encodeURIComponent(list_type)}`;
  const res = await httpClient.get(url);
  return res.data; // {items: [...], total: N}
};

/**
 * ✅ NEW: update an existing investor_lists row
 * Used when converting list_type=interested → list_type=meeting
 */
export const updateInvestorList = async (id: number | string, payload: any) => {
  const body = cleanPayloadKeepNulls(payload);
  const res = await httpClient.put(`/api/investor_lists/${id}`, body);
  return res.data;
};

// Contact status
export const recordInvestorContactStatus = async (payload: { investor_id: string; status: 'called' | 'messaged' | 'not_picked' | 'not_reachable'; notes?: string }) => {
  const res = await httpClient.post('/api/investor_contact_status', payload);
  return res.data;
};

export const getLatestContactStatus = async (investor_id: string) => {
  const url = `/api/investor_contact_status/latest?investor_id=${encodeURIComponent(investor_id)}`;
  const res = await httpClient.get(url);
  return res.data;
};

/**
 * Generate Google Meet for an existing meeting
 */
export async function generateMeetForMeeting(meetingId: string) {
  if (!meetingId) throw new Error("meeting_id_required");
  const url = `/api/meetings/${encodeURIComponent(meetingId)}/generate_meet`;

  try {
    const resp = await httpClient.post(url, {});
    return resp.data;
  } catch (err: any) {
    if (err?.response && err.response.data) {
      const payload = err.response.data;
      const e: any = new Error(payload.error || payload.message || "generate_meet_failed");
      e.payload = payload;
      throw e;
    }
    throw err;
  }
}

/* Meetings */
export const createMeeting = async (payload: {
  investor_id: string;
  company_id?: string | null;
  meeting_type: 'virtual' | 'physical';
  meeting_datetime?: string;
  location?: string | null;
  notes?: string | null;
}) => {
  // 🔥 DO NOT attach userId – backend gets it from session
  const clean = cleanPayloadKeepNulls(payload);

  console.debug("SERVICE -> POST /api/meetings body:", clean);

  const res = await httpClient.post('/api/meetings', clean);
  return res.data;
};


export const updateMeeting = async (id: number | string, payload: any) => {
  const res = await httpClient.put(`/api/meetings/${id}`, payload);
  return res.data;
};

export const getMeetingsForInvestor = async (investor_id: string) => {
  const url = `/api/meetings?investor_id=${encodeURIComponent(investor_id)}`;
  const res = await httpClient.get(url);
  return res.data;
};

/* Followups */
export const createFollowup = async (payload: {
  investor_id: string;
  company_id?: string | null;
  followup_datetime: string;
  notes?: string | null;
}) => {
  const clean = cleanPayloadKeepNulls(payload);
  console.debug("SERVICE -> POST /api/followups body:", clean);
  const res = await httpClient.post('/api/followups', clean);
  return res.data;
};

export const updateFollowup = async (id: number | string, payload: any) => {
  const res = await httpClient.put(`/api/followups/${id}`, payload);
  return res.data;
};

export const getFollowupsForInvestor = async (investor_id: string) => {
  const url = `/api/followups?investor_id=${encodeURIComponent(investor_id)}`;
  const res = await httpClient.get(url);
  return res.data;
};

/* Interactions (post-meet outcomes etc) */
export const createInteraction = async (payload: {
  investor_id: string;
  source?: 'meeting' | 'followup' | 'manual';
  outcome: 'interested' | 'not_interested' | 'follow_up';
  notes?: string | null;
  related_id?: number | null;
  company_id?: string | null;
}) => {
  const clean = cleanPayloadKeepNulls(payload);
  console.debug("SERVICE -> POST /api/interactions body:", clean);
  const res = await httpClient.post('/api/interactions', clean);
  return res.data;
};

export const getInteractionsForInvestor = async (investor_id: string) => {
  const url = `/api/interactions?investor_id=${encodeURIComponent(investor_id)}`;
  const res = await httpClient.get(url);
  return res.data;
};

