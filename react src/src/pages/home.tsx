/* eslint-disable prettier/prettier */
// src/pages/home.tsx
import React from "react";
import MapComponent from "../components/MapComponent";

function Home() {
  return (
    <div className="relative">
      {/* Map should fill the entire screen */}
      <div className="absolute inset-0 z-0">
        <MapComponent />
      </div>
      {/* Title overlay */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 bg-white bg-opacity-70 p-4 rounded shadow-md">
        <h1 className="text-4xl font-bold text-center">
          Interactive World Map
        </h1>
      </div>
    </div>
  );
}

export default Home;
