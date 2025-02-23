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

export async function getLessonsByClassId(id: string){
    try {
        const response = await fetch(`${API_URL}/classes/${id}/lessons`);
        const lessons = await handleResponse(response)
        return lessons;
    } catch (error) {
        console.error("Erro ao obter lessons:", error);
        throw error;
    }
}

export async function getLesson(classId: string,lessonId: string){
  try {
      const response = await fetch(`${API_URL}/classes/${classId}/${lessonId}`);
      const lesson = await handleResponse(response)
      return lesson;
  } catch (error) {
      console.error("Erro ao obter lesson:", error);
      throw error;
  }
}