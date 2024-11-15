import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // États pour les données en temps réel
  const [temperature, setTemperature] = useState<number | null>(null);
  const [luminosity, setLuminosity] = useState<number | null>(null);

  // Données historiques
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [luminosityData, setLuminosityData] = useState<number[]>([]);
  const [timeStamps, setTimeStamps] = useState<string[]>([]);

  // Statistiques
  const [temperatureStats, setTemperatureStats] = useState<{
    min: number | null;
    max: number | null;
    avg: number | null;
  }>({ min: null, max: null, avg: null });

  const [luminosityStats, setLuminosityStats] = useState<{
    min: number | null;
    max: number | null;
    avg: number | null;
  }>({ min: null, max: null, avg: null });

  // Plage temporelle affichée
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 19]);

  // Simulation des données en temps réel
  useEffect(() => {
    const fetchData = () => {
      const newTemperature = 22 + Math.random() * 3; // Température entre 22 et 25°C
      const newLuminosity = 50 + Math.random() * 50; // Luminosité entre 50% et 100%
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      // Met à jour les états
      setTemperature(newTemperature);
      setLuminosity(newLuminosity);
      setTemperatureData((prev) => [...prev, newTemperature].slice(-20));
      setLuminosityData((prev) => [...prev, newLuminosity].slice(-20));
      setTimeStamps((prev) => [...prev, timestamp].slice(-20));
    };

    const interval = setInterval(fetchData, 2000); // Mise à jour toutes les 2 secondes
    return () => clearInterval(interval);
  }, []);

  // Mise à jour des statistiques
  useEffect(() => {
    if (temperatureData.length > 0) {
      setTemperatureStats({
        min: Math.min(...temperatureData),
        max: Math.max(...temperatureData),
        avg:
          temperatureData.reduce((sum, val) => sum + val, 0) /
          temperatureData.length,
      });
    }

    if (luminosityData.length > 0) {
      setLuminosityStats({
        min: Math.min(...luminosityData),
        max: Math.max(...luminosityData),
        avg:
          luminosityData.reduce((sum, val) => sum + val, 0) /
          luminosityData.length,
      });
    }
  }, [temperatureData, luminosityData]);

  // Gestion du changement de plage temporelle
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setTimeRange((prev) => {
      const newRange = [...prev] as [number, number];
      newRange[index] = Number(e.target.value);
      return newRange;
    });
  };

  // Filtrer les données pour le graphe
  const filteredTemperatureData = temperatureData.slice(timeRange[0], timeRange[1] + 1);
  const filteredLuminosityData = luminosityData.slice(timeRange[0], timeRange[1] + 1);
  const filteredTimeStamps = timeStamps.slice(timeRange[0], timeRange[1] + 1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard : Suivi Température & Luminosité
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-700">Température</h3>
            <p className="text-lg text-gray-700">
              Actuelle : {temperature ? `${temperature.toFixed(1)} °C` : "Chargement..."}
            </p>
            <p className="text-sm text-gray-600">
              Min : {temperatureStats.min !== null ? temperatureStats.min.toFixed(1) : "N/A"} °C | 
              Max : {temperatureStats.max !== null ? temperatureStats.max.toFixed(1) : "N/A"} °C | 
              Moyenne : {temperatureStats.avg !== null ? temperatureStats.avg.toFixed(1) : "N/A"} °C
            </p>
          </div>

          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-yellow-700">Luminosité</h3>
            <p className="text-lg text-gray-700">
              Actuelle : {luminosity ? `${luminosity.toFixed(1)} %` : "Chargement..."}
            </p>
            <p className="text-sm text-gray-600">
              Min : {luminosityStats.min !== null ? luminosityStats.min.toFixed(1) : "N/A"} % | 
              Max : {luminosityStats.max !== null ? luminosityStats.max.toFixed(1) : "N/A"} % | 
              Moyenne : {luminosityStats.avg !== null ? luminosityStats.avg.toFixed(1) : "N/A"} %
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Évolution Température & Luminosité
          </h2>
          <Line
            data={{
              labels: filteredTimeStamps,
              datasets: [
                {
                  label: "Température (°C)",
                  data: filteredTemperatureData,
                  borderColor: "rgb(75, 192, 192)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  fill: true,
                },
                {
                  label: "Luminosité (%)",
                  data: filteredLuminosityData,
                  borderColor: "rgb(255, 206, 86)",
                  backgroundColor: "rgba(255, 206, 86, 0.2)",
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Données en temps réel",
                },
              },
            }}
          />
          <div className="my-4">
            <h3 className="text-sm font-semibold text-gray-600">Ajuster la plage temporelle :</h3>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="0"
                max={timeStamps.length - 1}
                value={timeRange[0]}
                onChange={(e) => handleTimeRangeChange(e, 0)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max={timeStamps.length - 1}
                value={timeRange[1]}
                onChange={(e) => handleTimeRangeChange(e, 1)}
                className="w-full"
              />
            </div>
            <p className="text-sm text-gray-600">
              Affichage de <span className="font-semibold">{filteredTimeStamps[0] || "N/A"}</span> à{" "}
              <span className="font-semibold">{filteredTimeStamps.at(-1) || "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
