import { IClass } from "../interfaces/class/IClass";
import handleResponse from "./responseHandler.service";

const API_URL = import.meta.env.VITE_API_URL as string;

export async function createClass(classData: IClass) {
  try {
    const response = await fetch(`${API_URL}/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao criar classe:", error);
    throw error;
  }
}

export async function deleteClass(id: string) {
  try {
    const response = await fetch(`${API_URL}/classes/${id}`, { method: "DELETE" });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao deletar classe:", error);
    throw error;
  }
}

export async function getClasses(token: string) {
  try {
    const response = await fetch(`${API_URL}/classes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const classes = await handleResponse(response)
    return classes;
  } catch (error) {
    console.error("Erro ao obter classes:", error);
    throw error;
  }
}

export async function getClassById(id: string) {
  try {
    const response = await fetch(`${API_URL}/classes/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao obter classe:", error);
    throw error;
  }
}

export async function updateClass(id: string, classData: IClass) {
  try {
    const response = await fetch(`${API_URL}/classes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao atualizar classe:", error);
    throw error;
  }
}
