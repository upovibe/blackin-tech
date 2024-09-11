import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Set the user data in state
      setUser({
        fullName: currentUser.fullName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
      });
    }
  }, []);

  if (!user) {
    return (
      <div className="text-center p-4">
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={user.photoURL || 'https://via.placeholder.com/150'}
            alt="User profile"
            className="w-20 h-20 rounded-full border border-gray-300"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.fullName || 'Anonymous'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">UID: {user.uid}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
