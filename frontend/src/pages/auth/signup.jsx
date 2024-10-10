import { useState } from "react";
import { signup } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate name
    if (!name) {
      setError("Name is required.");
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const data = await signup({ name, email, password });
      localStorage.setItem("token", data.token);
      alert("Signup successful!");
      navigate("/"); // Redirect to the login page after signup
    } catch (error) {
      console.error(error);
      alert("Signup failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Signup</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Signup
      </button>

      {/* Add a link to the Login page */}
      <p className="mt-4 text-center">
        Already a member?{" "}
        <Link to="/" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Signup;
