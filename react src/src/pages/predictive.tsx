import React, { useState, useEffect } from "react";
import "../css/predictive.css"; // Ensure the CSS file is imported

// ['USA', 'India', 'Belgium', 'China', 'Saudi Arabia', 'Thailand', 'Italy', 'Poland', 'Canada', 'Singapore', 'Egypt', 'Australia', 'Brazil']

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
  const [flipped, setFlipped] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Track the current card index
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [selectedCountry, setSelectedCountry] = useState("India");

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
    setFlipped(false);
  };

  const nextCard = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex < predictives.length - 1 ? previousIndex + 1 : 0
    );
    setFlipped(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentPredictive = predictives[currentIndex];

  return (
    <div className="predictive-container">
      <h1
        style={{
          fontSize: screenDimensions.width * 0.02,
          fontFamily: "Georgia",
        }}
      >
        Port Equipment at {selectedCountry}
      </h1>
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
            width: `${screenDimensions.width * 0.15}px`,
            height: `${screenDimensions.height * 0.6}px`,
            perspective: "1000px", // For 3D effect
          }}
          onClick={() => setFlipped(!flipped)}
        >
          <div className={`content ${flipped ? "flipped" : ""}`}>
            <div className="back">
              <div
                className="back-content"
                style={{ fontSize: screenDimensions.height * 0.15 * 0.11 }}
              >
                <h2 className="details-title">Port Details</h2>
                <hr className="divider" />
                <div className="detail-row">
                  <span>{currentPredictive.Failures_Last_6_Months}</span>
                  <strong>No. of Failures (Last 6 Months) </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {currentPredictive.Avg_Repair_Time}
                    <strong>hrs</strong>
                  </span>
                  <strong>Avg. Repair Time</strong>
                </div>
                <div className="detail-row">
                  <span>{currentPredictive.Temperature}</span>
                  <strong>Temperature </strong>
                </div>
                <div className="detail-row">
                  <span>{currentPredictive.Corrosion_Level}</span>
                  <strong>Corrosion Level </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {currentPredictive.Wind_Speed}
                    <strong>km/hr</strong>
                  </span>
                  <strong>Wind Speed </strong>
                </div>
                <div className="detail-row">
                  <span>{currentPredictive.Last_Maintenance_Date}</span>
                  <strong>Last Maintenance Date </strong>
                </div>
                <div className="detail-row">
                  <span>{currentPredictive.Failure_Probability}%</span>
                  <strong>Failure Probability </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {currentPredictive.Failure_Probability > 60 ? "Yes" : "No"}
                  </span>
                  <strong>?Maintenance Required </strong>
                </div>
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
                backgroundImage: `url('/images/countries/${selectedCountry}.jpg')`, // Adjust path as needed
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover", // Optional: Add this if you want to cover the entire area
              }}
            >
              <div className="front-content">
                <h2
                  style={{
                    fontSize: screenDimensions.width * 0.02,
                    fontFamily: "papyrus",
                  }}
                >
                  {currentPredictive.Equipment_ID}
                </h2>
                <div className="description">
                  <p style={{ fontFamily: "papyrus", fontSize: 20 }}>
                    <b>
                      Operational Hours: {currentPredictive.Operation_Hours}
                    </b>
                  </p>
                  <p style={{ fontFamily: "papyrus", fontSize: 20 }}>
                    <b>Load Capacity: {currentPredictive.Load_Capacity}</b>
                  </p>
                  <p style={{ fontFamily: "papyrus", fontSize: 20 }}>
                    <b>Port Country: {currentPredictive.Port_Country}</b>
                  </p>
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
