// src/services/authService.ts
import httpClient from "../lib/httpClient";

export const login = async (payload: any) => {
  const res = await httpClient.post("/api/auth/login", payload);

  // Save tokens
  if (res.data?.accessToken) {
    localStorage.setItem("accessToken", res.data.accessToken);
  }
  if (res.data?.sessionToken) {
    localStorage.setItem("sessionToken", res.data.sessionToken);
  }

  return res.data;
};

export const logout = async () => {
  try {
    await httpClient.post("/api/auth/logout");
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("sessionToken");
  }
};

export const register = async (payload: any) => {
  const res = await httpClient.post("/api/auth/register", payload);
  return res.data;
};

export const verifySession = async (sessionToken: string) => {
  const res = await httpClient.get("/api/auth/verify-session", { params: { sessionToken: sessionToken } });
  return res.data;
};