/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { IClassContext } from "../interfaces/class/IClassContext";
import { IClass } from "../interfaces/class/IClass";
import { getAdminClasses, getClassById } from "../services/class.service";
import { useAuth } from "../hooks/useAuth";
import { getStudentClasses } from "../services/studentClass.service";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLessonsByClassId } from "../services/lesson.service";
import { getAllMaterials } from "../services/theoryMaterials.service";
import { ITheoryMaterial } from "../interfaces/TheoryMaterial/ITheoryMaterial";

export const ClassContext = createContext<IClassContext | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [materials, setMaterials] = useState<ITheoryMaterial[]>([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);

  const tk = localStorage.getItem("token");

  const handleSelectedClass = (classIndex: number) => {
    if (classIndex < 0 || classIndex >= classes.length) {
      console.warn("Índice de classe inválido:", classIndex);
      return;
    }

    const selected = classes[classIndex];
    setSelectedClassIndex(classIndex);
    setSelectedClass(selected);
    setLessons([]);
    localStorage.setItem("selectedClassId", selected.id);
  };

  const loadSelectedClassFromStorage = useCallback(async () => {
    if (!tk) return;
    const storedClassId = localStorage.getItem("selectedClassId");
    if (!storedClassId) return;

    const classData = await getClassById(storedClassId, tk);
    setSelectedClass(classData);
  }, [tk]);

  const fetchMaterials = async () => {
    if (!tk || !selectedClass) return;
    try {
      const res = await getAllMaterials(selectedClass.id, tk);
      setMaterials(res || []);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    }
  };

  const fetchLessons = useCallback(async () => {
    if (!tk || !selectedClass?.id) return;
    try {
      const res = await getLessonsByClassId(selectedClass.id, tk);
      const updatedLessons = res || [];

      setLessons(updatedLessons);
      setSelectedClass((prev) =>
        prev ? { ...prev, lessons: updatedLessons } : prev
      );
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);

      setLessons([]);
      setSelectedClass((prev) => (prev ? { ...prev, lessons: [] } : prev));
    }
  }, [tk, selectedClass?.id]);

  const fetchStudentClasses = useCallback(async () => {
    if (!tk || !user) return;
    const role = user.role;
    const response =
      role === "admin"
        ? await getAdminClasses(tk)
        : await getStudentClasses(user.id, tk);
    const fetched =
      role === "admin"
        ? Array.isArray(response)
          ? response
          : []
        : Array.isArray(response.classes)
          ? response.classes
          : [];
    setClasses(fetched);
  }, [tk, user]);

  useEffect(() => {
    loadSelectedClassFromStorage();
  }, [loadSelectedClassFromStorage]);

  return (
    <ClassContext.Provider
      value={{
        selectedClass,
        setSelectedClass,
        classes,
        setClasses,
        lessons,
        setLessons,
        handleSelectedClass,
        loadSelectedClassFromStorage,
        selectedClassIndex,
        fetchStudentClasses,
        fetchLessons,
        fetchMaterials,
        materials,
        tk,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
