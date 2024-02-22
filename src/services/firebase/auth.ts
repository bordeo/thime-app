import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

// Sign Up
export const doCreateUserWithEmailAndPassword = (
  email: string,
  password: string
) => createUserWithEmailAndPassword(auth, email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Sign out
export const doSignOut = () => auth.signOut();

// Password Reset
export const doPasswordReset = (email: string) =>
  sendPasswordResetEmail(auth, email);

// Password Change
export const doPasswordUpdate = (password: string) => {
  if (auth.currentUser) {
    return updatePassword(auth.currentUser, password);
  }
};

export const getCurrentUser = () => auth.currentUser;
