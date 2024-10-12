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

// Restrict the vertical scrolling by limiting latitude bounds
const mapBounds = {
  north: 85,  // Upper boundary
  south: -85, // Lower boundary
  west: -240,
  east: 240,
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
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]); // Store all markers

  // Function to handle closing the InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  // Clear existing markers
  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]); // Clear the state markers
  };

  // Function to add markers to the map
  const addMarkersToMap = () => {
    const newMarkers: google.maps.Marker[] = [];

    // Create markers for all countries
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

      newMarkers.push(marker);
    });

    setMarkers(newMarkers); // Store the markers in state
  };

  useEffect(() => {
    if (!isLoaded || !mapReference.current) return;

    // clearMarkers(); // Clear old markers if any
    addMarkersToMap(); // Add markers to the map
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
        options={{
          restriction: {
            latLngBounds: mapBounds,
            strictBounds: true, // Restrict the map to stay within bounds
          },
          zoomControl: true,
          scrollwheel: true,
        }}
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
            <div
              style={{
                width: "250px",
                padding: "15px",
                borderRadius: "10px",
                backgroundImage: `url('/images/countries/${selectedMarker.country}.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
                textAlign: "center", // Center align all text and elements
              }}
            >
              <h3
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  padding: "5px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {selectedMarker.country}
              </h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>
                  <a
                    href="/predictive"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      padding: "10px",
                      borderRadius: "5px",
                      display: "block",
                      color: "#4f83cc",
                      textDecoration: "none",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Port Maintenance
                  </a>
                </li>
                <li>
                  <a
                    href="/freight"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      padding: "10px",
                      borderRadius: "5px",
                      display: "block",
                      color: "#4f83cc",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
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
 