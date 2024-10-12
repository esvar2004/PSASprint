import React, { useState, useEffect } from "react";
import "../css/predictive.css"; // Ensure the CSS file is imported

interface PredictiveEntry {
  id: number;
  Equipment_ID: string;
  Operation_Hours: number;
  Load_Capacity: number;
  Port_Country: string;
  Failures_Last_6_Months: number;
  Avg_Repair_Time: number;
  Temperature: number;
  Corrosion_Level: "high" | "medium" | "low";
  Wind_Speed: number;
  Last_Maintenance_Date: string;
  Failure_Probability: number;
  Maintenance_Required: boolean;
}

const Predictive: React.FC = () => {
  const [predictives, setPredictive] = useState<PredictiveEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Track the current card index
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    const fetchPredictive = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/list_predictive/?port_country=${"India"}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPredictive(data);
      } catch (error_) {
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictive();
  }, []);

  const previousCard = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex > 0 ? previousIndex - 1 : predictives.length - 1
    );
  };

  const nextCard = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex < predictives.length - 1 ? previousIndex + 1 : 0
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentPredictive = predictives[currentIndex];

  return (
    <div className="predictive-container">
      <h1>Predictive Entries</h1>
      <div className="predictive-cards">
        <button
          type="button"
          onClick={nextCard}
          disabled={predictives.length <= 1}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/arrow-right.png`}
            alt="Previous"
            style={{
              width: `${screenDimensions.width * 0.02}px`,
              height: `${screenDimensions.width * 0.02}px`,
            }} // Adjust size as needed
          />
        </button>
        <div
          className="card"
          key={currentPredictive.id}
          style={{
            width: `${screenDimensions.width * 0.1}px`,
            height: `${screenDimensions.height * 0.4}px`,
            perspective: "1000px", // For 3D effect
          }}
        >
          <div className="content">
            <div className="back">
              <div className="back-content">
                <h2>Details</h2>
                <p>
                  Failures Last 6 Months:{" "}
                  {currentPredictive.Failures_Last_6_Months}
                </p>
                <p>
                  Average Repair Time: {currentPredictive.Avg_Repair_Time} hours
                </p>
                <p>Temperature: {currentPredictive.Temperature}°C</p>
                <p>Corrosion Level: {currentPredictive.Corrosion_Level}</p>
                <p>Wind Speed: {currentPredictive.Wind_Speed} km/h</p>
                <p>
                  Last Maintenance Date:{" "}
                  {currentPredictive.Last_Maintenance_Date}
                </p>
                <p>
                  Failure Probability: {currentPredictive.Failure_Probability}%
                </p>
                <p>
                  Maintenance Required:{" "}
                  {currentPredictive.Maintenance_Required ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#151515", // Use camelCase for CSS properties
                position: "absolute", // Use quotes for string values
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden", // Use camelCase for CSS properties
                borderRadius: "5px", // Use camelCase for CSS properties
                overflow: "hidden",
                backgroundImage: `url('/images/countries/india.jpg')`, // Adjust path as needed
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover", // Optional: Add this if you want to cover the entire area
              }}
            >
              <div className="front-content">
                <h2>{currentPredictive.Equipment_ID}</h2>
                <div className="description">
                  <p>Operation Hours: {currentPredictive.Operation_Hours}</p>
                  <p>Load Capacity: {currentPredictive.Load_Capacity}</p>
                  <p>Port Country: {currentPredictive.Port_Country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={previousCard}
          disabled={predictives.length <= 1}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/arrow-left.png`}
            alt="Previous"
            style={{
              width: `${screenDimensions.width * 0.02}px`,
              height: `${screenDimensions.width * 0.02}px`,
            }} // Adjust size as needed
          />
        </button>
      </div>
    </div>
  );
};

export default Predictive;
