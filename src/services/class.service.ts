import { IClass } from "../interfaces/class/IClass";
import handleResponse from "./responseHandler.service";

const API_URL = import.meta.env.VITE_API_URL as string;

async function apiRequest(endpoint: string, method: string, body?: unknown, token?: string) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse(response);
}

export function createClass(classData: IClass) {
  return apiRequest("classes", "POST", classData);
}

export function deleteClass(id: string) {
  return apiRequest(`classes/${id}`, "DELETE");
}

export function getClasses(token: string) {
  return apiRequest("classes", "GET", undefined, token);
}

export function getClassById(id: string, token?: string) {
  return apiRequest(`classes/${id}`, "GET", undefined, token);
}

export function updateClass(id: string, classData: IClass, token?: string) {
  return apiRequest(`classes/${id}`, "PUT", classData, token);
}
