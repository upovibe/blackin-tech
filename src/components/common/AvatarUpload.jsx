import React, { useState } from "react";
import { storage } from "../../services/firebase";
import { FaCloudUploadAlt } from "react-icons/fa";
import avatarDefault from "../../assets/images/avatar-default.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/Animation - AvatarLoader.json";

const AvatarUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");


  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_DIMENSION = 1000;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setError("No file selected.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 5MB limit.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        setError(`Image dimensions should not exceed ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.`);
        return;
      }

      setIsUploading(true);
      setError(""); // Clear previous errors

      const fileRef = ref(storage, `avatars/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (err) => {
          setError(err.message);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadURL);
          if (typeof onUpload === "function") {
            onUpload(downloadURL);
          }
          setIsUploading(false);
        }
      );
    };

    img.onerror = () => {
      setError("Invalid image file.");
    };
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {isUploading ? (
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-24 h-24"
            />
          ) : (
            <img
              src={image || "https://via.placeholder.com/150"}
              alt="Uploaded"
              className="w-[6rem] h-[6rem] lg:w-[7rem] lg:h-[7rem] xl:w-[8rem] xl:h-[8rem] max-w-40 max-h-40 rounded-full object-cover border-2 border-opacity-20 border-gray-300"
            />
          )}
          <span className="flex items-center text-blue-600 mt-2 text-xs font-bold">
            <FaCloudUploadAlt className="mr-1" /> Replace Image
          </span>
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
