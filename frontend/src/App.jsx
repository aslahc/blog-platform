import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import BlogFeed from "./pages/Blog/BlogFeed";
import BlogForm from "./pages/Blog/BlogForm";
import CheckoutPage from "./pages/Blog/CheckoutPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login page route */}
          <Route path="/signup" element={<Signup />} />{" "}
          <Route path="/blogfeed" element={<BlogFeed />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/checkout/:blogId" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
