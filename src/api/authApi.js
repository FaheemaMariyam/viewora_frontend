import axiosInstance from "../utils/axiosInstance";

export const signup = (data) =>
  axiosInstance.post("/api/auth/register/", data);

export const login = (data) =>
  axiosInstance.post("/api/auth/login/", data);

export const getProfile = () =>
  axiosInstance.get("/api/auth/profile/");

export const logout = () =>
  axiosInstance.post("/api/auth/logout/");

export const sendPhoneOtp = (phone_number) =>
  axiosInstance.post("/api/auth/otp/send/", { phone_number });

export const verifyPhoneOtp = (phone_number, otp) =>
  axiosInstance.post("/api/auth/otp/verify/", { phone_number, otp });
// export const requestPasswordReset = (email) =>
//   axiosInstance.post("/api/auth/reset-password/request/", { email });
export const resetPasswordRequest = (data) =>
  axiosInstance.post("/api/auth/reset-password/request/", data);
export const confirmPasswordReset = (data) =>
  axiosInstance.post("/api/auth/reset-password/confirm/", data);
export const changePassword = (data) =>
  axiosInstance.post("/api/auth/change-password/", data);
