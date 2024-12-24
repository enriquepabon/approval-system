import React, { useState } from 'react';
import { shareService } from '../services/shareService';

const ShareDialog = ({ requestData, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await shareService.copyToClipboard(requestData.id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const success = await shareService.shareViaNavigator(requestData);
    if (!success) {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Compartir Solicitud</h3>
        
        <div className="space-y-4">
          <button
            onClick={() => shareService.shareViaEmail(requestData)}
            className="w-full flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50"
          >
            Compartir por correo
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50"
          >
            {copied ? 'Link Copiado!' : 'Copiar Link'}
          </button>

          {navigator.share && (
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50"
            >
              Compartir
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full p-2 border rounded-md hover:bg-gray-50 mt-4"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;