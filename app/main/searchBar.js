"use client";

import { useState } from "react";
import axios from "axios";
import { useGlobal } from "../provider/userContext"; // Make sure useGlobal is correctly set up

function SearchLocation() {
  const { map } = useGlobal(); // Ensure map is properly initialized in the context
  const [result, setResult] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState("");

  const search = async (e) => {
    const locationQuery = e.target.value;

    // Only search if input is longer than 3 characters
    if (locationQuery.length > 3) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${locationQuery}&format=json`,
          { timeout: 20000 }
        );

        // Log response to ensure it's coming correctly
        console.log(response.data);

        if (response.data.length) {
          setResult(response.data);
        } else {
          setResult([]); // Clear results if none found
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setResult([]); // Clear results on error
      }
    } else {
      setResult([]); // Clear results when query is too short
    }
  };

  const zoomToLocation = (location) => {
    const coordinates = [parseFloat(location.lon), parseFloat(location.lat)];

    // Set selected location's display name
    setSelectedLoc(location.display_name);

    // Animate map to the selected location
    map.getView().animate({
      zoom: 13,
      center: coordinates,
      duration: 2000,
    });

    // Clear search results after selecting a location
    setResult([]);
  };

  return (
    <div className="absolute top-1 w-3/4 m-auto right-1/2 translate-x-1/2 flex items-center gap-2 bg-white text-black rounded-lg shadow z-[999]">
      <form
        className="p-2 flex w-full rounded items-center"
        style={{ background: "#0b2a66" }}
      >
        <input
          placeholder="Search location"
          value={selectedLoc}
          onChange={(e) => {
            setSelectedLoc(e.target.value); // Update input value
            search(e); // Call the search function
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search(e);
            }
          }}
          type="text"
          className="p-2 h-10 text-xl border self-center m-auto w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block bg-white text-black"
          required
        />
      </form>

      {result?.length > 0 && (
        <ul className="absolute z-[999] list-none rounded-md shadow-lg w-full bg-stone-100 text-black top-14 right-2">
          {result.map((item, index) => (
            <li
              key={index}
              className={`p-1 z-[999] border-b border-gray-400 bg-inherit hover:bg-stone-200 cursor-pointer ${
                index === 0 && "rounded-t-md"
              } ${index === result.length - 1 && "rounded-b-md"}`}
              onClick={() => zoomToLocation(item)}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchLocation;
