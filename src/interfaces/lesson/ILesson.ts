import { IClass } from "../class/IClass";
import { ITheoryMaterial } from "../TheoryMaterial/ITheoryMaterial";
export interface ILesson {
    id: string;          
    name: string;       
    created_at?: string;   
    updated_at?: string;  
    teacher: string;     
    coverImage: string;  
    lessonLink: string;  
    classId?: string;      
    class?: IClass;        
    TheoryMaterial?: ITheoryMaterial[]; 
}
