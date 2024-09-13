import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ImagesUpload = ({ setMedia }) => {
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Please upload at least one image.");
      setMedia([]);
      setPreviewUrls([]);
      return;
    }

    if (imageFiles.length > 4) {
      setError("You can upload up to 4 images.");
      setMedia([]);
      setPreviewUrls([]);
      return;
    }

    setError("");
    setMedia(imageFiles);
    setPreviewUrls(imageFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setMedia((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleMediaChange}
        multiple
        className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="flex flex-wrap mt-4">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative w-28 h-28 m-2 bg-slate-100 border border-slate-300 rounded-lg"
          >
            <img
              src={url}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 p-1 rounded-full text-white cursor-pointer transition-all bg-gradient-to-r duration-200 from-red-800 to-red-600 hover:from-red-700 hover:to-red-500"
            >
              <FaTimes size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesUpload;
