/* eslint-disable react/prop-types */
// LocationFilter.js

// eslint-disable-next-line react/prop-types
const LocationFilter = ({ blogs, selectedLocation, onChange }) => {
  return (
    <select
      id="location-filter"
      className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
      value={selectedLocation}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Locations</option>
      {Array.from(new Set(blogs.map((blog) => blog.location))) // Get unique locations
        .map((location, index) => (
          <option key={index} value={location}>
            {location}
          </option>
        ))}
    </select>
  );
};

export default LocationFilter;
