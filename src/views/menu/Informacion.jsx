import React from 'react';

export default function Informacion() {
  const handleDownload = () => {
    // Aquí iría la lógica para descargar la póliza
    console.log("Descargando póliza...");
    // Ejemplo de enlace de descarga
    const link = document.createElement('a');
    link.href = '/ruta/a/tu/archivo/poliza.pdf'; // Cambia la ruta por la ruta real de la póliza
    link.download = 'poliza.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Información de la Póliza</h2>
      <p><strong>Número de Póliza:</strong> 123456789</p>
      <p><strong>Nombre del Asegurado:</strong> Juan Pérez</p>
      <p><strong>Fecha de Emisión:</strong> 15 de Octubre de 2024</p>
      <p><strong>Vigencia:</strong> 15 de Octubre de 2024 - 15 de Octubre de 2025</p>
      <p><strong>Tipo de Cobertura:</strong> Cobertura Completa</p>
      <p><strong>Prima Total:</strong> $500.00 USD</p>
      
      <button 
        onClick={handleDownload} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Descargar Póliza
      </button>
    </div>
  );
}