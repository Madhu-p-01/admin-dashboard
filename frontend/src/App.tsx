import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles.css";
import DashboardPage from "./pages/Dashboard";
import OrdersPage from "./pages/Orders";
import { AddOrders } from "./pages/AddOrders";
import { OrdersOverview } from "./pages/OrdersOverview";
import { OrderDetail } from "./pages/OrderDetail";
import AbandonedCheckoutPage from "./pages/AbandonedCheckout";
import ProductsNewPage from "./pages/ProductsNew";
import ProductsPage from "./pages/Products";
import AddProductPage from "./pages/AddProduct";
import CategoriesPage from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import AddCategory from "./pages/AddCategory";
import Inventory from "./pages/Inventory";
import NewInventory from "./pages/NewInventory";
import CustomersPage from "./pages/CustomersNew";
import DiscountsNewPage from "./pages/DiscountsNew";
import CatalogPage from "./pages/Catalog";
import SettingsNewPage from "./pages/SettingsNew";
import TeamManagementFinal from "./pages/TeamManagement";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/overview" element={<OrdersOverview />} />
        <Route path="/orders/add" element={<AddOrders />} />
        <Route path="/orders/detail/:id" element={<OrderDetail />} />
        <Route path="/checkouts" element={<AbandonedCheckoutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/add" element={<AddProductPage />} />
        <Route path="/products/category" element={<ProductsNewPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/add" element={<AddCategory />} />
        <Route path="/categories/:categoryId" element={<CategoryDetail />} />
        <Route path="/products/inventory" element={<Inventory />} />
        <Route path="/products/inventory/new" element={<NewInventory />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/discounts" element={<DiscountsNewPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/settings" element={<SettingsNewPage />} />
        <Route path="/team" element={<TeamManagementFinal />} />
        <Route path="/orders/*" element={<OrdersPage />} />
        <Route path="*" element={<div className="p-6"><h1>Page Not Found</h1><p>The page you're looking for doesn't exist.</p></div>} />
      </Routes>
    </div>
  );
}

export default App;
