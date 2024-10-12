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
          {/* route for login page and render the login page */}
          <Route path="/login" element={<Login />} />
          {/* route for signpu page and render the signup page */}
          <Route path="/signup" element={<Signup />} />
          {/* it will render the blogg feed home page  */}
          <Route path="/" element={<BlogFeed />} />

          {/* this route is for create a blog page section added private route for authentication  */}
          <Route
            path="/create"
            element={<PrivateRoute element={<BlogForm />} />}
          />
          {/* this routes is for edit the blogs  */}

          <Route path="/edit-blog/:id" element={<EditBlogForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
