import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getFrequencyList } from "../../services/frequencyList.service";
import { AlertColor } from "@mui/material";
import { horizontalAlign, verticalAlign } from "../AlertMessage";
import { getStudentsByClassId } from "../../services/user.service";
import { IStudent } from "../../interfaces/student/IStudent";

export const handleDownloadExcel = async (
  classId: string,
  lessonId: string,
  handleMessage: (
    message: string,
    error: AlertColor,
    position?: {
      vertical?: verticalAlign;
      horizontal?: horizontalAlign;
    }
  ) => void
) => {
  try {
    const response = await getFrequencyList(classId, lessonId);
    const { success, data } = response;

    if (!success) {
      handleMessage("Erro ao buscar presenças.", "error", {
        vertical: "top",
        horizontal: "right",
      });
      return;
    }

    let allStudents = [];
    try {
      const studentsResponse = await getStudentsByClassId(classId);
      allStudents = studentsResponse.students || [];
    } catch (error) {
      console.error("Erro ao obter estudantes da turma:", error);
      handleMessage("Erro ao obter estudantes da turma.", "error", {
        vertical: "top",
        horizontal: "right",
      });
      return;
    }

    if (allStudents.length === 0) {
      handleMessage("Nenhum aluno encontrado na turma.", "warning", {
        vertical: "top",
        horizontal: "right",
      });
      return;
    }

    const presentIds = new Set(data.students.map((s: any) => s.id));

    console.log("Lista de presenças:", data.students);
    console.log("Lista de todos os estudantes:", allStudents);

    const fullList = allStudents.map((student: any) => ({
      Nome: student.name,
      Email: student.email,
      Presença: presentIds.has(student.id) ? "Presente" : "Ausente",
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Presenças");

    worksheet.columns = [
      { header: "Nome", key: "Nome", width: 30 },
      { header: "Email", key: "Email", width: 35 },
      { header: "Presença", key: "Presença", width: 15 },
    ];

    fullList.forEach((student: IStudent) => {
      worksheet.addRow(student);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `frequencia-${data.turma}-${data.aula}.xlsx`);
  } catch (error) {
    console.error("Erro ao gerar arquivo Excel:", error);
    handleMessage("Erro ao gerar arquivo Excel.", "error", {
      vertical: "top",
      horizontal: "right",
    });
  }
};
