import axios from "axios";
import sessionService from "./sessionService";

const api = axios.create({
  baseURL: "http://localhost:8080",
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
