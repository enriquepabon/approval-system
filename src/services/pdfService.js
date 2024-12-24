import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateRequestPDF = (request, approvalDetails) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text('Solicitud de Cambio de Precio', 20, 20);

  // Información General
  doc.setFontSize(12);
  doc.text(`ID Solicitud: ${request.id}`, 20, 35);
  doc.text(`Fecha: ${new Date(request.fechaSolicitud).toLocaleDateString()}`, 20, 45);

  // Tabla de información del solicitante
  doc.autoTable({
    startY: 55,
    head: [['Información del Solicitante']],
    body: [
      ['Nombre', request.nombreSolicitante],
      ['Correo', request.correoSolicitante]
    ],
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Tabla de información del proveedor
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Información del Proveedor']],
    body: [
      ['Nombre', request.nombreProveedor],
      ['Código', request.codigoProveedor]
    ],
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Tabla de precios
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Información de Precios']],
    body: [
      ['Precio Actual', `$${request.precioActual}`],
      ['Nuevo Precio', `$${request.nuevoPrecio}`],
      ['Variación', `${request.porcentajeCambio}%`],
      ['Tipo de Cambio', request.tipoCambio === 'precio' ? 'Precio Directo' : 'Porcentaje FEP']
    ],
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] }
  });

  // Comentarios
  if (request.comentarios) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Comentarios de la Solicitud']],
      body: [[request.comentarios]],
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] }
    });
  }

  // Información de aprobación
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Información de Aprobación']],
    body: [
      ['Estado', approvalDetails.status === 'approved' ? 'APROBADO' : 'RECHAZADO'],
      ['Fecha', new Date().toLocaleDateString()],
      ['Comentarios', approvalDetails.comments || 'Sin comentarios']
    ],
    theme: 'striped',
    headStyles: { fillColor: approvalDetails.status === 'approved' ? [40, 167, 69] : [220, 53, 69] }
  });

  return doc;
};