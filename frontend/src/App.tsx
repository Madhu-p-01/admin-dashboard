import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles.css";
import DashboardPage from "./pages/Dashboard";
import OrdersPage from "./pages/Orders";
import { AddOrders } from "./pages/AddOrders";
import { OrdersOverview } from "./pages/OrdersOverview";
import AbandonedCheckoutPage from "./pages/AbandonedCheckout";
import ProductsNewPage from "./pages/ProductsNew";

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
        <Route path="/orders/*" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}

export default App;
