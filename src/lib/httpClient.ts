import axios from "axios";

const httpClient = axios.create({
  baseURL:  "https://devapi.confideleap.com",
  withCredentials: true,
});

/* ===============================
   REQUEST INTERCEPTOR
================================ */
// httpClient.interceptors.request.use((config) => {
//   const accessToken = localStorage.getItem("accessToken");

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

/* ===============================
   RESPONSE INTERCEPTOR (REFRESH)
================================ */
let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const processQueue = () => {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚫 Do NOT intercept verify-session itself (prevents loops)
    if (originalRequest?.url?.includes("/api/auth/verify-session")) {
      return Promise.reject(error);
    }

    // Only handle 401 once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(httpClient(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        // 🔁 Try refreshing session (cookie-based)
        await httpClient.get("/api/auth/verify-session");

        processQueue();
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue();

        // 🔥 HARD LOGOUT – guaranteed
        isRefreshing = false;

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default httpClient;
