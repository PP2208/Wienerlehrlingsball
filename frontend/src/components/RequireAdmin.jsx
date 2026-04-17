import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RequireAdmin = ({ children }) => {
  const { token, checking } = useAuth();
  if (checking) {
    return (
      <div className="min-h-screen bg-jewel-base flex items-center justify-center">
        <p className="overline">Laden…</p>
      </div>
    );
  }
  if (!token) return <Navigate to="/admin" replace />;
  return children;
};

export default RequireAdmin;
