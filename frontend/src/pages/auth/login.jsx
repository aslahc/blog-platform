import { useState } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/store/authSlice"; // Import the loginSuccess action

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize the dispatch hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      console.log(data, "after loging");
      // Dispatch the user data to Redux store
      dispatch(
        loginSuccess({
          user: data.user, // Assuming 'user' comes from your backend response
          token: data.token,
        })
      );

      navigate("/blogfeed");
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-gradient-to-br rounded-lg shadow-lg border border-gray-200 transform transition-all hover:scale-105"
    >
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Login
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition ease-in-out transform hover:scale-105"
      >
        Login
      </button>

      <p className="mt-6 text-center text-gray-800">
        Not a member?{" "}
        <Link to="/signup" className="text-indigo-600 hover:underline">
          Signup here
        </Link>
      </p>
    </form>
  );
};

export default Login;
