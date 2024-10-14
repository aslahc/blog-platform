/* eslint-disable react/prop-types */
// src/components/ButtonComponent.js
const ButtonComponent = ({ label }) => {
  return (
    <button
      type="submit"
      className="w-full bg-black text-white font-semibold py-3 rounded-lg transition ease-in-out transform hover:scale-105"
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
