import axios from "axios";

import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env
    .VITE_API_BASE_URL ||
  "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 15000,

  headers: {
    "Content-Type":
      "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const session =
      localStorage.getItem(
        "vendor_risk_auth"
      );

    if (session) {
      try {
        const parsed =
          JSON.parse(session);

        if (parsed?.token) {
          config.headers.Authorization =
            `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.error(
          "Failed to parse auth session",
          error
        );
      }
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error?.response?.status;

    const message =
      error?.response?.data
        ?.message ||
      error?.message ||
      "Unexpected error occurred";

    switch (status) {
      case 401:
        localStorage.removeItem(
          "vendor_risk_auth"
        );

        if (
          window.location
            .pathname !== "/login"
        ) {
          toast.error(
            "Session expired. Please login again."
          );

          window.location.href =
            "/login";
        }

        break;

      case 403:
        toast.error(
          "You do not have permission to perform this action."
        );

        break;

      case 404:
        toast.error(
          "Requested resource not found."
        );

        break;

      case 500:
        toast.error(
          "Internal server error occurred."
        );

        break;

      default:
        if (!status) {
          toast.error(
            "Network error. Please check your connection."
          );
        } else {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (
  token
) => {
  if (token) {
    api.defaults.headers.common.Authorization =
      `Bearer ${token}`;
  } else {
    delete api.defaults.headers
      .common.Authorization;
  }
};

export default api;