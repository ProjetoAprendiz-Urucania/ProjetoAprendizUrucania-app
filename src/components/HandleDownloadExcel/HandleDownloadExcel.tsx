import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getFrequencyList } from "../../services/frequencyList.service";
import { AlertColor } from "@mui/material";
import { horizontalAlign, verticalAlign } from "../AlertMessage";

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
    console.log(response);
    const { success, data } = response;

    if (!success || data.students.length === 0) {
      console.warn("Nenhuma presença registrada.");
      handleMessage("Nenhuma presença registrada.", "warning", {
        vertical: "top",
        horizontal: "right",
      });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Presenças");

    const columns = Object.keys(data.students[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 25,
    }));

    worksheet.columns = columns;

    data.students.forEach((student: unknown) => {
      worksheet.addRow(student);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `listagem-${data.turma}-${data.aula}.xlsx`);
  } catch (error) {
    console.error("Erro ao gerar arquivo Excel:", error);
  }
};
