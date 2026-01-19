// src/services/userService.ts
import httpClient from "../lib/httpClient";

export const getUsers = async (queryParams: any) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams)
      .filter(([_, value]) => value !== "" && value != null)
      .map(([key, value]) => [key, String(value)])
  );
  const queryString = new URLSearchParams(filteredParams).toString();
  const url = `/api/users${queryString ? `?${queryString}` : ""}`;
  const res = await httpClient.get(url);
  return res.data;
}

export const addUser = async (userData: any) => {
  const res = await httpClient.post("/api/users/", userData);
  return res.data;
}

export const updateUser = async (id: string, userData: any) => {
  const res = await httpClient.put(`/api/users/${id}`, userData);
  return res.data;
}

export const getUserById = async (id: string) => {
  const res = await httpClient.get(`/api/users/${id}`);
  return res.data;
}