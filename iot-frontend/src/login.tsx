import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    console.log("Form submitted: ", formData);
    setError("");

    const body = "{\"username\":\"" + formData.username + "\",\"password\":\"" + formData.password + "\"}";
    fetch("http://89.58.12.151:6969/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => {
        console.log("response: " + response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur lors de la connexion.");
        }
      })
      .then((data) => {
        console.log("data: " + data);
        if (data.token) {
          login();
          localStorage.setItem("token", data.token);
          navigate("/home");
        } else {
          throw new Error("Erreur lors de l'enregistrement.");
        }
      })
      .catch((error) => {
        setError("Erreur lors de l'enregistrement.");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Connexion
        </h2>
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Pas encore inscrit ?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Créez un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
