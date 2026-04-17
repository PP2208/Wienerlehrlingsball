import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { GateProvider, useGate } from "@/context/GateContext";
import { AuthProvider } from "@/context/AuthContext";
import ComingSoon from "@/pages/ComingSoon";
import Home from "@/pages/Home";
import Infos from "@/pages/Infos";
import Tickets from "@/pages/Tickets";
import Kontakt from "@/pages/Kontakt";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import SiteLayout from "@/components/SiteLayout";
import RequireAdmin from "@/components/RequireAdmin";

const GateRoot = () => {
  const { granted } = useGate();
  if (!granted) return <ComingSoon />;
  return <Navigate to="/home" replace />;
};

function App() {
  return (
    <div className="App">
      <GateProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<GateRoot />} />

              <Route element={<SiteLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/infos" element={<Infos />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/kontakt" element={<Kontakt />} />
              </Route>

              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              style: {
                background: "#0B1120",
                border: "1px solid rgba(209,169,84,0.3)",
                color: "#F8FAFC",
                borderRadius: "2px",
                fontFamily: "Manrope, sans-serif",
              },
            }}
          />
        </AuthProvider>
      </GateProvider>
    </div>
  );
}

export default App;
