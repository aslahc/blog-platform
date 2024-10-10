import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "../../redux/store/usersSlice"; // Import the users actions
import {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
} from "../../redux/store/blogsSlice";
const BlogFeed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select users and loading/error state from Redux store
  const { users, loading, error } = useSelector((state) => state.users);
  console.log(users);
  const handleCreateBlog = () => {
    navigate("/create");
  };

  // Fetch users from backend and dispatch actions
  const fetchUsers = async () => {
    dispatch(fetchUsersStart()); // Start fetching users (loading state)
    try {
      const response = await axios.get("http://localhost:5000/api/auth/users");
      dispatch(fetchUsersSuccess(response.data)); // Save users to Redux on success
    } catch (err) {
      dispatch(fetchUsersFailure(err.message)); // Dispatch error action on failure
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);
  const fetchBlogs = async () => {
    dispatch(fetchBlogsStart()); // Start fetching blogs (loading state)
    try {
      const response = await axios.get("http://localhost:5000/api/blogs"); // Update with correct API endpoint

      dispatch(fetchBlogsSuccess(response.data)); // Save blogs to Redux on success
    } catch (err) {
      dispatch(fetchBlogsFailure(err.message)); // Dispatch error action on failure
    }
  };

  useEffect(() => {
    fetchBlogs(); // Fetch blogs when the component mounts
  }, []);

  const { blogs } = useSelector((state) => state.blogs);
  console.log(blogs);
  return (
    <div>
      <h1>My Blog</h1>
      <button
        className="bg-red-500 m-5 rounded-lg p-5"
        onClick={handleCreateBlog}
      >
        Create a Blog
      </button>

      {/* Render loading, error or users data */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <h2>All Blogs</h2>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="border p-4 m-2">
              <h3>{blog.title}</h3>
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-auto mb-4"
                />
              )}
              {/* Conditional rendering for video */}
              {blog.video && (
                <video src={blog.video} controls className="w-full h-auto mb-4">
                  Your browser does not support the video tag.
                </video>
              )}
              <p>
                {typeof blog.content === "string"
                  ? blog.content
                  : "Content not available"}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {blog.location ? blog.location : "Location not available"}
              </p>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
