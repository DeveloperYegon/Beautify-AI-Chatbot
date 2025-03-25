import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("authToken");

    if (!token) return <Navigate to="/login" replace />; // Redirect if no token

    try {
        const { role } = jwtDecode(token);
        return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/login" replace />;
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
