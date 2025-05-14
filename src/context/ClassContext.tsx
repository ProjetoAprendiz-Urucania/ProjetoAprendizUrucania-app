import { createContext, useState, ReactNode, useEffect } from "react";
import { IClassContext } from "../interfaces/class/IClassContext";
import { IClass } from "../interfaces/class/IClass";
import { ILesson } from "../interfaces/lesson/ILesson";
import { getLessonsByClassId } from "../services/lesson.service";
// eslint-disable-next-line react-refresh/only-export-components
export const ClassContext = createContext<IClassContext | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider = ({ children }: ClassProviderProps) => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);

  const [tk] = useState<string | null>(localStorage.getItem("token"));

  const addClass = (newClass: IClass) => {
    setClasses((prev) => [...prev, newClass]);
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

  const handleSelectedClass = (classIndex: number) => {
    const selectedClass = classes[classIndex];
    setSelectedClass(selectedClass);
    localStorage.setItem("selectedClass", JSON.stringify(selectedClass));
  };

  const handleSelectedLesson = (lessonIndex: number) => {
    if (!selectedClass) return;

    const selectedLesson = selectedClass.lessons[lessonIndex];

    setSelectedLesson(selectedLesson);
  };

  // const addLesson = (newlesson: ILesson) => {
  //   setLessons((prev) => [...prev, newlesson]);
  // };

  // const updateLesson = (updatedlesson: ILesson) => {
  //   setLessons((prev) =>
  //     prev.map((item) => (item.id === updatedlesson.id ? updatedlesson : item))
  //   );
  // };

  // const removeLesson = (lessonIndex: number) => {
  //   const updatedLessons = lessons.filter((_, index) => index !== lessonIndex);
  //   setLessons(updatedLessons);
  // };

  useEffect(() => {
    if (!selectedClass) return;

    console.log("classe selecionada:", selectedClass);

    if (selectedClass.id) {
      const fetchLessons = async () => {
        if (!tk) {
          console.log("err get classes() token inexistente");
        } else {
          const response = await getLessonsByClassId(selectedClass.id!, tk);
          setSelectedClass({
            ...selectedClass,
            lessons: response,
          });
        }
      };

      fetchLessons();
    }
  }, [selectedClass]);

  useEffect(() => {
    const storedClass = localStorage.getItem("selectedClass");
    try {
      const recoverClassData = storedClass ? JSON.parse(storedClass) : null;
      setSelectedClass(recoverClassData);
    } catch (error) {
      console.error("Erro ao fazer parse do selectedClass:", error);
      localStorage.removeItem("selectedClass");
      setSelectedClass(null);
    }
  }, [classes]);

  return (
    <ClassContext.Provider
      value={{
        selectedClass,
        setSelectedClass,
        classes,
        setClasses,
        selectedLesson,
        // addLesson,
        // updateLesson,
        // removeLesson,
        addClass,
        updateClass,
        removeClass,
        handleSelectedClass,
        handleSelectedLesson,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
