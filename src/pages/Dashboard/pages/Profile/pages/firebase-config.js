// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzAyRTYgtxP8oBP84Q1pEJUn9jaNtkCnU",
  authDomain: "foundation-twitter-auth.firebaseapp.com",
  projectId: "foundation-twitter-auth",
  storageBucket: "foundation-twitter-auth.appspot.com",
  messagingSenderId: "784112635351",
  appId: "1:784112635351:web:e467c990db949c7991cf92",
  measurementId: "G-0ERWS559S9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app)


