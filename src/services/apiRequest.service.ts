import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
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
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (body instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data; boundary";

    } else {
      headers["Content-Type"] = "application/json";
    }

    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      headers,
      data: body, 
    };

    console.log("Configuração da requisição:", config);

    const response: AxiosResponse = await axiosInstance(config);
    console.log("Resposta recebida do servidor:", response);
    return response.data;
  } catch (error) {
    console.log("Erro na requisição:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        handleAuthError();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      console.log("Detalhes do erro:", error.response?.data);
      throw new Error(
        error.response?.data?.error ||
          `Erro: ${error.response?.status} - ${error.response?.statusText}`
      );
    }

    throw new Error("Erro inesperado na requisição.");
  }
}
