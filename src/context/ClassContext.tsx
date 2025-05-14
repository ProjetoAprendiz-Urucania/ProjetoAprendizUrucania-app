import { createContext, useState, ReactNode, useEffect } from "react";
import { IClassContext } from "../interfaces/class/IClassContext";
import { IClass, ICreateClass } from "../interfaces/class/IClass";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLessonsByClassId } from "../services/lesson.service";
import { createClass, uploadClassPhoto } from "../services/class.service";

export const ClassContext = createContext<IClassContext | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  const addClass = async (newClass: ICreateClass, selectedPhoto: File) => {
    if (!tk) return;
    try {
      const response = await createClass(newClass, tk);

      if (response) {
        await uploadClassPhoto(response.id, selectedPhoto, tk);
      }

      setClasses((prev) => [
        ...prev,
        { ...newClass, id: response.id, lessons: [] } as IClass,
      ]);
    } catch (error) {
      console.error("Erro ao criar classe:", error);
    }
  };

  const updateClass = (updatedClass: IClass) => {
    setClasses((prev) =>
      prev.map((item) => (item.id === updatedClass.id ? updatedClass : item))
    );
  };

  const removeClass = (classIndex: number) => {
    const updatedClasses = classes.filter((_, index) => index !== classIndex);
    setClasses(updatedClasses);
  };

  const handleSelectedClass = async (classIndex: number) => {
    const selected = { ...classes[classIndex], lessons: [] };
    setSelectedClass(selected);
    localStorage.setItem("selectedClass", JSON.stringify(selected));

    if (tk && selected.id) {
      const response = await getLessonsByClassId(selected.id, tk);
      setSelectedClass((prev) =>
        prev ? { ...prev, lessons: response || [] } : null
      );
    }
  };

  const handleSelectedLesson = (lessonIndex: number) => {
    if (!selectedClass) return;
    const selectedLesson = selectedClass.lessons[lessonIndex];
    setSelectedLesson(selectedLesson);
  };

  const loadSelectedClassFromStorage = async () => {
    const storedClass = localStorage.getItem("selectedClass");
    if (!storedClass) {
      setSelectedClass(null);
      return;
    }

    try {
      const recoverClassData: IClass = JSON.parse(storedClass);
      setSelectedClass({ ...recoverClassData, lessons: [] });

      if (tk && recoverClassData.id) {
        const response = await getLessonsByClassId(recoverClassData.id, tk);
        setSelectedClass((prev) =>
          prev ? { ...prev, lessons: response || [] } : null
        );
      }
    } catch (error) {
      console.error("Erro ao fazer parse do selectedClass:", error);
      localStorage.removeItem("selectedClass");
      setSelectedClass(null);
    }
  };

  useEffect(() => {
    loadSelectedClassFromStorage();
  }, []);

  return (
    <ClassContext.Provider
      value={{
        selectedClass,
        setSelectedClass,
        classes,
        setClasses,
        selectedLesson,
        addClass,
        updateClass,
        removeClass,
        handleSelectedClass,
        handleSelectedLesson,
        loadSelectedClassFromStorage,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
