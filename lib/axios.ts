
import axios from "axios";

export const api = axios.create({
  baseURL: (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  ).replace(/\/$/, ""),
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request failed:", {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      response: error.response?.data,
      message: error.message,
    });

    const data = error.response?.data;

    const message =
      (typeof data === "string" && data) ||
      data?.message ||
      data?.error ||
      error.message ||
      "Unable to complete the request.";

    return Promise.reject(new Error(message));
  }
);
