import React, { useEffect, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "1000px",
};

const mapBounds = {
  north: 160,
  south: -160,
  west: -220,
  east: 220,
};

// List of countries with different marker colors
const countries = [
  { name: "Belgium", lat: 50.8503, lng: 4.3517, type: "red" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, type: "blue" },
  { name: "Philadelphia", lat: 39.9526, lng: -75.1652, type: "red" },
  { name: "Brazil", lat: -14.235, lng: -51.9253, type: "green" },
  { name: "India", lat: 20.5937, lng: 78.9629, type: "yellow" },
  { name: "Australia", lat: -25.2744, lng: 133.7751, type: "turquoise" },
];

// Create marker content based on the country type
const createMarkerContent = (
  countryType: string,
  countryName: string
): HTMLElement => {
  const div = document.createElement("div");
  div.className = "flex items-center justify-center";

  const img = document.createElement("img");

  img.src =
    countryType === "red"
      ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
      : countryType === "blue"
      ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      : countryType === "green"
      ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
      : countryType === "yellow"
      ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
      : "https://maps.google.com/mapfiles/ms/icons/cyan-dot.png"; // turquoise

  img.className = "w-10 h-10";
  img.alt = countryName;

  div.append(img);
  return div;
};

function MapComponent() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined. Please check your .env file.");
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const mapReference = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (isLoaded && mapReference.current && countries.length > 0) {
      const markerBounds = new google.maps.LatLngBounds();

      countries.forEach((country) => {
        markerBounds.extend({ lat: country.lat, lng: country.lng });

        const iconUrl =
          country.type === "red"
            ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            : country.type === "blue"
            ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            : country.type === "green"
            ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : country.type === "yellow"
            ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            : "https://maps.google.com/mapfiles/ms/icons/cyan-dot.png"; // turquoise

        const marker = new google.maps.Marker({
          map: mapReference.current,
          position: { lat: country.lat, lng: country.lng },
          title: country.name,
          icon: iconUrl, // Set the icon here
        });

        const content = createMarkerContent(country.type, country.name);
        const infoWindow = new google.maps.InfoWindow({
          content,
        });

        marker.addListener("click", () => {
          infoWindow.open({
            anchor: marker,
            map: mapReference.current,
            shouldFocus: false,
          });
        });
      });

      mapReference.current.fitBounds(markerBounds);
    }
  }, [isLoaded]);

  if (loadError) {
    console.error("Error loading Google Maps:", loadError);
    return <div>Error loading map. Please check your API key.</div>;
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={{
        restriction: {
          latLngBounds: mapBounds,
          strictBounds: true,
        },
        gestureHandling: "none",
      }}
      onLoad={(map) => {
        mapReference.current = map;
      }}
    />
  );
}

export default MapComponent;
