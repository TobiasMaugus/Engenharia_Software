// src/api/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// 🔥 Interceptor para adicionar o token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // deve estar salvo no login

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
