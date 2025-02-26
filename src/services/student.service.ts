import { IStudentData } from "../interfaces/student/IStudent";
import { handleResponseStudent } from "./responseHandler.service";

const API_URL = import.meta.env.VITE_API_URL as string;

interface IStudentResponse {
  studentData: unknown;
  token: string;
  status: number;
}

function handleAuthError() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth:logout")); 
}

async function apiRequest(endpoint: string, method: string, body?: unknown, token?: string) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    handleAuthError();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return handleResponseStudent(response);
}

export async function login(email: string, password: string) {
  const data: IStudentResponse = await apiRequest("login", "POST", { email, password });
  localStorage.setItem("token", data.token);
  return data;
}

export async function createStudent(studentData: IStudentData) {
  const data: IStudentResponse = await apiRequest("register", "POST", studentData);
  localStorage.setItem("token", data.token);
  return data;
}

export function deleteStudent(id: string) {
  const token = localStorage.getItem("token");
  return apiRequest(`students/${id}`, "DELETE", undefined, token || undefined);
}

export function getStudents() {
  const token = localStorage.getItem("token");
  return apiRequest("students", "GET", undefined, token || undefined);
}

export function getStudentById(id: string) {
  const token = localStorage.getItem("token");
  return apiRequest(`students/id/${id}`, "GET", undefined, token || undefined);
}

export function getStudentByEmail(email: string) {
  const token = localStorage.getItem("token");
  const encodedEmail = encodeURIComponent(email);
  return apiRequest(`students/email/${encodedEmail}`, "GET", undefined, token || undefined);
}

export function updateStudent(id: string, studentData: IStudentData) {
  const token = localStorage.getItem("token");
  return apiRequest(`${id}`, "PUT", studentData, token || undefined);
}
