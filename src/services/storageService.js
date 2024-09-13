import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImages = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const fileRef = ref(storage, `images/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  });

  return Promise.all(uploadPromises);
};
