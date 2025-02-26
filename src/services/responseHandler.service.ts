import { AxiosResponse } from "axios";

export default async function handleResponse(response: AxiosResponse) {
  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return response.data; 
}

export async function handleResponseStudent(response: AxiosResponse) {
  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return { status: response.status, ...response.data };
}

