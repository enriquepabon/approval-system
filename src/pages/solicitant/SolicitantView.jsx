import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequests } from '../../context/RequestContext';
import toast from 'react-hot-toast';

const SolicitantView = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { getRequestsBySolicitant } = useRequests();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!email) {
          toast.error('El correo del solicitante no es válido.');
          navigate('/');
          return;
        }

        setLoading(true); // Activar estado de carga
        const data = await getRequestsBySolicitant(email);
        if (!data || data.length === 0) {
          toast.error('No hay solicitudes pendientes para este solicitante.');
        } else {
          setRequests(data);
        }
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        toast.error('Hubo un problema al cargar las solicitudes.');
      } finally {
        setLoading(false); // Desactivar estado de carga
      }
    };

    fetchRequests();
  }, [email, getRequestsBySolicitant, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold">Solicitudes de {email}</h1>
        <p>No hay solicitudes pendientes.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de {email}</h1>
      <ul className="space-y-4">
        {requests.map((request) => (
          <li key={request.id} className="bg-white shadow-md rounded-lg p-4">
            <p>
              <strong>Proveedor:</strong> {request.nombreProveedor || 'No especificado'}
            </p>
            <p>
              <strong>Valor Actual:</strong> {request.valorActual || 'No especificado'}
            </p>
            <p>
              <strong>Valor Nuevo:</strong> {request.valorNuevo || 'No especificado'}
            </p>
            <p>
              <strong>Comentarios:</strong> {request.comentarios || 'Sin comentarios'}
            </p>
            <p>
              <strong>Estado:</strong> {request.status || 'Desconocido'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SolicitantView;