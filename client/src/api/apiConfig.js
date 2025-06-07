import axios from "axios";

// Carga desde .env → automáticamente usa el adecuado según entorno
const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", API_URL);

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivateInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
