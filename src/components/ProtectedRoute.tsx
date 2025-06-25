// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: ("user" | "vendor" | "admin")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  console.log('ProtectedRoute check:', { 
    isAuthenticated: isAuthenticated(), 
    user, 
    allowedRoles 
  });

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || (user && allowedRoles.includes(user.role))) {
    console.log('Access granted');
    return <Outlet />;
  }

  console.log('Wrong role, redirecting to home');
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;