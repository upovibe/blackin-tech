import React, { useState } from 'react';
import { storage } from '../../services/firebase';
import { FaCloudUploadAlt } from 'react-icons/fa';
import avatarDefault from '../../assets/images/avatar-default.png';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/Animation - AvatarLoader.json';

const AvatarUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_DIMENSION = 1000;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setError('No file selected.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds the 5MB limit.');
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
      setError(''); // Clear previous errors

      const fileRef = ref(storage, `avatars/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (err) => {
          setError(err.message);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadURL);
          if (typeof onUpload === 'function') {
            onUpload(downloadURL);
          }
          setIsUploading(false);
        }
      );
    };

    img.onerror = () => {
      setError('Invalid image file.');
    };
  };

  return (
    <div className="relative">
      <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center">
        {isUploading ? (
          <Lottie animationData={animationData} loop={true} className="w-24 h-24" />
        ) : (
          <img
            src={image || avatarDefault}
            alt="Uploaded"
            className="w-24 h-24 max-w-40 max-h-40 rounded-full object-cover border-2 border-opacity-20 border-slate-300"
          />
        )}
        <span className="flex items-center text-slate-600 mt-2 text-xs font-bold gap-2">
          <FaCloudUploadAlt className="text-slate-600 text-sm" />
          Replace Image
        </span>
      </label>
      <input
        id="avatar-upload"
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
