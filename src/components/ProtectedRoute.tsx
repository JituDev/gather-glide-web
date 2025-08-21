import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
    allowedRoles?: ("user" | "vendor" | "admin")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user } = useAuth();

    // ✅ Check login by token presence
    const token = localStorage.getItem("token");
    const loggedIn = !!token;

    // Case 1: Not logged in → go to login
    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Case 2: Logged in + role matches → render route
    if (allowedRoles && user && allowedRoles.includes(user.role)) {
        return <Outlet />;
    }

    // Case 3: Logged in but no role match → go home
    return <Navigate to="/" replace />;
};

export default ProtectedRoute;
