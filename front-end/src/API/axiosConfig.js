import axios from "axios";

const axiosConfig = axios.create({
  // baseURL: "https://evangadiforum-backend-1-1bjx.onrender.com/api",
  baseURL: "http://localhost:5500/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosConfig;
