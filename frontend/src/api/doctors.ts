import api from "./axiosConfig";

export const getDoctors = async () => {
  const res = await api.get("/doctors/");
  return res.data;
};
