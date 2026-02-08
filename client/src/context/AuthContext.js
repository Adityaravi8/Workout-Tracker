import React, { createContext, useState, useContext, useEffect } from "react";
import api, { setAccessToken, clearTokens, getAccessToken } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!getAccessToken();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.post("/api/auth/refresh");
      const { accessToken } = response.data;
      setAccessToken(accessToken);

      const verifyResponse = await api.get("/api/auth/verify");
      setUser(verifyResponse.data.user);
    } catch (err) {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    const { accessToken, user: userData } = response.data;

    setAccessToken(accessToken);
    setUser(userData);

    return response.data;
  };

  const signup = async (email, password) => {
    const response = await api.post("/api/auth/register", { email, password });
    const { accessToken, user: userData } = response.data;

    setAccessToken(accessToken);
    setUser(userData);

    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
