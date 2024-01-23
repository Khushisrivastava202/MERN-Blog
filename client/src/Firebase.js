// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-8c670.firebaseapp.com",
  projectId: "mern-blog-8c670",
  storageBucket: "mern-blog-8c670.appspot.com",
  messagingSenderId: "557696793943",
  appId: "1:557696793943:web:d4c3edfc45ce2cba0a1212"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);