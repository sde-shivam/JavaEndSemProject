import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  // GET /products
  const getMyProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // GET /products/category/{id}
  const getProductsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/products/category/${categoryId}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load category products:", err);
      setError("Failed to load category products");
    } finally {
      setLoading(false);
    }
  };

  // POST /products
  const addProduct = async (productData) => {
    const res = await api.post("/products", productData);
    await getMyProducts();
    return res.data;
  };

  // PUT /products/{id}
  const updateProduct = async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    await getMyProducts();
    return res.data;
  };

  // DELETE /products/{id}
  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    await getMyProducts();
  };

  useEffect(() => {
    getMyProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
