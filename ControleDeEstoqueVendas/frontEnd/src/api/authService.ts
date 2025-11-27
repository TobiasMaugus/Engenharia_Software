// src/api/authService.ts
import api from "./api";

export async function login(email: string, senha: string) {
    const resp = await api.post("/auth/login", { email, senha });
    const token = resp.data?.token || resp.data?.accessToken;
    if (token) localStorage.setItem("token", token);
    return resp.data;
}

export function logout() {
    localStorage.removeItem("token");
    return api.post("/auth/logout").catch(() => {});
}

export function getProfile() {
    return api.get("/auth/profile");
}
