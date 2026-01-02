// src/services/customerService.ts
import httpClient from "../lib/httpClient";

type QueryParams = Record<string, any>;

/**
 * Build query string from params.
 * Keeps behavior: omit empty/null/undefined values.
 * Accepts typical params: page, limit, search, status, sortBy, sortOrder
 * Also accepts company-specific filters like domain, website, contact_number,
 * and employeeCount (mapped to employee_count).
 */
const buildQueryString = (params: QueryParams) => {
  if (!params) return "";
  // map friendly names to backend keys if needed
  const normalized: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === "" || v === null || typeof v === "undefined") return;
    // map JS camelCase to backend expected snake_case where we chose that mapping
    if (k === "employeeCount") {
      normalized["employee_count"] = String(v);
    } else {
      normalized[k] = String(v);
    }
  });
  const q = new URLSearchParams(normalized).toString();
  return q ? `?${q}` : "";
};

export const getCustomers = async (queryParams: QueryParams = {}) => {
  try {
    const queryString = buildQueryString(queryParams);
    const url = `/api/customers${queryString}`;
    const res = await httpClient.get(url);
    // backend returns { customers, pagination: {...} }
    return res.data;
  } catch (err: any) {
    // rethrow to let UI show errors; optionally you can parse err.response.data
    console.error("getCustomers error:", err);
    throw err;
  }
};

export const addCustomer = async (customerData: any) => {
  try {
    const res = await httpClient.post("/api/customers/", customerData);
    // backend returns { message, customer }
    return res.data;
  } catch (err: any) {
    console.error("addCustomer error:", err);
    throw err;
  }
};

export const updateCustomer = async (id: string, customerData: any) => {
  try {
    const res = await httpClient.put(`/api/customers/${id}`, customerData);
    // backend returns { message, customer }
    return res.data;
  } catch (err: any) {
    console.error("updateCustomer error:", err);
    throw err;
  }
};

export const getCustomerById = async (id: string) => {
  try {
    const res = await httpClient.get(`/api/customers/${id}`);
    // backend returns the formatted customer object (with companyDetails & companyEmployees)
    return res.data;
  } catch (err: any) {
    console.error("getCustomerById error:", err);
    throw err;
  }
};
