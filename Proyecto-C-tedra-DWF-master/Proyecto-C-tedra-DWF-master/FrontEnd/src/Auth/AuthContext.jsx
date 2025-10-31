import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

localStorage.setItem("role", data.role);
setRole(data.role);


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [role, setRole] = useState(localStorage.getItem("role") || null);

    const login = (token, role) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', role);
        setIsAuthenticated(true);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
    };

    const logout = () => {
        setToken(null);
            setRole(null);
            localStorage.removeItem("token");
            localStorage.removeItem("role");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);