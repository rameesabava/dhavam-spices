
import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000",
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Change "token" if your application stores it under another key.
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request failed:", {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      status: error.response?.status,
      responseData: error.response?.data,
    });

    return Promise.reject(error);
  }
);
