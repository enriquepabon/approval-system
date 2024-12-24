import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRequests } from "../../context/RequestContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

const ApprovalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRequest, updateRequest } = useRequests();
  const [comments, setComments] = useState("");
  const [password, setPassword] = useState(""); // Campo para la contraseña
  const [request, setRequest] = useState(null);

  const APPROVER_PASSWORD = "Fruta2025"; // Contraseña definida

  useEffect(() => {
    const fetchRequest = async () => {
      const data = await getRequest(id);
      if (!data) {
        toast.error("No se encontró la solicitud.");
        navigate("/");
        return;
      }
      setRequest(data);
    };

    fetchRequest();
  }, [id, getRequest, navigate]);

  const handleGeneratePDF = (updatedRequest) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Solicitud Aprobada", 20, 20);

    autoTable(doc, {
      startY: 30,
      body: [
        ["Nombre del Solicitante", updatedRequest.nombreSolicitante],
        ["Correo del Solicitante", updatedRequest.correo || "No disponible"],
        ["Nombre del Proveedor", updatedRequest.nombreProveedor],
        ["Código del Proveedor", updatedRequest.codigoProveedor],
        ["Tipo de Precio", updatedRequest.tipoPrecio || "No especificado"],
        ["Precio Actual", updatedRequest.precioActual || "No disponible"],
        ["Precio Nuevo", updatedRequest.nuevoPrecio || "No disponible"],
        ["Variación Calculada", `${updatedRequest.porcentajeCambio || "No calculada"}%`],
        ["Comentarios", updatedRequest.comentarios || "Sin comentarios"],
        ["Comentarios de Aprobación", comments || "Sin comentarios adicionales"],
      ],
    });

    doc.save(`Solicitud-${updatedRequest.id}-Aprobada.pdf`);
  };

  const handleApprove = async () => {
    if (password !== APPROVER_PASSWORD) {
      toast.error("Contraseña incorrecta. No se puede aprobar la solicitud.");
      return;
    }

    if (!comments.trim() && !window.confirm("¿Está seguro de aprobar sin comentarios?")) {
      return;
    }

    const updatedRequest = await updateRequest(id, {
      status: "approved",
      approvalComments: comments,
      approvedAt: new Date().toISOString(),
    });

    if (!updatedRequest) {
      toast.error("Error al aprobar la solicitud.");
      return;
    }

    toast.success("Solicitud aprobada exitosamente.");
    handleGeneratePDF(updatedRequest);
    navigate("/");
  };

  const handleReject = async () => {
    if (password !== APPROVER_PASSWORD) {
      toast.error("Contraseña incorrecta. No se puede rechazar la solicitud.");
      return;
    }

    if (!comments.trim()) {
      toast.error("Debe agregar comentarios para rechazar la solicitud.");
      return;
    }

    const updatedRequest = await updateRequest(id, {
      status: "rejected",
      approvalComments: comments,
      rejectedAt: new Date().toISOString(),
    });

    if (!updatedRequest) {
      toast.error("Error al rechazar la solicitud.");
      return;
    }

    toast.success("Solicitud rechazada exitosamente.");
    navigate("/");
  };

  if (!request) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-red-600">Solicitud no encontrada</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const DetailField = ({ label, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="mt-1 text-lg">{value}</div>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Detalles de la Solicitud</h1>
        <div className="grid grid-cols-2 gap-6">
          <DetailField label="Nombre del Solicitante" value={request.nombreSolicitante} />
          <DetailField label="Correo del Solicitante" value={request.correo || "No disponible"} />
          <DetailField label="Nombre del Proveedor" value={request.nombreProveedor} />
          <DetailField label="Código del Proveedor" value={request.codigoProveedor} />
          <DetailField label="Tipo de Precio" value={request.tipoPrecio || "No especificado"} />
          <DetailField label="Precio Actual" value={request.precioActual || "No disponible"} />
          <DetailField label="Precio Nuevo" value={request.nuevoPrecio || "No disponible"} />
          <DetailField
            label="Variación Calculada"
            value={`${request.porcentajeCambio || "No calculada"}%`}
          />
          <DetailField label="Comentarios" value={request.comentarios || "Sin comentarios"} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Decisión</h2>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
          placeholder="Ingrese sus comentarios de aprobación o rechazo..."
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Ingrese la contraseña del aprobador"
        />
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="w-1/2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Aprobar
          </button>
          <button
            onClick={handleReject}
            className="w-1/2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalView;