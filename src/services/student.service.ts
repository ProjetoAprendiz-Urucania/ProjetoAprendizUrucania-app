import { IStudentData } from "../interfaces/student/IStudent";
import { apiRequest } from "./apiRequest.service";
import { IStudentResponse } from "../interfaces/student/IStudentResponse";

export async function login(email: string, password: string) {
  try {
    const data: IStudentResponse = await apiRequest("login", "POST", {
      email,
      password,
    });

    if (!data.token) {
      console.error("Erro: Token ausente na resposta!");
      throw new Error("Falha no login: token não recebido.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.studentWithoutPassword));

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}

export async function createStudent(
  name: string,
  email: string,
  password: string,
  church: string
) {
  const data: IStudentResponse = await apiRequest("register", "POST", {
    name,
    email,
    password,
    church,
  });

  if (!data.token) {
    console.error("Erro: Token ausente na resposta!");
    throw new Error("Falha no Registro: token não recebido.");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.studentWithoutPassword));

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
  return apiRequest(
    `students/email/${encodedEmail}`,
    "GET",
    undefined,
    token || undefined
  );
}

export function updateStudent(id: string, studentData: IStudentData) {
  const token = localStorage.getItem("token");
  return apiRequest(`${id}`, "PUT", studentData, token || undefined);
}
