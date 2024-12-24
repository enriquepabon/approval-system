export const shareService = {
    async shareViaEmail(requestData) {
      const subject = encodeURIComponent(`Solicitud de Aprobación - ${requestData.nombreProveedor}`);
      const body = encodeURIComponent(`
        Por favor revise la siguiente solicitud de aprobación:
        ${window.location.origin}/approve/${requestData.id}
      `);
      
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },
  
    async copyToClipboard(requestId) {
      const url = `${window.location.origin}/approve/${requestId}`;
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        return false;
      }
    },
  
    async shareViaNavigator(requestData) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Solicitud de Aprobación - ${requestData.nombreProveedor}`,
            text: 'Por favor revise esta solicitud de aprobación',
            url: `${window.location.origin}/approve/${requestData.id}`
          });
          return true;
        } catch (error) {
          console.error('Error al compartir:', error);
          return false;
        }
      }
      return false;
    }
  };