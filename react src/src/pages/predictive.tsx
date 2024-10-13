import React, { useState, useEffect } from "react";
import "../css/predictive.css";

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const svgBackground = `
    <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80">
      <!-- ... (SVG content remains unchanged) ... -->
    </svg>
  `;

  useEffect(() => {
    const fetchData = async () => {
      const queryParameters = new URLSearchParams(window.location.search);
      const country = queryParameters.get("port_country");

      if (country) {
        setSelectedCountry(country);

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/list_predictive/?port_country=${country}`
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
      } else {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const previousCard = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(false);
      setCurrentIndex((previousIndex) =>
        previousIndex > 0 ? previousIndex - 1 : predictives.length - 1
      );
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const nextCard = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(false);
      setCurrentIndex((previousIndex) =>
        previousIndex < predictives.length - 1 ? previousIndex + 1 : 0
      );
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const getCardIndex = (offset: number) => {
    const newIndex = currentIndex + offset;
    if (newIndex < 0) return predictives.length - 1;
    if (newIndex >= predictives.length) return 0;
    return newIndex;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="predictive-container">
      <div
        className="background-animation"
        dangerouslySetInnerHTML={{ __html: svgBackground }}
      />
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
          disabled={predictives.length <= 1 || isAnimating}
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
        <div className="card-container">
          {[-1, 0, 1].map((offset) => {
            const cardIndex = getCardIndex(offset);
            const card = predictives[cardIndex];
            return (
              <div
                key={card.id}
                className={`card ${
                  offset === -1 ? "prev" : offset === 1 ? "next" : "current"
                } ${isAnimating ? "animating" : ""} ${
                  offset === 0 && isFlipped ? "flipped" : ""
                }`}
                style={{
                  width: `${screenDimensions.width * 0.3}px`,
                  height: `${screenDimensions.height * 0.6}px`,
                }}
                onClick={offset === 0 ? handleCardClick : undefined}
              >
                <div className="content">
                  <div className="front">
                    <div
                      style={{
                        backgroundImage: `url('/images/countries/${selectedCountry}.jpg')`,
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <div className="front-content">
                        <h2
                          style={{
                            fontSize: screenDimensions.width * 0.02,
                            fontFamily: "papyrus",
                          }}
                        >
                          {card.Equipment_ID}
                        </h2>
                        <div className="description">
                          <p style={{ fontFamily: "papyrus", fontSize: 20 }}>
                            <b>Operational Hours: {card.Operation_Hours}</b>
                          </p>
                          <p style={{ fontFamily: "papyrus", fontSize: 20 }}>
                            <b>Load Capacity: {card.Load_Capacity}</b>
                          </p>
                          <p style={{ fontFamily: "papyrus", fontSize: 20 }}>
                            <b>Port Country: {card.Port_Country}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="back">
                    <div
                      className="back-content"
                      style={{
                        fontSize: screenDimensions.height * 0.15 * 0.11,
                      }}
                    >
                      <h2 className="details-title">Port Details</h2>
                      <hr className="divider" />
                      <div className="detail-row">
                        <span>{card.Failures_Last_6_Months}</span>
                        <strong>No. of Failures (Last 6 Months) </strong>
                      </div>
                      <div className="detail-row">
                        <span>
                          {card.Avg_Repair_Time.toFixed(2)}
                          <strong>hrs</strong>
                        </span>
                        <strong>Avg. Repair Time</strong>
                      </div>
                      <div className="detail-row">
                        <span>
                          {card.Temperature.toFixed(2)}
                          <strong>C</strong>
                        </span>
                        <strong>Temperature </strong>
                      </div>
                      <div className="detail-row">
                        <span>{card.Corrosion_Level}</span>
                        <strong>Corrosion Level </strong>
                      </div>
                      <div className="detail-row">
                        <span>
                          {card.Wind_Speed.toFixed(2)}
                          <strong>km/hr</strong>
                        </span>
                        <strong>Wind Speed </strong>
                      </div>
                      <div className="detail-row">
                        <span>{card.Last_Maintenance_Date}</span>
                        <strong>Last Maintenance Date </strong>
                      </div>
                      <div className="detail-row">
                        <span>{card.Failure_Probability.toFixed(2)}%</span>
                        <strong>Failure Probability </strong>
                      </div>
                      <div className="detail-row">
                        <span>
                          {card.Failure_Probability > 60 ? "Yes" : "No"}
                        </span>
                        <strong>Maintenance Required </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={previousCard}
          disabled={predictives.length <= 1 || isAnimating}
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

export default Predictive;
