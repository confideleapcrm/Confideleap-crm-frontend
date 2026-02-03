// src/services/userService.ts
import httpClient from "../lib/httpClient";

export const getTopInteractions = async () => {
  try {
    const response = await httpClient.get("/api/interactions/top-interactions");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return [];
  }
};

// services/interactions.js
export const getOutcomeCounts = async (period = "30d") => {
  try {
    const response = await httpClient.get(
      `/api/interactions/outcome-count?period=${period}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching outcome counts:", error);
    return [];
  }
};
