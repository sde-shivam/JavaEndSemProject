import "./App.css";
import LoginPage from "./Page/Openpage/Login.jsx";
import SignupPage from "./Page/Openpage/SignupPage.jsx";
import Dashboard from "./Page/Userpage/Dashboard.jsx";
import SidebarLayout from "../src/Component/SlidebarLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../src/Component/Protectedroutes/ProtectedRoute";
import GuestRoute from "../src/Component/Protectedroutes/GuestRoute";
import HomePage from "./Page/Openpage/HomePage";
import CategoryPage from "./Page/Userpage/CategoryPage.jsx";
import AdminRoute from "./Component/Protectedroutes/AdminRoute";
import AdminDashboard from "../src/Page/Admin/AdminDashboard.jsx";
import ProductPage from "../src/Page/Userpage/ProductPage.jsx";
import CreateUserPage from "./Page/Admin/CreateUserPage";
import BillingPage from "./Page/Userpage/BillingPage.jsx";
import OrderHistoryPage from "./Page/Userpage/OrderHistoryPage.jsx";
import ProductSalesAnalytics from "./Page/Userpage/ProductSalesAnalytics.jsx";
import { ProductContext } from "./context/ProductContext.jsx";
import { useContext } from "react";
function App() {
  const { products } = useContext(ProductContext);
  return (
    <Routes>
      {/* PUBLIC PAGES */}
      <Route element={<GuestRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* USER PAGES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<BillingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route
            path="/report"
            element={
              <ProductSalesAnalytics
                productId={products.id} // NOT product.name
                productName={products.name}
              />
            }
          />
        </Route>
      </Route>

      {/* ADMIN PAGES */}
      <Route element={<AdminRoute />}>
        <Route element={<SidebarLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<CreateUserPage />} />
        </Route>
      </Route>

      {/* UNKNOWN ROUTES */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
