import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
         {/* Protect Admin Route */}
         <Route element={<ProtectedRoute allowedRoles={["admin"]} />}> 
          <Route path="/admin" element={<Admin />} />
        </Route>
         {/* Protect User Route */}
         <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/premium-subscription" element={<Premium/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/profile" element={<Profile />} />
        </Route>


      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
