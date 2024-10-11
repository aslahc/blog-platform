import { useEffect, useState } from "react"; // Import useState
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { logout } from "../../redux/store/authSlice";
import axiosInstance from "../../axios/axios";

const BlogFeed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select users and loading/error state from Redux store
  const { users, loading, error } = useSelector((state) => state.users);
  const { blogs } = useSelector((state) => state.blogs);
  console.log("111", blogs);
  const { user } = useSelector((state) => state.auth);
  console.log("Auth State:", user);
  const userData = user ? user.id : null;

  // State for selected location
  const [selectedLocation, setSelectedLocation] = useState("");

  // Handle blog creation navigation
  const handleCreateBlog = () => {
    navigate("/create");
  };

  // Fetch users from backend and dispatch actions
  const fetchUsers = async () => {
    dispatch(fetchUsersStart());
    try {
      const response = await axiosInstance.get("/api/auth/users");
      dispatch(fetchUsersSuccess(response.data));
    } catch (err) {
      dispatch(fetchUsersFailure(err.message));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch blogs from backend and dispatch actions
  const fetchBlogs = async () => {
    dispatch(fetchBlogsStart());
    try {
      const response = await axiosInstance.get("/api/blogs");
      dispatch(fetchBlogsSuccess(response.data));
    } catch (err) {
      dispatch(fetchBlogsFailure(err.message));
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    dispatch(logout()); // Clear user from Redux if you're using Redux
    navigate("/login"); // Redirect to login page
  };
  const handleEdit = (blogId) => {
    const blogToEdit = blogs.find((blog) => blog._id === blogId);
    navigate(`/edit-blog/${blogId}`, { state: { blog: blogToEdit } });
  };
  // Filter blogs based on selected location
  const filteredBlogs = selectedLocation
    ? blogs.filter((blog) => blog.location === selectedLocation)
    : blogs;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">My Blog</h1>

      <button
        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg mb-5 hover:bg-red-600 transition"
        onClick={handleCreateBlog}
      >
        Create a Blog
      </button>
      <button
        className="bg-red-500 p-3 rounded-lg"
        onClick={() => {
          handleLogout();
        }}
      >
        logout
      </button>
      {/* Location Filter Dropdown */}
      <div className="mb-5">
        <label className="block text-gray-700 mb-2" htmlFor="location-filter">
          Filter by Location:
        </label>
        <select
          id="location-filter"
          className="border rounded-lg py-2 px-3 w-full"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {/* Here you can dynamically generate options based on available locations */}
          {Array.from(new Set(blogs.map((blog) => blog.location))) // Get unique locations
            .map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
        </select>
      </div>

      {loading && <p className="text-center text-gray-500">Loading blogs...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <h2 className="text-2xl font-semibold my-4">All Blogs</h2>

      <div className="space-y-4">
        {filteredBlogs.length > 0 ? (
          filteredBlogs
            .map((blog, index) => {
              const author = users.find((user) => user._id === blog.author._id);
              console.log("[", user?._id, "[][]", blog.author._id);
              const isAuthor = userData === blog.author._id;
              console.log(isAuthor);
              return (
                <div
                  key={blog._id || index}
                  className="border rounded-lg shadow-md p-4 bg-gray-50"
                >
                  <h1 className="text-gray-600">
                    {author ? author.name : "Unknown Author"}
                  </h1>
                  {isAuthor && (
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-600"
                    >
                      Edit Post
                    </button>
                  )}
                  <h3 className="text-xl font-bold">{blog.title}</h3>

                  <div className="mt-2">
                    {blog.content.map((block) => {
                      switch (block.type) {
                        case "paragraph":
                          return (
                            <p key={block.id} className="text-gray-700">
                              {block.data.text}
                            </p>
                          );
                        case "image":
                          return (
                            <img
                              key={block.id}
                              src={block.data.file.url}
                              alt={block.data.caption || "Blog Image"}
                              className="w-full h-auto mt-2 rounded-md"
                            />
                          );
                        case "header":
                          return (
                            <h2
                              key={block.id}
                              className="text-xl font-semibold mt-2"
                            >
                              {block.data.text}
                            </h2>
                          );
                        case "list":
                          return (
                            <ul key={block.id} className="list-disc ml-5 mt-2">
                              {block.data.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-gray-700">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>

                  {blog.video && (
                    <video
                      src={blog.video}
                      controls
                      className="w-full h-auto mt-4 mb-2 rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <p className="mt-2">
                    <strong>Location:</strong>{" "}
                    {blog.location ? blog.location : "Location not available"}
                  </p>
                </div>
              );
            })
            .reverse()
        ) : (
          <p className="text-center text-gray-500">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
