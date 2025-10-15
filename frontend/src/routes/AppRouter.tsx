import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

// Wrapper chroniący przed wejściem bez tokenu
const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
