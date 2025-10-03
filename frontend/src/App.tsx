import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles.css";
import DashboardPage from "./pages/Dashboard";
import OrdersPage from "./pages/Orders";
import { AddOrders } from "./pages/AddOrders";
import { OrdersOverview } from "./pages/OrdersOverview";
import AbandonedCheckoutPage from "./pages/AbandonedCheckout";
import ProductsNewPage from "./pages/ProductsNew";
import CustomersPage from "./pages/Customers";
import DiscountsNewPage from "./pages/Discounts";
import CatalogPage from "./pages/Catalog";
import SettingsNewPage from "./pages/SettingsNew";
import TeamManagementFinal from "./pages/TeamManagement";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/add" element={<AddOrders />} />
        <Route path="/orders/:id" element={<OrdersOverview />} />
        <Route path="/checkouts" element={<AbandonedCheckoutPage />} />
        <Route path="/products" element={<ProductsNewPage />} />
        <Route path="/products/category" element={<ProductsNewPage />} />
        <Route path="/products/inventory" element={<ProductsNewPage />} />
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
