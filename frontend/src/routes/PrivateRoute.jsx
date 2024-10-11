import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token"); // Check for token in localStorage

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if no token
  }

  return element; // Render the protected component
};

export default PrivateRoute;
