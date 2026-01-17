// src/services/authService.ts
import httpClient from "../lib/httpClient";


const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://devapi.confideleap.com";
    
export const login = async (payload: any) => {
  const res = await httpClient.post("/api/auth/login", payload);

  // Save tokens
  // if (res.data?.accessToken) {
  //   localStorage.setItem("accessToken", res.data.accessToken);
  // }
  // if (res.data?.sessionToken) {
  //   localStorage.setItem("sessionToken", res.data.sessionToken);
  // }

  return res.data;
};

export const googleAuth = () => {
  try {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  } catch (error) {
    console.error(error);
  }
};

export const logout = async () => {
  try {
    await httpClient.post("/api/auth/logout");
  } catch (error) {
    console.log(error);
    
    // ignore
  } 
  // finally {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("sessionToken");
  // }
};

export const register = async (payload: any) => {
  const res = await httpClient.post("/api/auth/register", payload);
  return res.data;
};

export const verifySession = async () => {
  const res = await httpClient.get("/api/auth/verify-session");
  return res.data;
};

export const getMe = async () => {
  const res = await httpClient.get("/api/auth/me");
  return res.data;
};