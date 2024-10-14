import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axios";
import useLocation from "../../hooks/useLocation";
import useCloudinary from "../../hooks/useCloudinary";
const BlogForm = () => {
  // States for blog title, video file, and Editor.js instance
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const editorInstance = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { locationName } = useLocation();

  const { uploadToCloudinary, uploading, error } = useCloudinary(); // Destructure hook values
  // useeffect to render the editor 
  useEffect(() => {
    initializeEditor();

    return () => {
      if (editorInstance.current) {
        editorInstance.current.isReady
          .then(() => {
            editorInstance.current.destroy();
          })
          .catch((err) => console.error("Editor.js cleanup error:", err));
      }
    };
  }, []);
  // Function to initialize Editor.js with tools and configuration
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
            uploader: {
              uploadByFile: async (file) => {
                const imageUrl = await uploadToCloudinary(file, "image");
                if (imageUrl) {
                  return {
                    success: 1,
                    file: {
                      url: imageUrl,
                    },
                  };
                } else {
                  return {
                    success: 0,
                  };
                }
              },
            },
          },
        },
      },
      onChange: () => {},
      onReady: () => {
        editorInstance.current = editor;
      },
    });
  };
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editorInstance.current) {
      return;
    }

    try {
      const savedData = await editorInstance.current.save();
      if (!savedData || savedData.blocks.length === 0) {
        alert("Please add content to the editor");
        return;
      }

      let videoUrl = null;
      if (videoFile) {
        videoUrl = await uploadToCloudinary(videoFile, "video");
      }

      const newBlog = {
        title,
        content: savedData.blocks,
        author: user?.id,
        location: locationName || "Location not available",
        video: videoUrl,
      };

      const paymentResponse = await axiosInstance.post("/api/blogs/checkout", {
        amount: 100,
      });

      const orderId = paymentResponse.data.orderId;

      const options = {
        key: "rzp_test_O3ookB75C6tQTa",
        amount: 100 * 100,
        currency: "INR",
        order_id: orderId,
        handler: async function (response) {
          alert(
            "Payment Successful! Razorpay Payment ID: " +
              response.razorpay_payment_id
          );

          const blogResponse = await axiosInstance.post("/api/blogs", newBlog);
          console.log(blogResponse);
          navigate("/");
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "1234567890",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during blog submission:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create a Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="flex space-x-4">
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

        <div
          id="editorjs"
          className="editor border border-gray-300 rounded-md p-4 bg-gray-50"
          style={{
            minHeight: "300px",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
          }}
        ></div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>

        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </form>

      {locationName && (
        <p className="mt-4 text-sm text-gray-600">
          Current Location: {locationName}
        </p>
      )}
    </div>
  );
};

export default BlogForm;
