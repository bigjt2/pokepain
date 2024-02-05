import axios from "axios";
import sessionService from "./sessionService";

const ENV_HOST = import.meta.env.VITE_ENV_HOST || "http://localhost";
const PROXY_PORT = import.meta.env.VITE_FRONTEND_PROXY_PORT || "7001";

const api = axios.create({
  baseURL: `${ENV_HOST}:${PROXY_PORT}`,
  withCredentials: true, //for sending cookies to pokedex backend API.
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/api/trainers/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await api.post("/api/trainers/refreshToken", {
            refreshToken: sessionService.getSession()?.refreshToken,
          });

          return api(originalConfig);
        } catch (_error: any) {
          if (_error.response.status === 403) {
            //refresh token expired, logout user
            sessionService.removeSession();
          }
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default api;
