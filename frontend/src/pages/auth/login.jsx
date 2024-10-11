import { useState } from "react";
import { login } from "../../axios/axios";
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
      if (data?.token) {
        console.log("Login successful, token received:", data.token);
        localStorage.setItem("token", data.token);

        // Dispatch the user data to Redux store
        dispatch(
          loginSuccess({
            user: data.user, // Assuming 'user' comes from your backend response
            token: data.token,
          })
        );

        // Wait a moment before redirecting to ensure token is saved
        setTimeout(() => {
          navigate("/");
        }, 100); // You can try adjusting the timeout or remove it if not needed
      } else {
        setError("Failed to get token from server.");
      }
    } catch (error) {
      console.error(error);
      // Check if the error response has a message
      if (error.response && error.response.data && error.response.data.msg) {
        setError(error.response.data.msg); // Set the error message from the response
      } else {
        setError("Login failed! Please try again."); // Generic error message
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {" "}
      {/* Full height and center flexbox */}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full p-8 bg-gradient-to-br rounded-lg shadow-lg border border-gray-200 transform transition-all hover:scale-105"
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
          className="w-full bg-black text-white font-semibold py-3 rounded-lg transition ease-in-out transform hover:scale-105"
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
    </div>
  );
};

export default Login;
