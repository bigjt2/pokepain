import { AxiosResponse } from "axios";
import api from "./api";
import sessionService from "./sessionService";

const login = async (
  trainername: string,
  password: string
): Promise<number | any> => {
  const basicAuth = "Basic " + btoa(trainername + ":" + password);

  const result = await api.post(
    "/api/trainers/login",
    {},
    { headers: { Authorization: basicAuth } }
  );

  sessionService.initSession(result.data);
  return result.status;
};

const register = async (
  trainername: string,
  password: string
): Promise<number | any> => {
  const result = await api.post(`/api/trainers/register`, {
    trainerName: trainername,
    password: password,
  });
  return result.status;
};

const logout = async (): Promise<number | any> => {
  await api
    .post("/api/trainers/logout")
    .catch((e) => {
      console.error(e);
      return { error: e };
    })
    .then((result: any) => {
      sessionService.removeSession();
      return result.status;
    });
};

const trainerService = {
  login,
  register,
  logout,
};

export default trainerService;
