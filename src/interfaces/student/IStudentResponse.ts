export interface IStudentResponse {
  studentWithoutPassword: {
    church: string;
    classId: string | null;
    created_at: string;
    email: string;
    id: string;
    name: string;
    profilePicture: string | null;
    role: string;
    status: boolean;
    updated_at: string;
  };
  token: string;
}