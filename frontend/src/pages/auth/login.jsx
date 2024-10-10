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

      alert("Login successful!");
      navigate("/blogfeed");
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
        Login
      </button>

      <p className="mt-4 text-center">
        New member?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Signup here
        </Link>
      </p>
    </form>
  );
};

export default Login;
