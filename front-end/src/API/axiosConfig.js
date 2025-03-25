import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust if your backend runs on a different port
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosConfig;
