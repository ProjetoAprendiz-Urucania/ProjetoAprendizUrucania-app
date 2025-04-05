import { IStudent } from "../interfaces/student/IStudent";
import { apiRequest } from "./apiRequest.service";
import { IStudentResponse } from "../interfaces/student/IStudentResponse";

export async function forgotPassword(email: string) {
  try {
    const data: IStudentResponse = await apiRequest(`forgot/email/${email}`, "POST");
    
    if (!data.hash) {
      console.error("Erro: Hash ausente na resposta!");
      throw new Error("Email não identificado");
    }

    return "userExists"

  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
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
  return apiRequest(`students/${id}`, "GET", undefined, token || undefined);
}

export function uploadProfilePhoto(id: string, profilePhoto: File | null) {

  if (!profilePhoto) {
    console.error("Nenhum arquivo foi selecionado!");
    return Promise.reject("Nenhum arquivo foi selecionado.");
  }

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append('profilePhoto', profilePhoto);

  return apiRequest(`students/${id}/profilePhoto`, "POST", formData, token || undefined);
}

export function deleteProfilePhoto(userId: string) {

  if (!userId) {
    return Promise.reject("Nenhum usuário identificado.");
  }

  const token = localStorage.getItem("token");

  return apiRequest(`students/${userId}/profilePhoto`, "DELETE", null, token || undefined);
}


export function getStudentByEmail(email: string) {
  if(!email){
    throw new Error("Email is required");
  }

  const token = localStorage.getItem("token");
  const encodedEmail = encodeURIComponent(email);
  return apiRequest(
    `students/email/${encodedEmail}`,
    "GET",
    undefined,
    token || undefined
  );
}

export function updateStudent(id: string, studentData: IStudent, token:string) {
  return apiRequest(`/students/${id}`, "PUT", studentData, token || undefined);
}
