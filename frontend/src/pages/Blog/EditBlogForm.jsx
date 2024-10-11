import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import { useSelector } from "react-redux";
import axiosInstance from "../../axios/axios";

const EditBlogForm = () => {
  const presetKey = "cloudinaryimg";
  const cloudName = "dy9ofwwjp";
  const location = useLocation();
  const navigate = useNavigate();
  const { blog } = location.state; // Get the blog passed from BlogFeed
  const [title, setTitle] = useState(blog.title);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [locationName, setLocationName] = useState(blog.location);
  console.log(setLocationName);
  const editorInstance = useRef(null);

  const user = useSelector((state) => state.auth.user);
  console.log(user);
  useEffect(() => {
    initializeEditor();
    return () => {
      if (editorInstance.current) {
        editorInstance.current.isReady
          .then(() => {
            editorInstance.current.destroy();
          })
          .catch((err) => console.error("Editor cleanup error:", err));
      }
    };
  }, []);

  const initializeEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `https://api.cloudinary.com/v1_1/dy9ofwwjp/image/upload`,
            },
            additionalRequestData: {
              upload_preset: "cloudinaryimg",
            },
            uploader: {
              uploadByFile: async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "cloudinaryimg");

                const response = await fetch(
                  `https://api.cloudinary.com/v1_1/dy9ofwwjp/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const data = await response.json();
                return {
                  success: 1,
                  file: {
                    url: data.secure_url,
                  },
                };
              },
            },
          },
        },
      },
      onChange: () => {
        console.log("Editor content changed");
      },
      onReady: () => {
        console.log("Editor.js is ready!");
        editorInstance.current = editor;

        // Set initial content from blog
        editorInstance.current.blocks.render(blog.content);
      },
    });
  };
  const uploadToCloudinary = async (file, resourceType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetKey); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      } else {
        console.error(
          "Failed to upload file to Cloudinary:",
          response.status,
          response.statusText
        );
      }
      return response.data.secure_url;
    } catch (error) {
      console.error(`Error uploading ${resourceType}:`, error);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editorInstance.current) {
      console.error("Editor.js instance is not initialized");
      return;
    }

    try {
      const savedData = await editorInstance.current.save();
      if (!savedData || savedData.blocks.length === 0) {
        alert("Please add content to the editor");
        return;
      }

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, "image");
      }

      let videoUrl = null;
      if (videoFile) {
        videoUrl = await uploadToCloudinary(videoFile, "video");
      }

      const updatedBlog = {
        title,
        content: savedData.blocks,
        location: locationName || "Location not available",
        image: imageUrl,
        video: videoUrl,
      };

      const blogResponse = await axiosInstance.put(
        `/api/blogs/${blog._id}`,
        updatedBlog
      );
      console.log("Blog updated:", blogResponse.data);
      navigate("/"); // Redirect to the updated blog page
    } catch (error) {
      console.error("Error during blog update:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>

        {/* Image and Video Upload */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Editor Section */}
        <div
          id="editorjs"
          className="editor border border-gray-300 rounded-md p-4 bg-gray-50"
          style={{
            minHeight: "300px",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
          }}
        >
          <p className="text-gray-500 text-center">
            Start editing your blog content...
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlogForm;
