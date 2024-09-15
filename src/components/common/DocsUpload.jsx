import React, { useState, useRef } from "react";
import { uploadDocuments } from "../../services/storageService";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animations/Animation - LoadingFile.json';

const DocsUpload = ({ setMedia }) => {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    const file = files[0];
    setSelectedFile(file);

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setFileName("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds the 5MB limit.");
      setFileName("");
      return;
    }

    setError("");
    setFileName(file.name);
    setUploading(true);

    try {
      // Upload to Firebase storage
      const downloadURLs = await uploadDocuments([file]);
      console.log("Uploaded files:", downloadURLs);
      setMedia(downloadURLs);
    } catch (error) {
      console.error("Error uploading document:", error);
      setError("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="w-full h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-4 cursor-pointer relative"
      onClick={handleClick}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        ref={fileInputRef} // Attach ref to the input
      />
      <div className="flex items-center justify-center gap-2">
        <FaCloudUploadAlt className="text-gray-500" />
        <p className="text-gray-500">
          {uploading
            ? <Lottie className="size-full max-h-20 max-w-20" animationData={loadingAnimation} loop />
            : error
            ? error
            : fileName
            ? `Uploaded: ${fileName}`
            : "Drag and drop files or browse computer"}
        </p>
        {selectedFile && !uploading && !error && (
          <FaFilePdf className="text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default DocsUpload;
