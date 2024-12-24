import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRequests } from "../../context/RequestContext";
import { solicitantes } from "../../data/solicitantes";
import toast from "react-hot-toast";

const NewRequest = () => {
  const { addRequest, selectedSolicitant } = useRequests();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const defaultSolicitant = selectedSolicitant || queryParams.get("solicitant") || "";

  const [formData, setFormData] = useState({
    nombreSolicitante: defaultSolicitant,
    extractora: "",
    correo: "",
    nombreProveedor: "",
    codigoProveedor: "",
    precioActual: "",
    nuevoPrecio: "",
    comentarios: "",
    tipoPrecio: "neto", // neto o FEP
  });

  useEffect(() => {
    if (defaultSolicitant) {
      const solicitante = solicitantes.find((s) => s.nombre === defaultSolicitant);
      if (solicitante) {
        setFormData({
          ...formData,
          nombreSolicitante: solicitante.nombre,
          extractora: solicitante.extractora,
          correo: solicitante.correo,
        });
      }
    }
  }, [defaultSolicitant]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombreSolicitante") {
      const solicitante = solicitantes.find((s) => s.nombre === value);
      if (solicitante) {
        setFormData({
          ...formData,
          nombreSolicitante: solicitante.nombre,
          extractora: solicitante.extractora,
          correo: solicitante.correo,
        });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (
      !formData.nombreProveedor ||
      !formData.codigoProveedor ||
      !formData.precioActual ||
      !formData.nuevoPrecio ||
      !formData.tipoPrecio
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const formDataProcessed = {
        ...formData,
        precioActual: parseFloat(formData.precioActual),
        nuevoPrecio: parseFloat(formData.nuevoPrecio),
      };

      const newRequest = await addRequest(formDataProcessed);
      toast.success("Solicitud creada exitosamente");
      navigate(`/share/${newRequest.id}`); // Redirige a la página de compartir
    } catch (error) {
      toast.error("Error al crear la solicitud");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Nueva Solicitud</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Información del solicitante */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Solicitante</label>
          <select
            name="nombreSolicitante"
            value={formData.nombreSolicitante}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecciona un solicitante</option>
            {solicitantes.map((solicitante) => (
              <option key={solicitante.nombre} value={solicitante.nombre}>
                {solicitante.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Planta Extractora</label>
          <input
            type="text"
            name="extractora"
            value={formData.extractora}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Información del agricultor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre Agricultor</label>
          <input
            type="text"
            name="nombreProveedor"
            value={formData.nombreProveedor}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Nombre del agricultor"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Código Agricultor</label>
          <input
            type="text"
            name="codigoProveedor"
            value={formData.codigoProveedor}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Código del agricultor"
          />
        </div>

        {/* Precios */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tipo de Precio</label>
          <select
            name="tipoPrecio"
            value={formData.tipoPrecio}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecciona un tipo</option>
            <option value="Neto">Neto</option>
            <option value="FEP">FEP</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Precio Actual</label>
            <div className="relative">
              <input
                type="number"
                name="precioActual"
                value={formData.precioActual}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Precio actual"
              />
              {formData.tipoPrecio === "FEP" && <span className="absolute right-4 top-3">%</span>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nuevo Precio</label>
            <div className="relative">
              <input
                type="number"
                name="nuevoPrecio"
                value={formData.nuevoPrecio}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Nuevo precio"
              />
              {formData.tipoPrecio === "FEP" && <span className="absolute right-4 top-3">%</span>}
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Comentarios</label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Agrega comentarios aquí..."
          ></textarea>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generar Solicitud
        </button>
      </form>
    </div>
  );
};

export default NewRequest;