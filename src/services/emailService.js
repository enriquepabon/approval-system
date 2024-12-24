// Simulación de servicio de correo (en producción usarías una API real)
export const emailService = {
    sendApprovalRequest: async (requestData) => {
      const subject = `Solicitud de Aprobación de Precios - ${requestData.nombreProveedor}`;
      const body = `
        Por favor revise la siguiente solicitud de aprobación:
        
        Solicitante: ${requestData.nombreSolicitante}
        Proveedor: ${requestData.nombreProveedor}
        Código: ${requestData.codigoProveedor}
        
        Acceda a la solicitud en: ${window.location.origin}/approve/${requestData.id}
      `;
  
      // En producción, aquí irían las credenciales del servicio de correo
      console.log('Email enviado:', { subject, body });
      return true;
    },
  
    sendApprovalNotification: async (requestData, isApproved) => {
      const subject = `Solicitud ${isApproved ? 'Aprobada' : 'Rechazada'} - ${requestData.nombreProveedor}`;
      const body = `
        Su solicitud de cambio de precios ha sido ${isApproved ? 'aprobada' : 'rechazada'}.
        
        Detalles:
        Proveedor: ${requestData.nombreProveedor}
        Precio Actual: $${requestData.precioActual}
        Nuevo Precio: $${requestData.nuevoPrecio}
        
        ${requestData.approvalComments ? `Comentarios: ${requestData.approvalComments}` : ''}
      `;
  
      console.log('Notification enviada:', { subject, body });
      return true;
    }
  };