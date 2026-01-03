// import axios from "axios";

// const axiosInstance = axios.create({
//   // baseURL: import.meta.env.VITE_API_BASE_URL, 
//   baseURL:"",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });




// export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/api/auth/refresh/");
        return axiosInstance(originalRequest);
      } catch (err) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
