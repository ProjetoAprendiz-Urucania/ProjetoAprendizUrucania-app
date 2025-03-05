import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axios.service";

function handleAuthError() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth:logout"));
}

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown, // corpo da requisição, opcional
  token?: string // token de autenticação, opcional
) {
  try {
    // Cabeçalhos gerais, iniciando com um objeto vazio
    const headers: Record<string, string> = {};

    // Se o token for fornecido, adiciona o cabeçalho de autorização
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Cria a configuração da requisição utilizando o tipo AxiosRequestConfig
    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      headers,
    };

    if (body) {
      // Para POST/PUT/DELETE, adiciona o corpo da requisição
      config.data = body;
    }

    const response: AxiosResponse = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Verifica se o erro é de autenticação (status 401)
      if (error.response?.status === 401) {
        handleAuthError();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      // Se o erro for outro, lança um erro com o status da resposta
      throw new Error(
        error.response?.data?.error ||
          `Erro: ${error.response?.status} - ${error.response?.statusText}`
      );
    }

    // Caso seja outro tipo de erro, lança um erro genérico
    throw new Error("Erro inesperado na requisição.");
  }
}
