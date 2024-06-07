import React, { createContext, useState } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    setSignupSuccess(true);
  };
  const login = (loggedInUser) => {
    setUser(loggedInUser);
    setLoginSuccess(true);
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("posts");
   
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

