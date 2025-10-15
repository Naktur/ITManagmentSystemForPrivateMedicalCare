import api from "./axiosConfig";

export const getAppointments = async () => {
  const res = await api.get("/appointments/");
  return res.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAppointment = async (data: any) => {
  const res = await api.post("/appointments/", data);
  return res.data;
};
