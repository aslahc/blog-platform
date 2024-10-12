import { useState } from "react";

const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const presetKey = "cloudinaryimg"; // Your upload preset
  const cloudName = "dy9ofwwjp"; // Your Cloudinary cloud name
  // Function to upload files to Cloudinary
  const uploadToCloudinary = async (file, resourceType = "image") => {
    setUploading(true);
    setError(null);
    // Prepare the form data with the file and upload preset
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetKey);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file to Cloudinary");
      }

      const data = await response.json();
      setUploading(false);
      return data.secure_url;
    } catch (error) {
      setError(error.message);
      setUploading(false);
      return null;
    }
  };
  // Return the upload function, uploading state, and any error messages
  return {
    uploadToCloudinary,
    uploading,
    error,
  };
};

export default useCloudinary;
