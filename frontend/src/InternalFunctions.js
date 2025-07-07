import { DotProduct } from './App';
import * as XLSX from 'xlsx';

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
