import axios from "axios";

const baseUrl = "http://localhost:3000/api";

const api = {
  get: (endpoint) => axios.get(baseUrl + endpoint),
};

export default api;
