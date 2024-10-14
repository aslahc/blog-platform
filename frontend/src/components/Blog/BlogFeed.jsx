import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "../../redux/store/usersSlice";
import {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
} from "../../redux/store/blogsSlice";
import { logout } from "../../redux/store/authSlice";
import axiosInstance from "../../axios/axios";
import CreateBlogButton from "./CreateBlogButton";
import LocationFilter from "./LocationFilter";
import Loading from "./Loading";
// this is the home page here is showing the blogg feed
const BlogFeed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select users and loading/error state from Redux store
  const { users, loading, error } = useSelector((state) => state.users);
  const { blogs } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);
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
  const getStateFromLocation = (location) => {
    if (!location) return "";
    const parts = location.split(",");
    const state = parts.length > 1 ? parts[parts.length - 2].trim() : "";
    return state;
  };
  return (
    <div className="max-w-4xl mx-auto p-5">
      {/* Header */}

      {/* Navbar Container */}
      <div className="flex flex-col sm:flex-row  justify-between items-center mb-6 space-y-4 sm:space-y-0 w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <CreateBlogButton onClick={handleCreateBlog} />

          <div className="w-full sm:w-auto">
            <LocationFilter
              blogs={blogs}
              selectedLocation={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>
        </div>

        {/* Logout Button */}
        {user ? (
          <button
            className="bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-md w-full sm:w-auto mt-4 sm:mt-0"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-md w-full sm:w-auto mt-4 sm:mt-0"
          >
            login/signup
          </button>
        )}
      </div>

      {loading && <Loading />}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      <h2 className="text-2xl font-semibold my-4">All Blogs</h2>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs
            .map((blog, index) => {
              const author = users.find((user) => user._id === blog.author._id);
              const isAuthor = userData === blog.author._id;
              return (
                <article
                  key={blog._id || index}
                  className="py-12 border-b border-gray-200 last:border-b-0 transition-transform duration-300 ease-in-out transform  hover:scale-105"
                >
                  <header className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 hover:text-gray-600 transition-colors duration-300">
                      {blog.title}
                    </h2>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium text-blue-500 mr-2">
                          {author ? author.name : "Unknown Author"}
                        </span>
                        {blog.location && (
                          <span className="before:content-['•'] before:mx-2">
                            {getStateFromLocation(blog.location)}
                          </span>
                        )}
                      </div>
                      {isAuthor && (
                        <button
                          onClick={() => handleEdit(blog._id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          Edit Post
                        </button>
                      )}
                    </div>
                  </header>

                  <div className="prose prose-lg max-w-none">
                    {blog.content.map((block) => {
                      switch (block.type) {
                        case "paragraph":
                          return (
                            <p
                              key={block.id}
                              className="mb-4 text-gray-700 leading-relaxed"
                            >
                              {block.data.text}
                            </p>
                          );
                        case "image":
                          return (
                            <figure key={block.id} className="my-8">
                              <img
                                src={block.data.file.url}
                                alt={block.data.caption || "Blog Image"}
                                className="w-full h-auto rounded-lg shadow-md"
                              />
                              {block.data.caption && (
                                <figcaption className="mt-2 text-center text-sm text-gray-500">
                                  {block.data.caption}
                                </figcaption>
                              )}
                            </figure>
                          );
                        case "header":
                          return (
                            <h3
                              key={block.id}
                              className="text-2xl font-semibold text-gray-900 mt-8 mb-4"
                            >
                              {block.data.text}
                            </h3>
                          );
                        case "list":
                          return (
                            <ul
                              key={block.id}
                              className="list-disc pl-5 space-y-2 mb-4"
                            >
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
                    <div className="my-8">
                      <video
                        src={blog.video}
                        controls
                        className="w-full h-auto rounded-lg shadow-md"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </article>
              );
            })
            .reverse()
        ) : (
          <p className="text-center text-gray-500 py-12">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
