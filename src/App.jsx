// src/App.jsx
import React,{useState,useEffect} from "react";
import { BrowserRouter as Router,Outlet, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Notifications from "./Pages/Notifications";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Admin from "./Pages/Admin";
import ProtectedRoute from "../src/Pages/ProtectedRoute";
import Premium from "./Pages/Premium";
import ResetPassword from "./Pages/ResetPassword";
// import ChatInterface from './Components/ChatInterface.jsx'; // Your chat component
// import Sidebar from './Components/Sidebar';
import { loadConfig, getConfig } from '../config';
// Main layout component for pages with navbar and footer
const MainLayout = () => (
  <>
    <Navbar />
    <div className="content-wrapper">
      <Outlet /> {/* This is where child routes will render */}
    </div>
    <Footer />
  </>
);

// Clean layout for auth pages
const AuthLayout = () => (
  <div className="auth-container">
    <Outlet />
  </div>
);

function App() {
  const [VITE_API_KEY, setVITE_API_KEY] = useState('');

  useEffect(() => {
    loadConfig().then(() => {
      setVITE_API_KEY(getConfig('VITE_API_KEY'));
    });
  }, []);

  
  return (
    <Router>
      
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/premium-subscription" element={<Premium />} />
      </Route>

      {/* Auth routes with minimal layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected routes with main layout */}
      <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div className="text-center my-20 text-4xl text-red-500">404 Not Found</div>} />
    </Routes>
  </Router>
  );
}

export default App;
