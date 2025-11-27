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
