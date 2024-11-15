import React, { useState, useEffect } from "react";

const HomePage: React.FC = () => {
  // État pour la couleur des LEDs
  const [ledColor, setLedColor] = useState("#ff0000");

  // États pour la température et la luminosité
  const [temperature, setTemperature] = useState<number | null>(null);
  const [luminosity, setLuminosity] = useState<number | null>(null);

  const [temperatureBasedColor, setTemperatureBasedColor] = useState(false); // Toggle de la couleur selon la température
  const [intensityBasedOnBrightness, setIntensityBasedOnBrightness] = useState(false); // Toggle de l'intensité selon la luminosité

  // État pour l'activation/désactivation des LEDs
  const [isLedOn, setIsLedOn] = useState(false);

  // Fonction pour changer la couleur des LEDs
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLedColor(e.target.value);
    console.log(`Couleur des LEDs mise à jour : ${e.target.value}`);

    // TODO: Envoyer la couleur au serveur
  };

  // Fonction pour mettre à jour la couleur des LEDs en fonction de la température
  const handleToggleTemperatureBasedColor = () => {
    setTemperatureBasedColor((prevState) => !prevState);
    console.log(`Couleur des LEDs basée sur la température ${temperatureBasedColor ? "activée" : "désactivée"}`);

    // TODO: Envoyer le signal ON/OFF au serveur
  };

  // Fonction pour mettre à jour l'intensité des LEDs en fonction de la luminosité
  const handleToggleIntensityBasedOnBrightness = () => {
    setIntensityBasedOnBrightness((prevState) => !prevState);
    console.log(`Intensité des LEDs basée sur la luminosité ${intensityBasedOnBrightness ? "activée" : "désactivée"}`);

    // TODO: Envoyer le signal ON/OFF au serveur
  };

  // Fonction pour basculer l'état ON/OFF des LEDs
  const toggleLedState = () => {
    setIsLedOn((prevState) => !prevState);
    console.log(`LEDs ${!isLedOn ? "activées" : "désactivées"}`);

    // TODO: Envoyer le signal ON/OFF au serveur
  };

  // Simuler la récupération de données (température/luminosité)
  useEffect(() => {
    const fetchData = () => {
      // TODO: Remplacer par une requête HTTP réelle pour récupérer les données
      setTemperature(22 + Math.random() * 3); // Exemple : température entre 22°C et 25°C
      setLuminosity(50 + Math.random() * 50); // Exemple : luminosité entre 50% et 100%
    };

    const interval = setInterval(fetchData, 2000); // Met à jour toutes les 2 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Contrôleur de LEDs
        </h1>

        {/* Sélecteur de couleur */}
        <div className="mb-6">
          <label
            htmlFor="ledColor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Choisir une couleur pour les LEDs :
          </label>
          <input
            type="color"
            id="ledColor"
            value={ledColor}
            onChange={handleColorChange}
            className="w-16 h-16 cursor-pointer"
          />
          <p className="mt-2 text-sm text-gray-600">
            Couleur actuelle : <span style={{ color: ledColor }}>{ledColor}</span>
          </p>
        </div>

        {/* Température et Luminosité */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-700">Température</h3>
            <p className="text-2xl font-bold text-gray-800">
              {temperature ? `${temperature.toFixed(1)} °C` : "Chargement..."}
            </p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-yellow-700">Luminosité</h3>
            <p className="text-2xl font-bold text-gray-800">
              {luminosity ? `${luminosity.toFixed(1)} %` : "Chargement..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Contrôle de la couleur de la lampe */}
          <div className="mb-4 flex items-center">
            <label className="inline-flex items-center cursor-pointer">Modifier la couleur en fonction de la température</label>
              <input
                type="checkbox"
                checked={temperatureBasedColor}
                onChange={() => handleToggleTemperatureBasedColor()}
                className="toggle"
              />
          </div>

          {/* Contrôle de l'intensité de la lampe */}
          <div className="mb-4 flex items-center">
            <label className="inline-flex items-center cursor-pointer">Modifier l'intensité en fonction de la luminosité</label>
              <input
                type="checkbox"
                checked={intensityBasedOnBrightness}
                onChange={() => handleToggleIntensityBasedOnBrightness()}
                className="toggle"
              />
          </div>
        </div>

        {/* Bouton d'activation/désactivation */}
        <button
          onClick={toggleLedState}
          className={`w-full py-2 px-4 rounded-md transition ${
            isLedOn
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isLedOn ? "Désactiver les LEDs" : "Activer les LEDs"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
