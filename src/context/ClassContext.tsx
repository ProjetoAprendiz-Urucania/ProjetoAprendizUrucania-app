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
  const [selectedClass, setSelectedClass] = useState<number | undefined>(
    undefined
  );
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [tk] = useState<string | null>(localStorage.getItem("token"));

  const addClassToList = (newClass: IClass) => {
    setClasses((prev) => [...prev, newClass]);
  };

  const updateClassInList = (updatedClass: IClass) => {
    setClasses((prev) =>
      prev.map((item) => (item.id === updatedClass.id ? updatedClass : item))
    );
  };

  const removeClassToList = (classIndex: number) => {
    const updatedClasses = classes.filter((_, index) => index !== classIndex);
    setClasses(updatedClasses);
  };

  const addLessonToList = (newlesson: ILesson) => {
    setLessons((prev) => [...prev, newlesson]);
  };

  const updateLessonInList = (updatedlesson: ILesson) => {
    setLessons((prev) =>
      prev.map((item) => (item.id === updatedlesson.id ? updatedlesson : item))
    );
  };

  const removeLessonToList = (lessonIndex: number) => {
    const updatedLessons = lessons.filter((_, index) => index !== lessonIndex);
    setLessons(updatedLessons);
  };

  useEffect(() => {
    if (!selectedClass) return;

    const selectedClassData = classes[selectedClass];

    console.log(selectedClassData);

    if (selectedClassData.id) {
      const fetchLessons = async () => {
        if (!tk) {
          console.log("err get classes() token inexistente");
        } else {
          const response = await getLessonsByClassId(selectedClassData.id!, tk);
          setLessons(response);
        }
      };

      fetchLessons();
    }
  }, [tk, classes, selectedClass]);

  return (
    <ClassContext.Provider
      value={{
        selectedClass,
        setSelectedClass,
        classes,
        setClasses,
        lessons,
        setLessons,
        addLessonToList,
        updateLessonInList,
        removeLessonToList,
        addClassToList,
        updateClassInList,
        removeClassToList,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
