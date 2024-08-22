// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO_xi6srxkw3sQDCSFG0IDBmuW53ZRt3s",
  authDomain: "chat-support-id.firebaseapp.com",
  projectId: "chat-support-id",
  storageBucket: "chat-support-id.appspot.com",
  messagingSenderId: "369769897194",
  appId: "1:369769897194:web:38faaef2eb6ed100ef4b93"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };