// eslint-disable-next-line react/prop-types
const InputField = ({ type, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full p-4 mb-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
    />
  );
};

export default InputField;
