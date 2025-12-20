import axiosInstance from "../utils/axiosInstance";

export const signup = (data) =>
  axiosInstance.post("/api/auth/register/", data);

export const login = (data) =>
  axiosInstance.post("/api/auth/login/", data);

export const getProfile = () =>
  axiosInstance.get("/api/auth/profile/");

export const logout = () =>
  axiosInstance.post("/api/auth/logout/");
