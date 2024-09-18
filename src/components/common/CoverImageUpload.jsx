import React, { useState } from "react";
import { storage } from "../../services/firebase";
import { FaCloudUploadAlt } from "react-icons/fa";
import coverDefault from "../../assets/images/banner.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/Animation - AvatarLoader.json";

const CoverImageUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MIN_WIDTH = 1024;
  const MIN_HEIGHT = 576;

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
      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        setError(`Image dimensions must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels.`);
        return;
      }

      setIsUploading(true);
      setError(""); // Clear previous errors

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
              src={image || coverDefault}
              alt="Uploaded"
              className="w-[16rem] h-[9rem] lg:w-[20rem] lg:h-[11rem] xl:w-[24rem] xl:h-[13rem] max-w-60 max-h-35 rounded-lg object-cover border-2 border-opacity-20 border-gray-300"
            />
          )}
          <span className="flex items-center text-blue-600 mt-2 text-xs font-bold">
            <FaCloudUploadAlt className="mr-1" /> Replace Cover Image
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

export default CoverImageUpload;
