import React, { useState } from "react";
import { storage } from "../../services/firebase";
import { FaCloudUploadAlt } from "react-icons/fa";
import coverDefault from "../../assets/images/placeholder-image.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/Animation - AvatarLoader.json";

const CoverImageUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

    setIsUploading(true);
    setError("");

    const fileRef = ref(storage, `coverImages/${file.name}`);
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

  return (
    <div className="relative">
      <label
        htmlFor="cover-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        {isUploading ? (
          <Lottie
            animationData={animationData}
            loop={true}
            className="size-24"
          />
        ) : (
          <img
            src={image || coverDefault}
            alt="Uploaded"
            className="w-[20rem] h-32 rounded-lg object-cover border-2 border-opacity-20 border-gray-300"
          />
        )}
        <span className="flex items-center text-blue-600 mt-2 text-xs font-bold">
          <FaCloudUploadAlt className="mr-1" /> Replace Cover Image
        </span>
      </label>
  
      <input
        type="file"
        id="cover-upload"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
  
      {/* Error message display */}
      {error && (
        <div className="text-red-500 text-xs mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;
