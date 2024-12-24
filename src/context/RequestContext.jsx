import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const RequestContext = createContext();

export function RequestProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [selectedSolicitant, setSelectedSolicitant] = useState(null); // Estado para solicitante seleccionado

  // Cargar solicitudes iniciales desde localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem("requests");
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  // Agregar nueva solicitud
  const addRequest = async (data) => {
    const isFEP = data.tipoPrecio === "FEP";

    const newRequest = {
      ...data,
      precioActual: parseFloat(data.precioActual) || 0,
      nuevoPrecio: parseFloat(data.nuevoPrecio) || 0,
      tipoPrecio: data.tipoPrecio || "Neto",
      fechaSolicitud: Timestamp.now(),
      status: "pending",
      porcentajeCambio:
        data.precioActual && data.nuevoPrecio
          ? (
              ((data.nuevoPrecio - data.precioActual) / data.precioActual) *
              100
            ).toFixed(2)
          : null,
      shareHistory: [],
    };

    if (isFEP) {
      // Para FEP, asegurarse de mantener el formato de porcentaje
      newRequest.precioActual += "%";
      newRequest.nuevoPrecio += "%";
    }

    const docRef = await addDoc(collection(db, "requests"), newRequest);
    const finalRequest = { id: docRef.id, ...newRequest };
    setRequests((prev) => [...prev, finalRequest]);
    return finalRequest;
  };

  // Obtener solicitud por ID
  const getRequest = async (id) => {
    const savedRequest = requests.find((req) => req.id === id);
    if (savedRequest) {
      return savedRequest;
    }

    const docRef = doc(db, "requests", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const requestData = { id, ...docSnap.data() };
    setRequests((prev) => [...prev, requestData]);
    return requestData;
  };

  // Actualizar solicitud
  const updateRequest = async (id, updates) => {
    const currentRequest = requests.find((req) => req.id === id);

    if (!currentRequest) {
      return null;
    }

    const updatedRequest = {
      ...currentRequest,
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(doc(db, "requests", id), updates);
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? updatedRequest : req))
    );

    return updatedRequest;
  };

  // Registrar historial de compartidos
  const addShareHistory = async (requestId, method, recipient = "") => {
    const currentRequest = requests.find((req) => req.id === requestId);

    if (!currentRequest) {
      return null;
    }

    const shareInfo = {
      method,
      recipient,
      sharedAt: Timestamp.now(),
    };

    const updatedRequest = {
      ...currentRequest,
      shareHistory: [...currentRequest.shareHistory, shareInfo],
      lastShared: Timestamp.now(),
      status:
        currentRequest.status === "created" ? "shared" : currentRequest.status,
    };

    await updateDoc(doc(db, "requests", requestId), {
      shareHistory: updatedRequest.shareHistory,
      lastShared: updatedRequest.lastShared,
      status: updatedRequest.status,
    });

    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? updatedRequest : req))
    );

    return updatedRequest;
  };

  // Obtener solicitudes por estado
  const getRequestsByStatus = (status) => {
    return requests.filter((req) => req.status === status);
  };

  // Obtener solicitudes por solicitante
  const getRequestsBySolicitant = async (email) => {
    const filteredRequests = requests.filter(
      (req) => req.correoSolicitante === email && req.status === "pending"
    );

    if (filteredRequests.length > 0) {
      return filteredRequests;
    }

    const collectionRef = collection(db, "requests");
    const querySnapshot = await getDocs(
      query(
        collectionRef,
        where("correoSolicitante", "==", email),
        where("status", "==", "pending")
      )
    );

    const loadedRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRequests((prev) => [...prev, ...loadedRequests]);
    return loadedRequests;
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        addRequest,
        getRequest,
        updateRequest,
        addShareHistory,
        getRequestsByStatus,
        getRequestsBySolicitant,
        selectedSolicitant,
        setSelectedSolicitant,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequests debe usarse dentro de RequestProvider");
  }
  return context;
}