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

const trainerService = {
  login,
  register,
};

export default trainerService;
