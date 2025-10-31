import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, userRole, logout } = useAuth();

    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (allowedRoles && allowedRoles.indexOf(userRole) === -1) {
        logout();
        return <Navigate to="/" replace />;
    }
    return children;
}