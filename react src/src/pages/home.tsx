/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";

function Home() {
  // State to track if the user is hovering over the text
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative">
      {/* Map should fill the entire screen */}
      <div className="absolute inset-0 z-0">
        <MapComponent isHovering={isHovering} />
      </div>
      {/* Title overlay */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 bg-white bg-opacity-70 p-4 rounded shadow-md">
        <h1 className="text-4xl font-bold text-center">Team Native Hackers</h1>
      </div>
      <div
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-10 bg-white bg-opacity-70 p-4 rounded shadow-md"
        onMouseEnter={() => setIsHovering(true)} // Trigger hover state on mouse enter
        onMouseLeave={() => setIsHovering(false)} // Reset hover state on mouse leave
      >
        <h3 className="text-2xl font-bold text-center">
          Click on a marker to view more about a country's port
        </h3>
      </div>
    </div>
  );
}

export default Home;
