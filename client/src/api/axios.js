import axios from "axios";

let accessToken = null;
let csrfToken = null;

let isRefreshing = false;
let refreshSubscribers = [];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  withCredentials: true,
});

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
  csrfToken = null;
}

async function fetchCsrfToken() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL || ""}/api/auth/csrf`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      },
    );
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (err) {
    console.error("Failed to fetch CSRF token:", err);
    return null;
  }
}

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function onRefreshFailed(error) {
  refreshSubscribers.forEach((callback) => callback(null, error));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL || ""}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const newToken = response.data.accessToken;
    setAccessToken(newToken);
    return newToken;
  } catch (err) {
    clearTokens();
    throw err;
  }
}

api.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (["post", "patch", "put", "delete"].includes(config.method)) {
      if (!csrfToken && accessToken) {
        await fetchCsrfToken();
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (
        originalRequest.url.includes("/api/auth/login") ||
        originalRequest.url.includes("/api/auth/register")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken, err) => {
            if (err) {
              reject(err);
            } else if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newToken);

        csrfToken = null;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailed(refreshError);

        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.error === "Invalid CSRF token" &&
      !originalRequest._csrfRetry
    ) {
      originalRequest._csrfRetry = true;
      csrfToken = null;
      await fetchCsrfToken();
      if (csrfToken) {
        originalRequest.headers["X-CSRF-Token"] = csrfToken;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
