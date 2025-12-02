import api from "./api";
import type { AxiosError } from "axios";

export type LoginResult =
    | { success: true; token: string }
    | { success: false; message: string };


export const loginRequest = async (
    username: string,
    password: string
): Promise<LoginResult> => {
    try {
        const response = await api.post<string>("/auth/login", {
            username,
            password,
        });

        return { success: true, token: response.data };
    } catch (err) {
        const error = err as AxiosError;

        if (error.response?.status === 401) {
            return { success: false, message: "Usuário ou senha incorretos" };
        }
        return { success: false, message: "Erro no servidor" };
    }
};


export interface DecodedUser {
    username: string;
    role: string;
}


export function decodeToken(token: string): DecodedUser | null {
    try {
        const payloadBase64 = token.split(".")[1];
        const jsonPayload = atob(payloadBase64);
        const payload = JSON.parse(jsonPayload);

        return {
            username: payload.sub ?? "Usuário",
            role: payload.roles?.[0] ?? "Sem função",
        };
    } catch (e) {
        console.error("Erro ao decodificar token:", e);
        return null;
    }
}

export function getUserFromToken(): DecodedUser | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return decodeToken(token);
}
