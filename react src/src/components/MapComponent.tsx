import React, { useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  OverlayView,
  MarkerF,
} from "@react-google-maps/api";

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
    // Include any necessary libraries
    libraries: [], // Add libraries if needed
  });

  const mapReference = useRef<google.maps.Map | null>(null);

  // State to manage the currently selected marker for showing InfoWindow
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  // Function to handle closing the InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

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
        {/* Render Markers */}
        {countries.map((country) => (
          <MarkerF
            key={country.name}
            position={{ lat: country.lat, lng: country.lng }}
            title={country.name}
            onClick={() => {
              setSelectedMarker({
                position: { lat: country.lat, lng: country.lng },
                country: country.name,
              });
            }}
          />
        ))}

        {/* Conditionally render the custom InfoWindow if a marker is selected */}
        {selectedMarker && (
          <OverlayView
            position={selectedMarker.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                position: "relative",
                transform: "translate(-50%, -100%)",
                cursor: "auto",
              }}
            >
              {/* Custom InfoWindow Content */}
              <div
                style={{
                  width: "300px",
                  backgroundColor: "#fff",
                  borderRadius: "15px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                  overflow: "hidden",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {/* Image Section */}
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    backgroundImage: `url('images/countries/${selectedMarker.country}.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {/* Content Section */}
                <div style={{ padding: "15px" }}>
                  <h2
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "1.5em",
                      color: "#333",
                    }}
                  >
                    {selectedMarker.country}
                  </h2>
                  <ul
                    style={{ listStyleType: "none", padding: "0", margin: "0" }}
                  >
                    <li style={{ marginBottom: "10px" }}>
                      <a
                        href="/predictive"
                        style={{
                          display: "block",
                          padding: "10px",
                          backgroundColor: "#3498db",
                          color: "#fff",
                          textDecoration: "none",
                          textAlign: "center",
                          borderRadius: "5px",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.backgroundColor = "#2980b9";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.backgroundColor = "#3498db";
                        }}
                      >
                        Port Maintenance
                      </a>
                    </li>
                    <li>
                      <a
                        href="/freight"
                        style={{
                          display: "block",
                          padding: "10px",
                          backgroundColor: "#2ecc71",
                          color: "#fff",
                          textDecoration: "none",
                          textAlign: "center",
                          borderRadius: "5px",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.backgroundColor = "#27ae60";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.backgroundColor = "#2ecc71";
                        }}
                      >
                        Freight Data
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleInfoWindowClose}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "1.5em",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  &times;
                </button>
              </div>
            </div>
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapComponent;
