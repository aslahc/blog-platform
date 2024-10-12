import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import BlogFeed from "./components/Blog/BlogFeed";
import BlogForm from "./components/Blog/BlogForm";
import PrivateRoute from "./routes/PrivateRoute"; // Import your private route
import EditBlogForm from "./components/Blog/EditBlogForm";
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

          <Route path="/edit-blog/:id" element={<EditBlogForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
