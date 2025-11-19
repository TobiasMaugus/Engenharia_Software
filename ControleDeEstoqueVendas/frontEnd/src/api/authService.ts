// src/api/authService.ts
import api from "./api";

export async function login(email: string, senha: string) {
    const resp = await api.post("/auth/login", { email, senha });
    // ajuste conforme seu back: resp.data.token ou resp.data.accessToken
    const token = resp.data?.token || resp.data?.accessToken;
    if (token) localStorage.setItem("token", token);
    return resp.data;
}

export function logout() {
    localStorage.removeItem("token");
    // opcional: chamar logout no back
    return api.post("/auth/logout").catch(() => {});
}

export function getProfile() {
    return api.get("/auth/profile");
}
