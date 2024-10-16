import React, { useState } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function GenerarReporte() {
  const [formato, setFormato] = useState('pdf');
  
  // Datos de ejemplo (esto debería ser reemplazado por datos reales)
  const usuarios = [{ id: 1, nombre: 'Usuario 1' }, { id: 2, nombre: 'Usuario 2' }];
  const tiposUsuarios = [{ id: 1, nombre: 'Tipo 1' }, { id: 2, nombre: 'Tipo 2' }];
  
  // Manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      usuario: event.target.usuario.value,
      tipo_usuario: event.target.tipo_usuario.value,
      // Agregar otros campos que necesites
    };

    if (formato === 'pdf') {
      generatePDF(data);
    } else if (formato === 'xlsx') {
      generateExcel(data);
    } else if (formato === 'csv') {
      generateCSV(data);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.text('Reporte de Datos', 10, 10);
    doc.text(`Usuario: ${data.usuario}`, 10, 20);
    doc.text(`Tipo de Usuario: ${data.tipo_usuario}`, 10, 30);
    // Agregar más datos según sea necesario
    doc.save('reporte.pdf');
  };

  const generateExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet([data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
    XLSX.writeFile(workbook, 'reporte.xlsx');
  };

  const generateCSV = (data) => {
    const csvData = [
      ['Usuario', 'Tipo de Usuario'], // Encabezados
      [data.usuario, data.tipo_usuario], // Datos
    ];
    const csvString = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reporte.csv');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Generar Reporte</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo para seleccionar el formato del reporte */}
        <label htmlFor="formato">Formato:</label>
        <select id="formato" name="formato" className="w-full" onChange={(e) => setFormato(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="xlsx">Excel</option>
          <option value="csv">CSV</option>
        </select>

        {/* Sección de Usuarios */}
        <fieldset className="border p-4 rounded">
          <legend className="font-bold">Filtrar por Usuarios</legend>
          <label htmlFor="usuario">Seleccionar Usuario:</label>
          <select id="usuario" name="usuario" className="w-full">
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.nombre}>
                {usuario.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="tipo_usuario">Tipo de Usuario:</label>
          <select id="tipo_usuario" name="tipo_usuario" className="w-full">
            {tiposUsuarios.map(tipo => (
              <option key={tipo.id} value={tipo.nombre}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </fieldset>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Generar Reporte</button>
      </form>
    </div>
  );
}
