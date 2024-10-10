import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import { useNavigate } from "react-router-dom";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store image file
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
            editorInstance.current = null;
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
              byFile: "your-upload-endpoint",
              byUrl: "your-url-endpoint",
            },
          },
        },
      },
      onChange: () => {
        console.log("Editor content changed");
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
      const blogResponse = await axios.post(
        "http://localhost:5000/api/blogs",
        newBlog
      );
      console.log("Blog created:", blogResponse.data);
      navigate("/blogfeed");
    } catch (error) {
      console.error("Error during blog submission:", error);
    }
  };

  return (
    <div>
      <h2>Create a Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])} // Handle image upload
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])} // Handle video upload
        />
        <div
          id="editorjs"
          className="editor"
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minHeight: "300px",
          }}
        ></div>
        <button type="submit" className="bg-blue-500 p-2 mt-4">
          Submit
        </button>
      </form>
      {locationName && <p>Current Location: {locationName}</p>}
    </div>
  );
};

export default BlogForm;
