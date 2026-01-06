import { createContext, useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const { user, accessToken } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================================================
  // AXIOS INSTANCE WITH AUTH
  // =============================================================
  const api = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {},
      }),
    [accessToken]
  );

  // =============================================================
  // FETCH ALL CATEGORIES (LOGGED-IN USER)
  // =============================================================
  const fetchCategories = async () => {
    if (!user) return; // don't fetch until logged in

    try {
      setLoading(true);
      const res = await api.get("/category");

      // Backend returns: [{ id, name, description, bgColor }]
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories when user logs in or refreshes
  useEffect(() => {
    if (user) fetchCategories();
  }, [user]);

  // =============================================================
  // CREATE CATEGORY
  // =============================================================
  const createCategory = async (categoryData) => {
    const res = await api.post("/category", categoryData);
    await fetchCategories();
    return res.data;
  };

  // =============================================================
  // UPDATE CATEGORY
  // =============================================================
  const updateCategory = async (id, categoryData) => {
    const res = await api.put(`/category/${id}`, categoryData);
    await fetchCategories();
    return res.data;
  };

  // =============================================================
  // DELETE CATEGORY
  // =============================================================
  const deleteCategory = async (id) => {
    await api.delete(`/category/${id}`);
    await fetchCategories();
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
