// import { ILesson } from "../interfaces/lesson/ILesson";

const API_URL = import.meta.env.VITE_API_URL as string;

async function handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error || `Erro: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }
  
    return response.json(); 
}

export async function getLessons(id: string){
    try {
        const response = await fetch(`${API_URL}/class/${id}/lesson`);
        const lessons = await handleResponse(response)
        return lessons;
    } catch (error) {
        console.error("Erro ao obter lessons:", error);
        throw error;
    }
}