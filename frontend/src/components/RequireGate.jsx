import React from "react";
import { Navigate } from "react-router-dom";
import { useGate } from "@/context/GateContext";

const RequireGate = ({ children }) => {
  const { granted } = useGate();
  if (!granted) return <Navigate to="/" replace />;
  return children;
};

export default RequireGate;
