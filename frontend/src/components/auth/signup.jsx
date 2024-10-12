import { useState } from "react";
import { signup } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Signup = () => {
  // states to manage the datas
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // function to handle the submition of the signup details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Name is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      console.log("p");
      const data = await signup({ name, email, password });
      console.log(data);
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("there is a error ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full p-8 bg-gradient-to-br  rounded-lg shadow-lg border border-gray-200 transform transition-all hover:scale-105"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Signup
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          className="w-full p-4 mb-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
          className="w-full p-4 mb-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your Password"
          required
          className="w-full p-4 mb-6 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
        />

        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gradient-to-r   transition ease-in-out transform hover:scale-105"
        >
          Signup
        </button>

        <p className="mt-6 text-center text-gray-800">
          Already a member?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
