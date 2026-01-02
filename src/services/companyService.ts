// src/services/companyService.ts
import httpClient from "../lib/httpClient";

/* ---- helpers ---- */
function mapEmployeeToDb(emp: any) {
  return {
    first_name: emp.first_name ?? emp.firstName ?? "",
    last_name: emp.last_name ?? emp.lastName ?? "",
    email: emp.email ?? "",
    designation: emp.designation ?? emp.title ?? "",
    phone: emp.phone ?? emp.contact_number ?? emp.phone ?? "",
    linkedin_url: emp.linkedin ?? emp.linkedin_url ?? "",
    is_primary:
      typeof emp.is_primary !== "undefined"
        ? emp.is_primary
        : emp.isPrimary ?? false,
  };
}

function normalizeGetCompaniesResponse(raw: any) {
  if (raw && typeof raw === "object" && Array.isArray(raw.companies)) {
    return {
      companies: raw.companies,
      pagination:
        raw.pagination ?? { page: 1, limit: raw.companies.length, total: raw.companies.length, pages: 1 },
    };
  }
  if (raw && typeof raw === "object" && Array.isArray(raw.data)) {
    return {
      companies: raw.data,
      pagination:
        raw.pagination ?? { page: 1, limit: raw.data.length, total: raw.data.length, pages: 1 },
    };
  }
  if (Array.isArray(raw)) {
    return {
      companies: raw,
      pagination: { page: 1, limit: raw.length, total: raw.length, pages: 1 },
    };
  }
  if (raw && typeof raw === "object" && raw.id) {
    return {
      companies: [raw],
      pagination: { page: 1, limit: 1, total: 1, pages: 1 },
    };
  }
  if (raw && typeof raw === "object") {
    const keys = Object.keys(raw);
    for (const k of keys) {
      if (Array.isArray(raw[k])) {
        return {
          companies: raw[k],
          pagination:
            raw.pagination ?? { page: 1, limit: raw[k].length, total: raw[k].length, pages: 1 },
        };
      }
    }
  }
  return { companies: [], pagination: { page: 1, limit: 0, total: 0, pages: 0 } };
}

function normalizeGetCompanyByIdResponse(raw: any) {
  if (!raw) return null;
  if (Array.isArray(raw) && raw.length > 0) return raw[0];
  if (Array.isArray(raw) && raw.length === 0) return null;
  if (raw.company) return raw.company;
  if (raw.data && raw.data.id) return raw.data;
  if (raw.id) return raw;
  if (raw.companies && Array.isArray(raw.companies) && raw.companies.length > 0) return raw.companies[0];
  return null;
}

/* ---- API functions ---- */

/**
 * getCompanies -> normalized { companies: [...], pagination: {...} }
 */
export const getCompanies = async (queryParams: any) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams || {})
      .filter(([_, value]) => value !== "" && value != null)
      .map(([k, v]) => [k, String(v)])
  );
  const qs = new URLSearchParams(filteredParams).toString();
  const url = `/api/companies${qs ? `?${qs}` : ""}`;
  const res = await httpClient.get(url);
  const normalized = normalizeGetCompaniesResponse(res.data);
  normalized.companies = normalized.companies.map((c: any) => ({
    ...c,
    employeeCount: typeof c.employeeCount === "number" ? c.employeeCount : (c.company_employees?.length ?? 0),
    customer_services: c.customer_services ?? [],
  }));
  return normalized;
};

/**
 * getCompanyById -> single company object (or null)
 */
export const getCompanyById = async (id: string) => {
  const res = await httpClient.get(`/api/companies/${id}`);
  const company = normalizeGetCompanyByIdResponse(res.data);
  return company;
};

export const getCompanyEmployees = async (companyId: string, queryParams: any = {}) => {
  if (!companyId) throw new Error("companyId is required");
  const params = { ...queryParams, company_id: companyId };
  const filtered = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== "" && v != null));
  const qs = new URLSearchParams(filtered as any).toString();
  const url = `/api/company_employees${qs ? `?${qs}` : ""}`;
  const res = await httpClient.get(url);
  return res.data;
};

async function findCompanyByUniqueKeys(payload: any) {
  if (!payload.name) return null;
  const params: any = { name: `eq.${payload.name}` };
  if (payload.website) params.website = `eq.${payload.website}`;
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await httpClient.get(`/api/companies?${qs}`);
    if (res.data) {
      if (Array.isArray(res.data) && res.data.length > 0) return res.data[0];
      if (res.data.id) return res.data;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/* ---------- create company (POST) ---------- */
export const addCompany = async (payload: any) => {
  try {
    const employees = Array.isArray(payload.employees) ? payload.employees : [];
    const companyPayload = { ...payload };
    delete companyPayload.employees;
    let createRes;
    try {
      createRes = await httpClient.post("/api/companies", companyPayload, {
        headers: { Prefer: "return=representation" },
      });
    } catch (postErr) {
      console.warn("Company create POST failed:", postErr?.response?.data ?? postErr);
      throw postErr?.response?.data ?? postErr;
    }
    const createdCompany = createRes?.data ?? null;
    let companyId: string | null = null;
    if (createdCompany) {
      if (createdCompany.id) companyId = createdCompany.id;
      else if (Array.isArray(createdCompany) && createdCompany[0]?.id) companyId = createdCompany[0].id;
      else if (createdCompany.company && createdCompany.company.id) companyId = createdCompany.company.id;
      else if (createdCompany.data && createdCompany.data.id) companyId = createdCompany.data.id;
    }
    if (!companyId) {
      const lookedUp = await findCompanyByUniqueKeys(companyPayload);
      if (lookedUp && lookedUp.id) companyId = lookedUp.id;
    }
    if (!companyId) {
      console.error("addCompany: unable to obtain created company id. createRes:", createRes);
      throw { error: "Failed to determine created company id", details: createRes?.data ?? createRes };
    }
    const employeesToInsert = employees.map((e: any) => ({ ...mapEmployeeToDb(e), company_id: companyId }));
    if (employeesToInsert.length > 0) {
      for (const emp of employeesToInsert) {
        try {
          await httpClient.post("/api/company_employees", emp, { headers: { "Content-Type": "application/json" } });
        } catch (err1: any) {
          try {
            await httpClient.post("/api/company_employees/", emp, { headers: { "Content-Type": "application/json" } });
          } catch (err2: any) {
            console.error("Failed to insert employee after both endpoint attempts:", { employee: emp, errors: [err1, err2] });
          }
        }
      }
    }
    // If caller included customer_services at top-level, we assume the backend will have created them already in POST /api/companies.
    return createdCompany;
  } catch (err: any) {
    console.error("Create company error:", err?.response?.data ?? err);
    throw err?.response?.data ?? err;
  }
};

/* ---------- employee helpers ---------- */
export const addCompanyEmployee = async (emp: any) => {
  try {
    const body = mapEmployeeToDb(emp);
    if (emp.company_id) body.company_id = emp.company_id;
    if (emp.companyId) body.company_id = emp.companyId;
    if (!body.company_id) throw { error: "company_id missing in employee payload" };
    try {
      const res = await httpClient.post("/api/company_employees", body, { headers: { "Content-Type": "application/json" } });
      return res.data;
    } catch (e1) {
      const res2 = await httpClient.post("/api/company_employees/", body, { headers: { "Content-Type": "application/json" } });
      return res2.data;
    }
  } catch (err: any) {
    console.error("Failed to insert employee", err?.response?.data ?? err);
    throw err?.response?.data ?? err;
  }
};

export const insertCompanyEmployees = async (companyId: string, employees: any[]) => {
  if (!companyId) throw new Error("company_id missing");
  const payload = employees.map((e) => ({ ...e, company_id: companyId }));
  try {
    const res = await httpClient.post("/api/company_employees", payload, { headers: { "Content-Type": "application/json" } });
    return res.data;
  } catch (bulkErr) {
    console.warn("Bulk insert failed, falling back to single inserts", bulkErr?.response?.data ?? bulkErr);
    const results: any[] = [];
    for (const emp of payload) {
      try {
        const single = await addCompanyEmployee(emp);
        results.push(single);
      } catch (singleErr) {
        console.error("single insert failed for", emp, singleErr);
      }
    }
    return results;
  }
};

export const updateCompanyEmployee = async (employeeId: string, employeeData: any) => {
  try {
    const payload = mapEmployeeToDb(employeeData);
    const res = await httpClient.patch(`/api/company_employees/${employeeId}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update employee error:", err?.response?.data ?? err);
    throw err?.response?.data ?? err;
  }
};

export const deleteCompanyEmployee = async (employeeId: string) => {
  try {
    const res = await httpClient.delete(`/api/company_employees/${employeeId}`);
    return res.data;
  } catch (err: any) {
    console.error("Delete employee error:", err?.response?.data ?? err);
    throw err?.response?.data ?? err;
  }
};

/* ---------- company update (PATCH/PUT) ---------- */
/**
 * updateCompany now expects the caller to send the wrapper that backend expects:
 * { company: {...}, employees: [...], customer_services: [...] }
 */
export const updateCompany = async (id: string, payload: any) => {
  try {
    const res = await httpClient.patch(`/api/companies/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update company error:", err?.response?.data ?? err);
    throw err?.response?.data ?? err;
  }
};

/* ---------- customer services helper ---------- */
/**
 * Replace company customer services (server route: POST /api/companies/:id/customer_services)
 * Accepts array of { service_key, service_label, price }
 */
export const upsertCompanyServices = async (companyId: string, services: any[]) => {
  if (!companyId) throw new Error("companyId required");
  try {
    const res = await httpClient.post(`/api/companies/${companyId}/customer_services`, services, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to upsert customer services", err?.response?.data ?? err);
    throw err?.response?.data ?? err;
  }
};

export default {
  getCompanies,
  getCompanyById,
  getCompanyEmployees,
  addCompany,
  addCompanyEmployee,
  updateCompany,
  insertCompanyEmployees,
  updateCompanyEmployee,
  deleteCompanyEmployee,
  upsertCompanyServices,
};

