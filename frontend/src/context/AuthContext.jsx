import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Real login: expects the backend user object
  const login = (userData) => {
    if (userData && typeof userData === "object") {
      setUser(userData);
      console.log("User stored in context:", userData);
    } else {
      console.error("Invalid userData passed to login:", userData);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
