import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../../context/RequestContext';
import { solicitantes } from '../../data/solicitantes';

const Home = () => {
  const { requests } = useRequests();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSolicitant, setSelectedSolicitant] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'fechaSolicitud',
    direction: 'desc'
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusText = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || badges.pending}`}>
        {statusText[status] || 'Pendiente'}
      </span>
    );
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = [...requests];

    if (selectedSolicitant) {
      filtered = filtered.filter(request => request.nombreSolicitante === selectedSolicitant);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(request =>
        request.nombreProveedor.toLowerCase().includes(searchLower) ||
        request.codigoProveedor.toLowerCase().includes(searchLower) ||
        request.nombreSolicitante.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [requests, search, statusFilter, sortConfig, selectedSolicitant]);

  const SortableHeader = ({ column, label }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {label}
        {sortConfig.key === column && (
          <span className="ml-2">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sistema de Aprobaciones Precios Fruta Proveedores Oleoflores</h1>
        <Link 
          to={`/new-request?solicitant=${selectedSolicitant}`} 
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            !selectedSolicitant ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          Nueva Solicitud
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por proveedor, código o solicitante..."
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solicitante
            </label>
            <select
              value={selectedSolicitant}
              onChange={(e) => setSelectedSolicitant(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Todos</option>
              {solicitantes.map((solicitant) => (
                <option key={solicitant.nombre} value={solicitant.nombre}>
                  {solicitant.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader column="fechaSolicitud" label="Fecha" />
                <SortableHeader column="nombreSolicitante" label="Solicitante" />
                <SortableHeader column="nombreProveedor" label="Proveedor" />
                <SortableHeader column="precioActual" label="Precio Actual" />
                <SortableHeader column="nuevoPrecio" label="Nuevo Precio" />
                <SortableHeader column="variacion" label="Variación" />
                <SortableHeader column="status" label="Estado" />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedRequests.length > 0 ? (
                filteredAndSortedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.fechaSolicitud).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.nombreSolicitante}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{request.nombreProveedor}</div>
                      <div className="text-xs text-gray-500">{request.codigoProveedor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${request.precioActual}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${request.nuevoPrecio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.porcentajeCambio}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                      <Link to={`/approve/${request.id}`}>
                        Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No se encontraron solicitudes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;