import { useState } from "react";
import { signup } from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import InputField from "../inputs/InputField"; // Import the new InputField component
import ButtonComponent from "../buttons/SubmitButton"; // Import the SubmitButton component

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      const data = await signup({ name, email, password });
      console.log(data);
      if (data.status == true) {
        navigate("/login");
      } else {
        setError("Email already exists.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full p-8 bg-gradient-to-br rounded-lg shadow-lg border border-gray-200 transform transition-all hover:scale-105"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Signup
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Use InputField for each input */}
        <InputField
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your Password"
        />

        {/* Use SubmitButton for the signup button */}
        <ButtonComponent label="Signup" />

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
