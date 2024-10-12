// src/pages/AnotherPage.tsx
import React, { useState, useEffect } from "react";

interface PredictiveEntry {
  id: number; // Adjust according to how you're managing IDs
  Equipment_ID: string;
  Operation_Hours: number;
  Load_Capacity: number;
  Port_Country: string;
  Failures_Last_6_Months: number;
  Avg_Repair_Time: number; // Assuming this is in some time unit (e.g., hours)
  Temperature: number; // Assuming this is in degrees Celsius or Fahrenheit
  Corrosion_Level: "high" | "medium" | "low"; // Based on your choices
  Wind_Speed: number; // Assuming this is in some unit (e.g., km/h or mph)
  Last_Maintenance_Date: string; // Use string for date representation (e.g., ISO format)
  Failure_Probability: number; // Assuming this is a percentage (0-100)
  Maintenance_Required: boolean; // Indicates if maintenance is required
}

const Predictive: React.FC = () => {
  const [predictives, setPredictive] = useState<PredictiveEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictive = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/list_predictive/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setPredictive(data);
      } catch (error_) {
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictive();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Predictive Entries</h1>
      <ul>
        {predictives.map((predictive) => (
          <li key={predictive.id}>
            {predictive.Equipment_ID} - {predictive.Operation_Hours} hours -
            Capacity: {predictive.Load_Capacity} - Port Country:{" "}
            {predictive.Port_Country} - Failures Last 6 Months:{" "}
            {predictive.Failures_Last_6_Months} - Avg Repair Time:{" "}
            {predictive.Avg_Repair_Time} hours - Temperature:{" "}
            {predictive.Temperature}°C - Corrosion Level:{" "}
            {predictive.Corrosion_Level} - Wind Speed: {predictive.Wind_Speed}{" "}
            km/h - Last Maintenance Date: {predictive.Last_Maintenance_Date} -
            Failure Probability: {predictive.Failure_Probability}% - Maintenance
            Required: {predictive.Maintenance_Required ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Predictive;
