import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  // withCredentials: true, // enable only if your backend uses httpOnly cookies
});

// Turn any axios error into a plain Error with a readable message
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED" ? "Request timed out. Please try again." : null) ||
      (!error.response ? "Can't reach the server. Check your connection." : null) ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);