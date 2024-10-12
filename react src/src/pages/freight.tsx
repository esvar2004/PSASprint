// // src/pages/AnotherPage.tsx
// import React, { useState, useEffect } from "react";

// interface FreightEntry {
//   freight_id: number;
//   user_id: number;
//   cargo_type: string;
//   weight: number;
//   dimensions: string;
//   origin: string;
//   destination: string;
//   pickup_date: string; // Use string for date representation (e.g., ISO format)
//   delivery_date: string; // Use string for date representation (e.g., ISO format)
//   estimated_delivery_time: number; // Assuming this is in hours or days
//   estimated_cost: number;
//   carbon_emissions: number;
//   status: "available" | "in_transit" | "delivered"; // Based on your choices
//   freight_priority: "high" | "medium" | "low"; // Based on your choices
//   created_at: string; // Use string for date representation (e.g., ISO format)
//   updated_at: string; // Use string for date representation (e.g., ISO format)
// }

// const Freight: React.FC = () => {
//   const [freights, setFreights] = useState<FreightEntry[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFreights = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/list_freights/"); // Adjust the endpoint accordingly
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         console.log(data);
//         setFreights(data);
//       } catch (error_) {
//         setError((error_ as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFreights();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>Freight Entries</h1>
//       <ul>
//         {freights.map((freight) => (
//           <li key={freight.freight_id}>
//             Cargo Type: {freight.cargo_type} - Weight: {freight.weight} kg -
//             Dimensions: {freight.dimensions} - Origin: {freight.origin} -
//             Destination: {freight.destination} - Pickup Date:{" "}
//             {freight.pickup_date} - Delivery Date: {freight.delivery_date} -
//             Estimated Delivery Time: {freight.estimated_delivery_time} hours -
//             Estimated Cost: ${freight.estimated_cost} - Carbon Emissions:{" "}
//             {freight.carbon_emissions} kg - Status: {freight.status} - Freight
//             Priority: {freight.freight_priority} - Created At:{" "}
//             {freight.created_at} - Updated At: {freight.updated_at}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Freight;

// import React, { useState, useEffect } from "react";
// import styled from "styled-components";

// interface FreightEntry {
//   freight_id: number;
//   user_id: number;
//   cargo_type: string;
//   weight: number;
//   dimensions: string;
//   origin: string;
//   destination: string;
//   pickup_date: string;
//   delivery_date: string;
//   estimated_delivery_time: number;
//   estimated_cost: number;
//   carbon_emissions: number;
//   status: "available" | "in_transit" | "delivered";
//   freight_priority: "high" | "medium" | "low";
//   created_at: string;
//   updated_at: string;
// }

// const FreightContainer = styled.div`
//   padding: 20px;
// `;

// const FreightList = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 20px; /* Space between cards */
// `;

// const Card = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   position: relative;
//   width: 220px;
//   height: 350px;
//   border-radius: 20px;
//   overflow: hidden;
//   box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.1);
//   background-color: white;
// `;

// const LandscapeSection = styled.section`
//   position: relative;
//   width: 100%;
//   height: 70%;
//   overflow: hidden;
// `;

// const Sky = styled.div`
//   width: 100%;
//   height: 100%;
//   background: linear-gradient(
//     0deg,
//     rgba(247, 225, 87, 1) 0%,
//     rgba(233, 101, 148, 1) 100%
//   );
// `;

// const Sun = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 45px;
//   height: 45px;
//   border-radius: 50%;
//   background-color: white;
//   position: absolute; /* Updated to use absolute positioning */
//   bottom: 40%;
//   left: 23%;
//   filter: drop-shadow(0px 0px 10px white);
// `;

// const Ocean = styled.div`
//   position: absolute;
//   bottom: 0;
//   width: 100%;
//   height: 28%;
//   background: linear-gradient(
//     0deg,
//     rgba(241, 192, 125, 1) 0%,
//     rgba(247, 218, 150, 1) 100%
//   );
// `;

// const ContentSection = styled.section`
//   padding: 10px;
//   text-align: left;
//   width: 100%;
// `;

// const Freight: React.FC = () => {
//   const [freights, setFreights] = useState<FreightEntry[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFreights = async () => {
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:8000/list_freights/?origin=${"India"}`
//         );
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         console.log(data);
//         setFreights(data);
//       } catch (error_) {
//         setError((error_ as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFreights();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <FreightContainer>
//       <h1>Freight Entries</h1>
//       <FreightList>
//         {freights.map((freight) => (
//           <Card key={freight.freight_id}>
//             <LandscapeSection>
//               <Sky />
//               <Sun />
//               <Ocean />
//               {/* You can add more visual elements here */}
//             </LandscapeSection>
//             <ContentSection>
//               <h2>{freight.cargo_type}</h2>
//               <p>Weight: {freight.weight} kg</p>
//               <p>Dimensions: {freight.dimensions}</p>
//               <p>Origin: {freight.origin}</p>
//               <p>Destination: {freight.destination}</p>
//               <p>Pickup Date: {freight.pickup_date}</p>
//               <p>Delivery Date: {freight.delivery_date}</p>
//               <p>
//                 Estimated Delivery Time: {freight.estimated_delivery_time} hours
//               </p>
//               <p>Estimated Cost: ${freight.estimated_cost}</p>
//               <p>Carbon Emissions: {freight.carbon_emissions} kg</p>
//               <p>Status: {freight.status}</p>
//               <p>Priority: {freight.freight_priority}</p>
//               <p>Created At: {freight.created_at}</p>
//               <p>Updated At: {freight.updated_at}</p>
//             </ContentSection>
//           </Card>
//         ))}
//       </FreightList>
//     </FreightContainer>
//   );
// };

// export default Freight;

import React, { useState, useEffect } from "react";
import "../css/predictive.css"; // Ensure the CSS file is imported

interface FreightEntry {
  id: number; // Assuming the same id structure as predictive
  Equipment_ID: string; // Adjusted based on your previous structure
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

const Freight: React.FC = () => {
  const [freights, setFreight] = useState<FreightEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        ); // Adjust the URL as needed
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
      {" "}
      {/* Use existing class for styling */}
      <h1>Freight Entries</h1>
      <div className="predictive-cards">
        {" "}
        {/* Use existing class for styling */}
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
            }} // Adjust size as needed
          />
        </button>
        <div
          className="card"
          key={currentFreight.id}
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
                  {currentFreight.Failures_Last_6_Months}
                </p>
                <p>
                  Average Repair Time: {currentFreight.Avg_Repair_Time} hours
                </p>
                <p>Temperature: {currentFreight.Temperature}°C</p>
                <p>Corrosion Level: {currentFreight.Corrosion_Level}</p>
                <p>Wind Speed: {currentFreight.Wind_Speed} km/h</p>
                <p>
                  Last Maintenance Date: {currentFreight.Last_Maintenance_Date}
                </p>
                <p>
                  Failure Probability: {currentFreight.Failure_Probability}%
                </p>
                <p>
                  Maintenance Required:{" "}
                  {currentFreight.Maintenance_Required ? "Yes" : "No"}
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
                backgroundImage: `url('/images/countries/${currentFreight.Port_Country}.jpg')`, // Adjust path as needed
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover", // Optional: Add this if you want to cover the entire area
              }}
            >
              <div className="front-content">
                <h2>{currentFreight.Equipment_ID}</h2>
                <div className="description">
                  <p>Operation Hours: {currentFreight.Operation_Hours}</p>
                  <p>Load Capacity: {currentFreight.Load_Capacity}</p>
                  <p>Port Country: {currentFreight.Port_Country}</p>
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
            }} // Adjust size as needed
          />
        </button>
      </div>
    </div>
  );
};

export default Freight;
