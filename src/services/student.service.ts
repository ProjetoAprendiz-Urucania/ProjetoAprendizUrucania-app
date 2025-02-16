import { IStudentData } from '../interfaces/student/IStudent';

const API_URL = import.meta.env.VITE_API_URL as string;


export async function login(email: string, password: string) {
  try {
    console.log(API_URL);
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

export async function createStudent(studentData: IStudentData) {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  return response.json();
}

export async function deleteStudent(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function getStudents() {
  const response = await fetch(`${API_URL}`);
  return response.json();
}

export async function getStudentById(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
}

export async function updateStudent(id: string, studentData: IStudentData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  return response.json();
}
