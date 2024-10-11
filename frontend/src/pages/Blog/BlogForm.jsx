import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axios";
const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store image file
  console.log(setImageFile);
  const [videoFile, setVideoFile] = useState(null); // Store video file
  const [location, setLocation] = useState(null); // Store location data
  const [locationName, setLocationName] = useState(""); // Store location name
  const editorInstance = useRef(null); // Reference for Editor.js
  const navigate = useNavigate();
  console.log(location);
  const user = useSelector((state) => state.auth.user);

  const presetKey = "cloudinaryimg";
  const cloudName = "dy9ofwwjp";
  useEffect(() => {
    initializeEditor();

    return () => {
      if (editorInstance.current) {
        editorInstance.current.isReady
          .then(() => {
            editorInstance.current.destroy();
            // editorInstance.current = null;
          })
          .catch((err) => console.error("Editor.js cleanup error:", err));
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
              byFile: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            },
            additionalRequestData: {
              upload_preset: presetKey,
            },
            uploader: {
              uploadByFile: async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", presetKey);

                const response = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
        console.log("Editor.js is ready to work!");
        editorInstance.current = editor;

        // Remove the first block on editor ready
        editorInstance.current.save().then((data) => {
          const blocks = data.blocks;
          if (blocks.length > 0) {
            blocks.shift(); // Remove the first block
            editorInstance.current.blocks.render(blocks);
          }
        });
      },
    });

    editor.isReady
      .then(() => {
        console.log("Editor.js is ready to work!");
        editorInstance.current = editor;
      })
      .catch((error) => {
        console.error("Editor.js initialization failed:", error);
      });
  };

  // Get user location and convert latitude/longitude to a location name
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Fetch location name from OpenCage API
          try {
            const apiKey = "90867bb32b84491db7cdaf25b52162a4"; // Replace with your OpenCage API Key
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
            );

            if (response.data.results.length > 0) {
              const locationData = response.data.results[0].formatted;
              setLocationName(locationData);
            } else {
              setLocationName("Location not found");
            }
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocationName("Error retrieving location name");
          }
        },
        (error) => {
          if (error.code === 1) {
            alert(
              "You have denied location access. Please allow location to use this feature."
            );
          } else {
            console.error("Error getting location:", error.message);
          }
        }
      );
    }
  }, []);

  // Handle image and video uploads to Cloudinary
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

      // Upload image to Cloudinary (if selected)
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, "image");
      }

      // Upload video to Cloudinary (if selected)
      let videoUrl = null;
      if (videoFile) {
        videoUrl = await uploadToCloudinary(videoFile, "video");
      }
      console.log("savedData", savedData);
      // Prepare blog data with media URLs
      const newBlog = {
        title,
        content: savedData.blocks,
        author: user?.id,
        location: locationName || "Location not available",
        image: imageUrl, // Attach image URL
        video: videoUrl, // Attach video URL
      };
      console.log("newblog", newBlog);
      // const blogResponse = await axios.post(
      //   "http://localhost:5000/api/blogs",
      //   newBlog
      // );

      const paymentResponse = await axiosInstance.post("/api/blogs/checkout", {
        amount: 100, // Adjust the amount as needed
      });

      const orderId = paymentResponse.data.orderId;

      const options = {
        key: "rzp_test_O3ookB75C6tQTa", // Your Razorpay Key ID
        amount: 100 * 100, // Amount in paise (100 INR)
        currency: "INR",
        order_id: orderId,
        handler: async function (response) {
          alert(
            "Payment Successful! Razorpay Payment ID: " +
              response.razorpay_payment_id
          );

          // Proceed to save the blog post

          console.log("before saving the data ", newBlog);

          const blogResponse = await axiosInstance.post("/api/blogs", newBlog);
          console.log("Blog created:", blogResponse.data);
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

      const rzp1 = new window.Razorpay(options); // Create Razorpay instance
      rzp1.open(); // Open the Razorpay modal
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

        {/* Video Upload Section */}
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

        {/* Text Editor Section */}
        <div
          id="editorjs"
          className="editor border border-gray-300 rounded-md p-4 bg-gray-50"
          style={{
            minHeight: "300px",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
          }}
        >
          {/* Optional: You can integrate a rich text editor library here for better UX */}
          <p className="text-gray-500 text-center">
            Start writing your blog content...
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>

      {/* Current Location Display */}
      {locationName && (
        <p className="mt-4 text-sm text-gray-600">
          Current Location: {locationName}
        </p>
      )}
    </div>
  );
};

export default BlogForm;
