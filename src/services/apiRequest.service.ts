import { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "./axios.service";

function handleAuthError() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth:logout"));
}

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown,
  token?: string
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response: AxiosResponse = await axiosInstance({
      url: endpoint,
      method,
      data: body,
      headers,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        handleAuthError();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      throw new Error(
        error.response?.data?.error ||
          `Erro: ${error.response?.status} - ${error.response?.statusText}`
      );
    }

    throw new Error("Erro inesperado na requisição.");
  }
}
