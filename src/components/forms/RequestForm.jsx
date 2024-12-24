import React, { useState } from 'react';

const RequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreSolicitante: '',
    correoSolicitante: '',
    nombreProveedor: '',
    codigoProveedor: '',
    tipoEntrada: 'precios', // Valores posibles: precios o fep
    valorActual: '',
    valorNuevo: '',
    comentarios: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nombreSolicitante ||
      !formData.correoSolicitante ||
      !formData.nombreProveedor ||
      !formData.codigoProveedor ||
      !formData.valorActual ||
      !formData.valorNuevo
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const variacionCalculada = (
      ((formData.valorNuevo - formData.valorActual) / formData.valorActual) *
      100
    ).toFixed(2);

    onSubmit({
      ...formData,
      variacionCalculada: parseFloat(variacionCalculada),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Solicitante */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Nombre del Solicitante
        </label>
        <input
          type="text"
          name="nombreSolicitante"
          value={formData.nombreSolicitante}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Ingrese el nombre del solicitante"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Correo del Solicitante
        </label>
        <input
          type="email"
          name="correoSolicitante"
          value={formData.correoSolicitante}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Ingrese el correo del solicitante"
        />
      </div>

      {/* Proveedor */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Nombre del Proveedor
        </label>
        <input
          type="text"
          name="nombreProveedor"
          value={formData.nombreProveedor}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Ingrese el nombre del proveedor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Código del Proveedor
        </label>
        <input
          type="text"
          name="codigoProveedor"
          value={formData.codigoProveedor}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Ingrese el código del proveedor"
        />
      </div>

      {/* Tipo de Entrada */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Tipo de Cambio
        </label>
        <select
          name="tipoEntrada"
          value={formData.tipoEntrada}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="precios">Precio Neto</option>
          <option value="fep">FEP</option>
        </select>
      </div>

      {/* Valores */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Valor Actual ({formData.tipoEntrada === 'precios' ? 'COP' : '%'})
        </label>
        <input
          type="number"
          name="valorActual"
          value={formData.valorActual}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Ingrese el valor actual"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Valor Nuevo ({formData.tipoEntrada === 'precios' ? 'COP' : '%'})
        </label>
        <input
          type="number"
          name="valorNuevo"
          value={formData.valorNuevo}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Ingrese el valor nuevo"
        />
      </div>

      {/* Comentarios */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Comentarios
        </label>
        <textarea
          name="comentarios"
          value={formData.comentarios}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          rows="4"
          placeholder="Ingrese comentarios adicionales (opcional)"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
      >
        Generar Solicitud
      </button>
    </form>
  );
};

export default RequestForm;