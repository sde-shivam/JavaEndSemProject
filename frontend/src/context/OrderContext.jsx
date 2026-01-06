import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/orders",
    withCredentials: true,
  });

  // ==========================================================
  // CREATE ORDER
  // ==========================================================
  const createOrder = async (orderData) => {
    try {
      const res = await api.post("", orderData);
      const order = res.data;

      // Add immediately to local state
      setOrders((prev) => [order, ...prev]);

      return order;
    } catch (err) {
      console.error("Order creation failed:", err);
      throw err;
    }
  };

  // ==========================================================
  // GET MY ORDERS (Order History)
  // ==========================================================
  const getMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get("");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load on startup
  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loadingOrders,
        createOrder,
        getMyOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
