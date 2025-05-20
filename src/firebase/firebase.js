import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCndmluSy4nLh-0H5vxcS2IiPp-I42ch8s",
  authDomain: "tourblog-71803.firebaseapp.com",
  projectId: "tourblog-71803",
  storageBucket: "tourblog-71803.firebasestorage.app",
  messagingSenderId: "458143811576",
  appId: "1:458143811576:web:9c4a0d4f4bd008adb0380d",
  measurementId: "G-7EE5YEXPMY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
