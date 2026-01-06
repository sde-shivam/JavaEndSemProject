import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <OrderProvider>
          <App />
          </OrderProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
