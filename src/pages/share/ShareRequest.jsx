import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequests } from "../../context/RequestContext";
import toast from "react-hot-toast";
import { Share2, Mail, Link, MessageCircle, Clock } from "lucide-react";

const ShareRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRequest, addShareHistory } = useRequests();
  const [isCopied, setIsCopied] = useState(false);
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      const data = await getRequest(id);
      if (!data) {
        toast.error("No se encontró la solicitud.");
        navigate("/");
        return;
      }

      // Calcular variación porcentual si los valores están disponibles
      const variacionCalculada =
        data.precioActual && data.nuevoPrecio
          ? (((data.nuevoPrecio - data.precioActual) / data.precioActual) * 100).toFixed(2)
          : "N/A";

      setRequestData({ ...data, variacionCalculada });
    };

    fetchRequest();
  }, [id, getRequest, navigate]);

  const shareUrl = `${window.location.origin}/approve/${id}`;

  const handleEmailShare = () => {
    const subject = encodeURIComponent(
      `Solicitud de Aprobación - ${requestData.nombreProveedor}`
    );
    const body = encodeURIComponent(`
      Por favor revisa esta solicitud de cambio de precio.

      Detalles:
      - Proveedor: ${requestData.nombreProveedor}
      - Valor Actual: ${requestData.precioActual || "N/A"}
      - Valor Nuevo: ${requestData.nuevoPrecio || "N/A"}
      - Variación: ${requestData.variacionCalculada}%

      Link para aprobar: ${shareUrl}
    `);

    addShareHistory(id, "email");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success("Correo preparado");
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`
      Solicitud de Aprobación - ${requestData.nombreProveedor}
      Por favor revisa esta solicitud de cambio.

      Link para aprobar: ${shareUrl}
    `);

    addShareHistory(id, "whatsapp");
    window.open(`https://wa.me/?text=${message}`, "_blank");
    toast.success("WhatsApp preparado");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      addShareHistory(id, "link");
      setIsCopied(true);
      toast.success("Link copiado al portapapeles");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar el link");
    }
  };

  if (!requestData) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-red-600">Solicitud no encontrada</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-center mb-6">
            <Share2 size={40} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Compartir Solicitud</h1>
          <p className="text-center text-gray-600 mb-6">
            Selecciona cómo quieres compartir esta solicitud para su aprobación
          </p>

          {/* Resumen de la solicitud */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Resumen de la solicitud:</h3>
            <p>Proveedor: {requestData.nombreProveedor || "N/A"}</p>
            <p>Tipo: Cambio de Precio</p>
            <p>
              Cambio: {requestData.precioActual || "N/A"} → {requestData.nuevoPrecio || "N/A"} (
              {requestData.variacionCalculada || "N/A"}%)
            </p>
          </div>

          {/* Historial de compartidos */}
          {requestData.shareHistory && requestData.shareHistory.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock size={16} />
                Historial de compartidos
              </h3>
              <div className="space-y-2">
                {requestData.shareHistory.map((share, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <span className="text-gray-500">
                      {new Date(share.sharedAt).toLocaleString()}
                    </span>
                    <span className="text-blue-600">
                      {share.method === "email"
                        ? "Por correo"
                        : share.method === "whatsapp"
                        ? "Por WhatsApp"
                        : "Link copiado"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opciones de compartir */}
          <div className="space-y-4">
            <button
              onClick={handleEmailShare}
              className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Mail size={20} />
              Compartir por Correo
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MessageCircle size={20} />
              Compartir por WhatsApp
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Link size={20} />
              {isCopied ? "Link Copiado!" : "Copiar Link"}
            </button>
          </div>

          {/* Link para el solicitante */}
          <div className="bg-gray-100 p-4 rounded-md mt-6">
            <p className="text-sm text-gray-600">
              <strong>Link para el solicitante:</strong>{" "}
              {requestData.correoSolicitante ? (
                <a
                  href={`/solicitante/${requestData.correoSolicitante}`}
                  className="text-blue-500 underline"
                >
                  Ver solicitudes de {requestData.nombreSolicitante || "el solicitante"}
                </a>
              ) : (
                "Correo no disponible"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareRequest;