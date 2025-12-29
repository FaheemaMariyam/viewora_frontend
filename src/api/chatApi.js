import axiosInstance from "../utils/axiosInstance";

export const getChatHistory = (interestId) =>
  axiosInstance.get(
    `/api/chat/interest/${interestId}/history/`
  );
export const markMessagesRead = (interestId) =>
  axiosInstance.post(`/api/chat/interest/${interestId}/read/`);