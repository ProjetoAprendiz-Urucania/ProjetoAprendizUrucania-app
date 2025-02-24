import { IStudentData } from "../interfaces/student/IStudent";

const API_URL = import.meta.env.VITE_API_URL as string;

interface ICreateStudentResponse {
  studentData: unknown;
  token: string;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
    errorData?.error || `Erro: ${response.status} - ${response.statusText}`;
    throw new Error(errorMessage);
  }
  const data = await response.json().catch(() => ({}));
  return { status: response.status, ...data };
}


export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: ICreateStudentResponse = await handleResponse(response);
    localStorage.setItem("token",data.token)
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

export async function createStudent(studentData: IStudentData) {

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    const data: ICreateStudentResponse = await handleResponse(response);
    localStorage.setItem("token",data.token)

    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao fazer registro:", error);
    throw error;
  }
}

export async function deleteStudent(id: string) {
  try {
    const response = await fetch(`${API_URL}/students/${id}`, { method: "DELETE" });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao deletar estudante:", error);
    throw error;
  }
}

export async function getStudents() {
  try {
    const response = await fetch(`${API_URL}/students`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao obter estudantes:", error);
    throw error;
  }
}

export async function getStudentById(id: string) {
  try {
    const response = await fetch(`${API_URL}/students/id/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter estudante:", error);
    throw error;
  }
}

export async function getStudentByEmail(email: string) {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(`${API_URL}/students/email/${encodedEmail}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao obter estudante:", error);
    throw error;
  }
}

export async function updateStudent(id: string, studentData: IStudentData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao atualizar estudante:", error);
    throw error;
  }
}
