import axiosInstance from "../utils/axiosInstance";

export const getMyProperties = () =>
  axiosInstance.get("/api/properties/seller/my-properties/");

export const toggleArchiveProperty = (id) =>
  axiosInstance.patch(
    `/api/properties/seller/property/${id}/toggle-archive/`
  );


export const createProperty = (data) =>
  axiosInstance.post("/api/properties/create/", data);
