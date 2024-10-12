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

import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
  status: "available" | "in_transit" | "delivered";
  freight_priority: "high" | "medium" | "low";
  created_at: string;
  updated_at: string;
}

const FreightContainer = styled.div`
  padding: 20px;
`;

const FreightList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Space between cards */
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 220px;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const LandscapeSection = styled.section`
  position: relative;
  width: 100%;
  height: 70%;
  overflow: hidden;
`;

const Sky = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(247, 225, 87, 1) 0%,
    rgba(233, 101, 148, 1) 100%
  );
`;

const Sun = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: white;
  position: absolute; /* Updated to use absolute positioning */
  bottom: 40%;
  left: 23%;
  filter: drop-shadow(0px 0px 10px white);
`;

const Ocean = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 28%;
  background: linear-gradient(
    0deg,
    rgba(241, 192, 125, 1) 0%,
    rgba(247, 218, 150, 1) 100%
  );
`;

const ContentSection = styled.section`
  padding: 10px;
  text-align: left;
  width: 100%;
`;

const Freight: React.FC = () => {
  const [freights, setFreights] = useState<FreightEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreights = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/list_freights/?origin=${"India"}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setFreights(data);
      } catch (error_) {
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFreights();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FreightContainer>
      <h1>Freight Entries</h1>
      <FreightList>
        {freights.map((freight) => (
          <Card key={freight.freight_id}>
            <LandscapeSection>
              <Sky />
              <Sun />
              <Ocean />
              {/* You can add more visual elements here */}
            </LandscapeSection>
            <ContentSection>
              <h2>{freight.cargo_type}</h2>
              <p>Weight: {freight.weight} kg</p>
              <p>Dimensions: {freight.dimensions}</p>
              <p>Origin: {freight.origin}</p>
              <p>Destination: {freight.destination}</p>
              <p>Pickup Date: {freight.pickup_date}</p>
              <p>Delivery Date: {freight.delivery_date}</p>
              <p>
                Estimated Delivery Time: {freight.estimated_delivery_time} hours
              </p>
              <p>Estimated Cost: ${freight.estimated_cost}</p>
              <p>Carbon Emissions: {freight.carbon_emissions} kg</p>
              <p>Status: {freight.status}</p>
              <p>Priority: {freight.freight_priority}</p>
              <p>Created At: {freight.created_at}</p>
              <p>Updated At: {freight.updated_at}</p>
            </ContentSection>
          </Card>
        ))}
      </FreightList>
    </FreightContainer>
  );
};

export default Freight;
