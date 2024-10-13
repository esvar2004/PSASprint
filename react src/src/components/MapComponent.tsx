/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
// src/components/MapComponent.tsx

import React, { useRef, useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  OverlayView,
  MarkerF,
  Polyline,
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
  });

  // Generate polylines between each pair of markers (complete graph)
  const polylines: Array<google.maps.LatLngLiteral[]> = [];
  for (let index = 0; index < countries.length; index++) {
    for (let index_ = index + 1; index_ < countries.length; index_++) {
      polylines.push([
        { lat: countries[index].lat, lng: countries[index].lng },
        { lat: countries[index_].lat, lng: countries[index_].lng },
      ]);
    }
  }

  const mapReference = useRef<google.maps.Map | null>(null);

  // State to manage the currently selected marker for showing InfoWindow
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);

  // State to manage which marker is animated
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    console.log("Map loaded:", mapLoaded);
    console.log("Number of polylines:", polylines.length);
  }, [mapLoaded, polylines]);

  // Function to handle closing the InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
    setActiveMarker(null);
  };

  if (loadError) {
    return <div>Error loading map. Please check your API key.</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  // Define the map options to restrict vertical panning and disable certain controls
  const mapOptions: google.maps.MapOptions = {
    restriction: {
      latLngBounds: {
        north: 85, // Maximum latitude
        south: -85, // Minimum latitude
        east: 180,
        west: -180,
      },
      strictBounds: true,
    },
    streetViewControl: false,
    mapTypeControl: false,
  };

  console.log("Polylines:", polylines);

  // Define an array of colors to use for polylines
  const colors = ["#ff0000"];

  return (
    <div className="relative" style={{ width: "100%", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 20, lng: 5 }}
        zoom={3}
        options={mapOptions}
        onLoad={(map) => {
          mapReference.current = map;
          setMapLoaded(true);
        }}
      >
        {/* Render Polylines */}
        {polylines.map((path, index) => (
          <Polyline
            key={index}
            path={path}
            options={{
              geodesic: true,
              strokeColor: "#ff0000",
              strokeOpacity: 1,
              strokeWeight: 3,
            }}
          />
        ))}

        {/* Render Markers */}
        {countries.map((country) => (
          <MarkerF
            key={country.name}
            position={{ lat: country.lat, lng: country.lng }}
            title={country.name}
            animation={
              activeMarker === country.name
                ? google.maps.Animation.BOUNCE
                : undefined
            }
            onClick={() => {
              setSelectedMarker({
                position: { lat: country.lat, lng: country.lng },
                country: country.name,
              });
              setActiveMarker(country.name);
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
                transform: "translate(-50%, -120%)", // Adjusted to bring it above the marker
                cursor: "auto",
                zIndex: 20, // Ensure it's above other elements
                animation: "fadeIn 0.3s", // Add fade-in animation
              }}
            >
              {/* Custom InfoWindow Content */}
              <div
                style={{
                  width: "320px",
                  backgroundColor: "#ffffff",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  overflow: "hidden",
                  fontFamily: "'Roboto', sans-serif",
                  position: "relative",
                }}
              >
                {/* Image Section */}
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    backgroundImage: `url('images/countries/${selectedMarker.country}.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  {/* Overlay for darker effect */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  {/* Country Name Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      width: "100%",
                      color: "#fff",
                      textAlign: "center",
                      fontSize: "1.8em",
                      fontWeight: "bold",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {selectedMarker.country}
                  </div>
                </div>
                {/* Content Section */}
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <ul
                    style={{
                      listStyleType: "none",
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    <li style={{ marginBottom: "15px" }}>
                      <a
                        href={`/predictive?port_country=${encodeURIComponent(
                          selectedMarker.country
                        )}`}
                        style={{
                          display: "block",
                          padding: "12px",
                          backgroundColor: "#1abc9c",
                          color: "#fff",
                          textDecoration: "none",
                          textAlign: "center",
                          borderRadius: "30px",
                          transition: "background-color 0.3s",
                          fontSize: "1em",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.backgroundColor = "#16a085";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.backgroundColor = "#1abc9c";
                        }}
                      >
                        Port Maintenance
                      </a>
                    </li>
                    <li>
                      <a
                        href={`/freight?origin=${encodeURIComponent(
                          selectedMarker.country
                        )}`}
                        style={{
                          display: "block",
                          padding: "12px",
                          backgroundColor: "#e67e22",
                          color: "#fff",
                          textDecoration: "none",
                          textAlign: "center",
                          borderRadius: "30px",
                          transition: "background-color 0.3s",
                          fontSize: "1em",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.backgroundColor = "#d35400";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.backgroundColor = "#e67e22";
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
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    border: "none",
                    fontSize: "1.5em",
                    cursor: "pointer",
                    color: "#fff",
                    padding: "0",
                    margin: "0",
                    lineHeight: "1",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    outline: "none",
                  }}
                  aria-label="Close Information Window"
                >
                  &times;
                </button>
              </div>
            </div>
          </OverlayView>
        )}
      </GoogleMap>
      {/* Add CSS for fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -130%); }
            to { opacity: 1; transform: translate(-50%, -120%); }
          }
        `}
      </style>
    </div>
  );
}

export default MapComponent;
