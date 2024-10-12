import { useState, useEffect } from "react";
import axios from "axios";

// this is the hooks for to get the current user location
const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Fetch location name from OpenCage API
          try {
            const apiKey = "90867bb32b84491db7cdaf25b52162a4"; // Replace with your OpenCage API Key
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
            );

            if (response.data.results.length > 0) {
              const locationData = response.data.results[0].formatted;
              setLocationName(locationData);
            } else {
              setLocationName("Location not found");
            }
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocationName("Error retrieving location name");
          }
        },
        (error) => {
          if (error.code === 1) {
            alert(
              "You have denied location access. Please allow location to use this feature."
            );
          } else {
            console.error("Error getting location:", error.message);
          }
        }
      );
    }
  }, []);

  return { location, locationName };
};

export default useLocation;
