import { IStudentData } from "../interfaces/student/IStudent";
import { apiRequest } from "./apiRequest.service";
import { IStudentResponse } from "../interfaces/student/IStudentResponse";

import bcrypt from "bcryptjs";

export async function forgotPassword(email: string) {
  const data: IStudentResponse = await apiRequest(`forgot/email/${email}`, "POST");

  if (!data.hash) {
    console.error("Erro: Hash ausente na resposta!");
    throw new Error("Falha na redefinição: Hash não recebido.");
  }

  localStorage.setItem("hash", data.hash)
  return
}

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

    localStorage.removeItem("hash");
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

  localStorage.removeItem("hash");
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

// export function getStudentByEmail(email: string) {
//   if(!email){
//     throw new Error("Email is required");
//   }

//   const token = localStorage.getItem("token");
//   const encodedEmail = encodeURIComponent(email);
//   return apiRequest(
//     `students/email/${encodedEmail}`,
//     "GET",
//     undefined,
//     token || undefined
//   );
// }

export function updateStudent(id: string, studentData: IStudentData) {
  const token = localStorage.getItem("token");
  return apiRequest(`${id}`, "PUT", studentData, token || undefined);
}

export async function confirmHashChangePassword(code: string, localHash: string) {
  try {
    const result = await bcrypt.compare(code, localHash);
    return result;
  } catch (error) {
    console.log("Erro ao conferir hash de troca de senha")
  }
}