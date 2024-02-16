import axios from "axios";
import sessionService from "./sessionService";

let ENV_HOST = "http://localhost";
let PROXY_PORT = "7001";
if (import.meta.env.MODE === "aws") {
  //Directly hit the pokedex backend in aws environment.
  ENV_HOST = import.meta.env.VITE_POKEDEX_HOST;
  PROXY_PORT = import.meta.env.VITE_POKEDEX_PORT;
} else {
  //Otherwise use the proxy server.
  ENV_HOST = import.meta.env.VITE_FRONTEND_HOST;
  PROXY_PORT = import.meta.env.VITE_FRONTEND_PORT;
}

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
