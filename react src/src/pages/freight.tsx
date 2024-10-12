import React, { useState, useEffect } from "react";
import "../css/freight.css"; // Ensure the CSS file is imported

interface FreightEntry {
  freight_id: number;
  user_id: number;
  cargo_type: string;
  weight: number;
  dimensions: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  estimated_delivery_time: number;
  estimated_cost: number;
  carbon_emissions: number;
  status: string;
  freight_priority: string;
  created_at: string;
  updated_at: string;
}

interface LogisticsEntry {
  provider_id: number;
  name: string;
  contact_info: string;
  eco_certification: string;
  sustainability_rating: number; // FloatField equivalent
  average_carbon_emissions: number; // FloatField equivalent
  route_origin: string;
  route_destination: string;
  created_at: string; // DateField equivalent
  updated_at: string; // DateField equivalent
}

const Freight: React.FC = () => {
  const [freights, setFreight] = useState<FreightEntry[]>([]);
  const [logistics, setLogistics] = useState<LogisticsEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLogistics, setLoadingLogistics] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorLogistics, setErrorLogistics] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Track the current card index
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const fetchFreight = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/list_freights/?origin=${"India"}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFreight(data);
      } catch (error_) {
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFreight();
  }, []);

  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/list_logistics/?origin=${"India"}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setLogistics(data);
      } catch (error_) {
        setErrorLogistics((error_ as Error).message);
      } finally {
        setLoadingLogistics(false);
      }
    };
    fetchLogistics();
  }, []);

  const previousCard = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex > 0 ? previousIndex - 1 : freights.length - 1
    );
  };

  const nextCard = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex < freights.length - 1 ? previousIndex + 1 : 0
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentFreight = freights[currentIndex];

  return (
    <div className="predictive-container">
      <h1>Freight Entries</h1>
      <div className="predictive-cards">
        <button
          type="button"
          onClick={nextCard}
          disabled={freights.length <= 1}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/arrow-right.png`}
            alt="Next"
            style={{
              width: `${screenDimensions.width * 0.02}px`,
              height: `${screenDimensions.width * 0.02}px`,
            }}
          />
        </button>
        <div
          className="card"
          key={currentFreight.freight_id}
          style={{
            width: `${screenDimensions.width * 0.3}px`,
            height: `${screenDimensions.height * 0.5}px`,
            perspective: "1000px", // For 3D effect
          }}
        >
          <div className="content">
            <div className="back">
              <div className="back-content">
                <h2 className="details-title">Freight Details</h2>
                <hr className="divider" />
                <div className="detail-row">
                  <span>{currentFreight.cargo_type}</span>
                  <strong>Cargo Type </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {currentFreight.weight}
                    <strong>kg</strong>
                  </span>
                  <strong>Weight </strong>
                </div>
                <div className="detail-row">
                  <span>{currentFreight.dimensions}</span>
                  <strong>Dimensions </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {new Date(currentFreight.pickup_date).toLocaleDateString()}
                  </span>
                  <strong>Pickup Date </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {new Date(
                      currentFreight.delivery_date
                    ).toLocaleDateString()}
                  </span>
                  <strong>Delivery Date </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {currentFreight.estimated_delivery_time}
                    <strong>hours</strong>
                  </span>
                  <strong>Estimated Delivery Time </strong>
                </div>
                <div className="detail-row">
                  <span>${currentFreight.estimated_cost.toFixed(2)}</span>
                  <strong>Estimated Cost </strong>
                </div>
                <div className="detail-row">
                  <span>
                    {currentFreight.carbon_emissions}
                    <strong>kg</strong>
                  </span>
                  <strong>Carbon Emissions </strong>
                </div>

                {/* Conditionally render the button if status is "available" */}
                {currentFreight.status.toLowerCase() === "available" && (
                  <button
                    type="button"
                    onClick={() => {
                      // Add the logic to check the best providers
                      console.log("Checking best providers...");
                    }}
                    style={{
                      marginTop: "20px",
                      padding: "10px 20px",
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Check Best Providers
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#151515",
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                borderRadius: "5px",
                overflow: "hidden",
                backgroundImage: `url('/images/countries/${currentFreight.destination}.jpg')`, // Adjust path as needed
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="front-content">
                <h2>{currentFreight.freight_id}</h2>
                <div className="description">
                  <p>
                    <span style={{ color: "red" }}>
                      {currentFreight.origin}
                    </span>{" "}
                    <span style={{ color: "white" }}>to</span>{" "}
                    <span style={{ color: "red" }}>
                      {currentFreight.destination}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span style={{ color: "red" }}>
                      {currentFreight.status}
                    </span>
                  </p>
                  <p>
                    Priority:{" "}
                    <span style={{ color: "red" }}>
                      {currentFreight.freight_priority}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={previousCard}
          disabled={freights.length <= 1}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/arrow-left.png`}
            alt="Previous"
            style={{
              width: `${screenDimensions.width * 0.02}px`,
              height: `${screenDimensions.width * 0.02}px`,
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default Freight;
