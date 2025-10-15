import api from "./axiosConfig";

export const getPatients = async () => {
  const res = await api.get("/patients/");
  return res.data;
};
