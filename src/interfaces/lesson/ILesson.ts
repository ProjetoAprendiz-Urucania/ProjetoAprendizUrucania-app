// import { IClass } from "../class/IClass";
// import { ITheoryMaterial } from "../TheoryMaterial/ITheoryMaterial";
export interface ILesson {
    id?: string;          
    name: string;       
    teacher: string;     
    coverImage?: string;  
    lessonLink: string;  
}
