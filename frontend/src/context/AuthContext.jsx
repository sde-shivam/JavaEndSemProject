import { createContext, useState, useEffect } from "react";
import axios from "axios";

// CRITICAL: Enables cookies in ALL axios requests
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(""); 
  const [loading, setLoading] = useState(true);

  // Axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  // =============================================================
  // LOGIN (ADMIN → /admin/dashboard | USER → /dashboard)
  // =============================================================
  const login = async (credentials) => {
    // credentials must be { email, password }
    const res = await api.post("/user/login", credentials);

    setUser(res.data);
    setAccessToken(res.data?.token || "");

    // ROLE-BASED REDIRECT
    if (res.data.role === "ADMIN") {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/dashboard";
    }

    return res.data;
  };

  // =============================================================
  // SIGNUP
  // =============================================================
  const signup = async (data) => {
    const res = await api.post("/user/signup", data);
    return res.data;
  };

  // =============================================================
  // LOGOUT
  // =============================================================
  const logout = async () => {
    try {
      await api.post("/user/logout"); // backend deletes cookie
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setUser(null);
    setAccessToken(""); 

    window.location.href = "/login";
  };

  // =============================================================
  // AUTO LOGIN ON REFRESH (reads cookie via /me)
  // =============================================================
  const fetchMe = async () => {
    try {
      const res = await api.get("/user/me"); 
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
