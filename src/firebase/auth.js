import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import axios from "axios";
import { API_CONFIG } from "../config/api";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await userCredential.user.getIdToken();

  await axios.post(`${API_CONFIG.BASE_URL}/auth/register`, { token });

  return userCredential;
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await userCredential.user.getIdToken();

  await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, { token });

  return userCredential;
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const token = await userCredential.user.getIdToken();

  await axios.post(`${API_CONFIG.BASE_URL}/auth/google`, { token });

  return userCredential;
};

export const doSignOut = async () => {
  return signOut(auth);
};

export const getCurrentUserToken = async () => {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken();
};

export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

// export const doPasswordUpdate = async (password) => {
//   return updatePassword(auth, password);
// };

// export const doSendEmailVerification = async () => {
//   return sendEmailVerification(auth.currentUser, {
//     url: `${window.location.origin}/home`,
//   });
// };
