import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./login";
import RegistrationPage from "./register";
import HomePage from "./home";
import { AuthProvider, useAuth } from "./AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/" />;
  }

  return children;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
            } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
