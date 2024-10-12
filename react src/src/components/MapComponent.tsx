/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";

// Define the types for Country and Marker data
type Country = {
  name: string;
  lat: number;
  lng: number;
};

type MarkerInfo = {
  position: google.maps.LatLngLiteral;
  country: string;
};

// Define the styles for the map container
const containerStyle = {
  width: "100%",
  height: "100vh",
};

// List of countries to display as markers on the map
const countries: Country[] = [
  { name: "China", lat: 35.8617, lng: 104.1954 },
  { name: "India", lat: 20.5937, lng: 78.9629 },
  { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Thailand", lat: 15.87, lng: 100.9925 },
  { name: "Belgium", lat: 50.8503, lng: 4.3517 },
  { name: "Italy", lat: 41.8719, lng: 12.5674 },
  { name: "Poland", lat: 51.9194, lng: 19.1451 },
  { name: "Brazil", lat: -14.235, lng: -51.9253 },
  { name: "Canada", lat: 56.1304, lng: -106.3468 },
  { name: "USA", lat: 37.0902, lng: -95.7129 },
  { name: "Egypt", lat: 26.8206, lng: 30.8025 },
  { name: "Australia", lat: -25.2744, lng: 133.7751 },
];

function MapComponent() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined. Please check your .env file.");
  }

  // Load the Google Maps script with your API key
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const mapReference = useRef<google.maps.Map | null>(null);

  // State to manage the currently selected marker for showing InfoWindow
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  // Function to handle closing the InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);  
  };

  // Effect to place the markers on the map once it has loaded
  useEffect(() => {
    if (!isLoaded || !mapReference.current) return;

    countries.forEach((country) => {
      const marker = new google.maps.Marker({
        position: { lat: country.lat, lng: country.lng },
        map: mapReference.current,
        title: country.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom marker icon
      });

      // Add a click listener to open the InfoWindow when the marker is clicked
      marker.addListener("click", () => {
        setSelectedMarker({
          position: { lat: country.lat, lng: country.lng },
          country: country.name,
        });
      });
    });
  }, [isLoaded]);

  if (loadError) {
    return <div>Error loading map. Please check your API key.</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="relative" style={{ width: "100%", height: "100vh" }}>
      {/* Render the Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 20, lng: 0 }} // Initial center of the map
        zoom={2} // Initial zoom level
        onLoad={(map) => {
          mapReference.current = map; // Save the map reference for later use
        }}
      >
        {/* Conditionally render the InfoWindow if a marker is selected */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={handleInfoWindowClose}
          >
            <div>
              <h3>{selectedMarker.country}</h3>
              <ul>
                <li>
                  <a href="/predictive" className="text-blue-500 hover:underline">
                    Port Maintenance
                  </a>
                </li>
                <li>
                  <a href="/freight" className="text-blue-500 hover:underline">
                    Freight Data
                  </a> 
                </li>
              </ul>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapComponent;
