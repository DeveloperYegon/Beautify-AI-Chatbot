//src/Pages/ProtectedRoute.jsx
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout, setCredentials } from "../redux/authSlice";

const ProtectedRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !isAuthenticated) {
        try {
          const decoded = jwtDecode(token);
          
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("authToken");
            dispatch(logout());
            return;
          }
  
          dispatch(setCredentials({
            user: {
              id: decoded.userId,
              role: decoded.role,
              email: decoded.email
            },
            token
          }));
        } catch (error) {
          localStorage.removeItem("authToken");
          dispatch(logout());
        }
      }
    };
    
    checkAuth();
  }, [dispatch, token, isAuthenticated]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    return null; // Show loading state while verifying token
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
