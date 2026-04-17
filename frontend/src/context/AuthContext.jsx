import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const TOKEN_KEY = "lball_admin_token";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setChecking(false);
      return;
    }
    axios
      .get(`${API}/admin/me`, { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => {
        setToken(t);
        setAdmin(res.data);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setChecking(false));
  }, []);

  const login = async (username, password) => {
    const { data } = await axios.post(`${API}/admin/login`, { username, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
    const me = await axios.get(`${API}/admin/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    setAdmin(me.data);
    return me.data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  };

  const authHeader = () => (token ? { Authorization: `Bearer ${token}` } : {});

  const value = useMemo(
    () => ({ token, admin, checking, login, logout, authHeader, API }),
    [token, admin, checking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
