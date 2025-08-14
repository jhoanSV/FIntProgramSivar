import { DotProduct } from './App';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const VerifyCodNit = (value) =>{
    const WeightDian = [71,67,59,53,47,43,41,37,29,23,19,17,13,7,3]
    let CodVe = value
    const digitList = Array.from(CodVe).filter(char => /\d/.test(char)).map(Number);
    // Completar digitList con ceros al principio para que tenga 15 entradas
    const filledDigitList = new Array(15 - digitList.length).fill(0).concat(digitList);
    const dot = DotProduct(filledDigitList, WeightDian)
    const result = 11-( dot % 11)
    //console.log(result)
    //setVerCod(result)
    return result
};

export function verificarCamposVacios(dataList, camposRequeridos) {
    const camposVacios = camposRequeridos.filter(
        campo => !String(dataList[campo] ?? '').trim()
    );
    return camposVacios;
};

export const toExcel = (ourData, filename = 'File.csv') => {
    if (!Array.isArray(ourData) || ourData.length === 0) {
        console.error('No hay datos para exportar');
        return;
    }

    const titleKeys = Object.keys(ourData[0]);

    // Construye encabezados
    let csvContent = titleKeys.join(',') + '\n';

    // Construye cada fila
    ourData.forEach(item => {
        const row = titleKeys.map(key => {
            let val = item[key] ?? '';
            // Escapa comillas dobles y encierra entre comillas si contiene coma o salto de línea
            val = String(val).replace(/"/g, '""');
            return /[",\n]/.test(val) ? `"${val}"` : val;
        });
        csvContent += row.join(',') + '\n';
    });

    // Crea el archivo y lo descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const objUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objUrl);
};

export const toRealExcel = (ourData, fileName = 'file.xlsx') => {
    if (!Array.isArray(ourData) || ourData.length === 0) {
        console.error('No hay datos para exportar');
        return;
    }

    // Crea una hoja de cálculo a partir del array de objetos
    const worksheet = XLSX.utils.json_to_sheet(ourData);

    // Crea un libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

    // Escribe y descarga el archivo
    XLSX.writeFile(workbook, fileName);
};



export function priceValue(valor) {
    /*if (!valor) return ''
    let TheValue = String(valor)
    const numberfromat = Number(TheValue.replace(/,/g, '.'));*/
    return new Intl.NumberFormat('es-CO').format(valor);
}

export function dateFormat(dateInput) {
    const isoDate = dateInput;
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formatted = `${day}/${month}/${year}`;
    return formatted
};

export function dateFormatSend() {
  
  return
}

export function calcularDiferenciaDias (fechaInicial, fechaFinal) {
    const fechaInicio = new Date(fechaInicial); // viene del input tipo "2025-06-21"
    const fechaActual = new Date(fechaFinal); // hoy
    // Limpiamos la hora para que solo compare fechas, no horas
    fechaInicio.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaActual - fechaInicio;
    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    return dias;
};

export const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0]; // '2025-07-15'
};

export const toStyledExcel = async (
  data,
  fileName = 'file.xlsx',
  headers = null,
  condition = null
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Hoja1');

  if (headers !== null) {
    worksheet.columns = headers.map((item) => ({
      header: item.header,
      key: item.key,
      width: 20,
    }));
  }

  // Añadir filas
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Aplicar estilos condicionales a toda la fila
  if (condition !== null) {
    worksheet.eachRow((row, rowNumber) => {
      // Saltar encabezado si existe
      if (headers !== null && rowNumber === 1) return;

      let cellToCheck;

      if (headers !== null) {
        // Buscar columna por nombre (key)
        const colIndex = headers.findIndex(h => h.key === condition[0]) + 1;
        cellToCheck = row.getCell(colIndex);
      } else {
        // Usar número de columna (empezando desde 1)
        cellToCheck = row.getCell(Number(condition[0]));
      }

      if (cellToCheck && cellToCheck.value === condition[1]) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' } // amarillo
          };
        });
      }
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
};

