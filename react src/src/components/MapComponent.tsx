/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

// Types for Country and Marker
type Country = {
  name: string;
  lat: number;
  lng: number;
  type: string;
};

type CustomMarker = {
  marker: google.maps.Marker;
  type: string;
  countryName: string;
};

const containerStyle = {
  width: "100%",
  height: "100vh", // Full height of the viewport
};

const mapBounds = {
  north: 85,
  south: -85,
  west: -240,
  east: 240,
};

const countries: Country[] = [
  // Asia
  { name: "Bangladesh", lat: 23.685, lng: 90.3563, type: "purple" },
  { name: "China", lat: 35.8617, lng: 104.1954, type: "red" },
  { name: "China", lat: 35.8619, lng: 104.1956, type: "blue" }, // Slight offset
  { name: "India", lat: 20.5937, lng: 78.9629, type: "red" },
  { name: "India", lat: 20.5935, lng: 78.9631, type: "blue" }, // Slight offset
  { name: "Indonesia", lat: -0.7893, lng: 113.9213, type: "red" },
  { name: "Indonesia", lat: -0.7891, lng: 113.9211, type: "blue" }, // Slight offset
  { name: "Japan", lat: 36.2048, lng: 138.2529, type: "blue" },
  { name: "Kazakhstan", lat: 48.0196, lng: 66.9237, type: "green" },
  { name: "Malaysia", lat: 4.2105, lng: 101.9758, type: "purple" },
  { name: "Oman", lat: 21.5126, lng: 55.9233, type: "purple" },
  { name: "Qatar", lat: 25.3548, lng: 51.1839, type: "red" },
  { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, type: "red" },
  { name: "Saudi Arabia", lat: 23.8857, lng: 45.0794, type: "blue" }, // Slight offset
  { name: "Singapore", lat: 1.3521, lng: 103.8198, type: "blue" },
  { name: "South Korea", lat: 35.9078, lng: 127.7669, type: "blue" },
  { name: "Thailand", lat: 15.87, lng: 100.9925, type: "yellow" },
  { name: "UAE", lat: 23.4241, lng: 53.8478, type: "blue" },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, type: "yellow" },

  // Europe
  { name: "Belgium", lat: 50.8503, lng: 4.3517, type: "red" },
  { name: "Belgium", lat: 50.8501, lng: 4.3515, type: "blue" }, // Slight offset
  { name: "Czech Republic", lat: 49.8175, lng: 15.473, type: "blue" },
  { name: "Denmark", lat: 56.2639, lng: 9.5018, type: "blue" },
  { name: "France", lat: 46.6034, lng: 1.8883, type: "red" },
  { name: "France", lat: 46.6036, lng: 1.8885, type: "blue" }, // Slight offset
  { name: "Germany", lat: 51.1657, lng: 10.4515, type: "blue" },
  { name: "Germany", lat: 51.1655, lng: 10.4517, type: "green" }, // Slight offset
  { name: "Ireland", lat: 53.4129, lng: -8.2439, type: "green" },
  { name: "Italy", lat: 41.8719, lng: 12.5674, type: "red" },
  { name: "Netherlands", lat: 52.1326, lng: 5.2913, type: "yellow" },
  { name: "Netherlands", lat: 52.1324, lng: 5.2911, type: "blue" }, // Slight offset
  { name: "Poland", lat: 51.9194, lng: 19.1451, type: "red" },
  { name: "Poland", lat: 51.9196, lng: 19.1453, type: "blue" }, // Slight offset
  { name: "Portugal", lat: 39.3999, lng: -8.2245, type: "blue" },
  { name: "Romania", lat: 45.9432, lng: 24.9668, type: "yellow" },
  { name: "Spain", lat: 40.4637, lng: -3.7492, type: "yellow" },
  { name: "Sweden", lat: 60.1282, lng: 18.6435, type: "blue" },
  { name: "Türkiye", lat: 38.9637, lng: 35.2433, type: "yellow" },
  { name: "United Kingdom", lat: 55.3781, lng: -3.436, type: "blue" },

  // Americas
  { name: "Argentina", lat: -38.4161, lng: -63.6167, type: "red" },
  { name: "Argentina", lat: -38.4163, lng: -63.6169, type: "yellow" }, // Slight offset
  { name: "Brazil", lat: -14.235, lng: -51.9253, type: "blue" },
  { name: "Brazil", lat: -14.2352, lng: -51.9251, type: "yellow" }, // Slight offset
  { name: "Brazil", lat: -14.2354, lng: -51.9255, type: "red" }, // Slight offset
  { name: "Canada", lat: 56.1304, lng: -106.3468, type: "blue" },
  { name: "Canada", lat: 56.1306, lng: -106.347, type: "green" }, // Slight offset
  { name: "Canada", lat: 56.1308, lng: -106.3472, type: "red" }, // Slight offset
  { name: "Chile", lat: -35.6751, lng: -71.543, type: "blue" },
  { name: "Colombia", lat: 4.5709, lng: -74.2973, type: "blue" },
  { name: "Ecuador", lat: -1.8312, lng: -78.1834, type: "purple" },
  { name: "Panama", lat: 8.538, lng: -80.7821, type: "red" },
  { name: "Peru", lat: -9.19, lng: -75.0152, type: "purple" },
  { name: "Uruguay", lat: -32.5228, lng: -55.7658, type: "yellow" },
  { name: "USA", lat: 37.0902, lng: -95.7129, type: "blue" },
  { name: "USA", lat: 37.09, lng: -95.7127, type: "yellow" }, // Slight offset

  // Africa
  { name: "Egypt", lat: 26.8206, lng: 30.8025, type: "blue" },
  { name: "Morocco", lat: 31.7917, lng: -7.0926, type: "blue" },

  // Oceania
  { name: "Australia", lat: -25.2744, lng: 133.7751, type: "blue" },
  { name: "New Zealand", lat: -40.9006, lng: 174.886, type: "blue" },
];
function MapComponent() {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not defined. Please check your .env file.");
    }
  
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: apiKey,
    });
  
    const mapReference = useRef<google.maps.Map | null>(null);
    const [allMarkers, setAllMarkers] = useState<google.maps.Marker[]>([]); // store all markers here
    const [visibleMarkers, setVisibleMarkers] = useState<google.maps.Marker[]>([]); // store currently visible markers
  
    useEffect(() => {
      const handleResize = () => {
        if (mapReference.current) {
          google.maps.event.trigger(mapReference.current, 'resize');
        }
      };
  
      if (isLoaded && mapReference.current) {
        const markerBounds = new google.maps.LatLngBounds();
        const newMarkers: google.maps.Marker[] = [];
  
        countries.forEach((country) => {
          const marker = new google.maps.Marker({
            map: mapReference.current,
            position: { lat: country.lat, lng: country.lng },
            title: country.name,
            icon: `https://maps.google.com/mapfiles/ms/icons/${country.type}-dot.png`,
          });
  
          newMarkers.push(marker);
          markerBounds.extend({ lat: country.lat, lng: country.lng });
        });
  
        setAllMarkers(newMarkers);
        setVisibleMarkers(newMarkers);
        mapReference.current?.fitBounds(markerBounds);
  
        // Trigger resize to ensure the map displays correctly after adding markers
        handleResize();
      }
  
      // Add the resize event listener
      window.addEventListener('resize', handleResize);
  
      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [isLoaded]); // Removed 'countries' from dependency array to avoid unnecessary rerenders
  
    const handleButtonClick = (type: string) => {
      // Hide all current visible markers
      visibleMarkers.forEach((marker) => marker.setMap(null));
  
      // Filter and display the new set of markers
      const filteredMarkers = allMarkers.filter((marker) => {
        if (type === "all") return true; // Show all markers
  
        // Get the icon and ensure it's a string
        const icon = marker.getIcon();
        if (typeof icon === "string") {
          return icon.includes(`${type}-dot.png`);
        }
  
        // If the icon is not a string, we can't filter it, so we return false
        return false;
      });
  
      // Display filtered markers
      filteredMarkers.forEach((marker) => marker.setMap(mapReference.current));
      setVisibleMarkers(filteredMarkers); // update the state with currently visible markers
    };
  
    if (loadError) {
      console.error("Error loading Google Maps:", loadError);
      return <div>Error loading map. Please check your API key.</div>;
    }
  
    if (!isLoaded) return <div>Loading...</div>;
  
    return (
      <div className="relative" style={{ width: "100%", height: "100vh" }}>
        <div id="map-canvas" className="w-full h-full">
          <GoogleMap
            mapContainerClassName="w-full h-full"
            options={{
              restriction: {
                latLngBounds: mapBounds,
                strictBounds: true,
              },
              gestureHandling: "greedy",
              zoomControl: false,
              scrollwheel: false,
            }}
            onLoad={(map) => {
              mapReference.current = map;
            }}
          />
        </div>
        {/* Buttons styled in a 3-column grid */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-4">
          {["all", "red", "blue", "green", "yellow", "purple"].map((type) => (
            <button
              key={type}
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
              onClick={() => handleButtonClick(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  export default MapComponent;