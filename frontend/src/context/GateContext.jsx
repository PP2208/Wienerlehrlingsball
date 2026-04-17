import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "lball_gate_granted";
const SECRET = "LBALL2027";

const GateContext = createContext(null);

export const GateProvider = ({ children }) => {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setGranted(true);
  }, []);

  const tryUnlock = (rawValue) => {
    const value = (rawValue || "").trim();
    if (value === SECRET) {
      localStorage.setItem(STORAGE_KEY, "1");
      setGranted(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGranted(false);
  };

  const value = useMemo(() => ({ granted, tryUnlock, lock }), [granted]);
  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
};

export const useGate = () => {
  const ctx = useContext(GateContext);
  if (!ctx) throw new Error("useGate must be used within GateProvider");
  return ctx;
};
