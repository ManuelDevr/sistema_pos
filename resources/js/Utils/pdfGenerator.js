import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con encabezado profesional y logo.
 */
export const generateProfessionalPDF = ({ title, filename, headers, body, config, dateRange = null }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Estilos base
  const primaryColor = [79, 70, 229]; // Indigo 600
  const textColor = [50, 50, 50];
  const mutedColor = [120, 120, 120];

  // 2. Encabezado de Empresa
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(config?.nombre_empresa || 'Ferretería CMA', 15, 15);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`RUC: ${config?.ruc || '---'} | Tel: ${config?.telefono || '---'} | ${config?.direccion || ''}`, 15, 23);

  // 3. Título del Reporte
  let currentY = 50;
  doc.setTextColor(...textColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Manejo de título largo (split por '|')
  const titleParts = title.split(' | ');
  titleParts.forEach((part, index) => {
      doc.text(part, 15, currentY + (index * 7));
  });
  
  currentY += (titleParts.length * 7) + 5;

  // 4. Meta-info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`Generado el: ${new Date().toLocaleString()}`, 15, currentY);
  
  if (dateRange) {
    doc.text(`Rango: ${dateRange.start || '...'} hasta ${dateRange.end || '...'}`, 15, currentY + 5);
  }

  // 5. Tabla
  autoTable(doc, {
    startY: currentY + 12,
    head: [headers],
    body: body,
    theme: 'grid',
    headStyles: { 
        fillColor: primaryColor,
        fontSize: 9,
        halign: 'center',
        fontStyle: 'bold'
    },
    styles: { 
        fontSize: 8,
        cellPadding: 3
    },
    alternateRowStyles: {
        fillColor: [245, 247, 250]
    }
  });

  // 6. Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount} - Generado por Sistema CMA`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
};
