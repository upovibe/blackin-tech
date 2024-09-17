rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
        // Allow authenticated users to read/write their own data in the 'users' collection
    match /users/{userId} {
      allow read, write: if request.auth != true;
    }
    
// Rules for jobs collection
match /jobs/{jobId} {
  // Allow read access to everyone (even if not signed in)
  allow read: if true;
  
  // Allow write access only if the user is signed in
  allow write: if request.auth != null;
}

    
     match /jobApplications/{applicationId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    	
      match /savedJobs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}