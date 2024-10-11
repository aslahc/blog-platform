import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import BlogFeed from "./pages/Blog/BlogFeed";
import BlogForm from "./pages/Blog/BlogForm";
import CheckoutPage from "./pages/Blog/CheckoutPage";
import PrivateRoute from "./routes/PrivateRoute"; // Import your private route
import EditBlogForm from "./pages/Blog/EditBlogForm";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<BlogFeed />} />
          <Route
            path="/create"
            element={<PrivateRoute element={<BlogForm />} />}
          />
          <Route
            path="/checkout/:blogId"
            element={<PrivateRoute element={<CheckoutPage />} />}
          />
          <Route path="/edit-blog/:id" element={<EditBlogForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
