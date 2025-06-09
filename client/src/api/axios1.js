import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Axios público para login, registro, etc.
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔐 Importante para cookies seguras
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios privado con interceptor para CSRF (si usas sesiones)
export const axiosPrivateInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 Interceptor para incluir token CSRF automáticamente (solo si usas sesiones y CSRF)
axiosPrivateInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken(); // implementa esta función si aplica
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para obtener CSRF (solo si Django usa middleware de sesión con CSRF)
function getCSRFToken() {
  const cookies = document.cookie.split("; ");
  const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrftoken="));
  return csrfCookie ? csrfCookie.split("=")[1] : null;
}
