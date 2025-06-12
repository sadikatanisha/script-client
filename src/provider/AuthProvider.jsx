import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { app } from "../firebase/firebase.config";
import axios from "axios";
import { useCreateUserInDBMutation } from "../redux/apiSlice";

export const AuthContext = createContext(null);
const auth = getAuth(app);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [createUserInDB] = useCreateUserInDBMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setFirebaseUser(user);

        // Rehydrate or fetch JWT
        let tok = localStorage.getItem("accessToken");
        if (!tok || tok === "undefined") {
          try {
            const getTokenUrl = `${
              import.meta.env.VITE_SERVER_URL
            }/api/auth/get-token`;
            const { data } = await axios.post(getTokenUrl, {
              email: user.email,
            });
            if (!data?.data?.token)
              throw new Error("Token missing in response");
            tok = data.data.token;
            localStorage.setItem("accessToken", tok);
          } catch (err) {
            console.error("Failed to get token:", err);
          }
        }
        setToken(tok);

        if (tok) {
          try {
            const profileUrl = `${import.meta.env.VITE_SERVER_URL}/api/auth/me`;
            const { data: profileResp } = await axios.get(profileUrl, {
              headers: { Authorization: `Bearer ${tok}` },
            });
            setProfile(profileResp.data);
          } catch (err) {
            console.error("Failed to fetch profile:", err);
            setProfile(null);
            setToken(null);
            localStorage.removeItem("accessToken");
          }
        }
      } else {
        setFirebaseUser(null);
        setProfile(null);
        setToken(null);
        localStorage.removeItem("accessToken");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async ({ email, password, name, contact }) => {
    await createUserInDB({ email, name, contact }).unwrap();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name, photoURL: "" });

    const getTokenUrl = `${import.meta.env.VITE_SERVER_URL}/api/auth/get-token`;
    const { data } = await axios.post(getTokenUrl, { email });
    if (!data?.data?.token) {
      throw new Error("Token missing in response");
    }
    const tok = data.data.token;
    setToken(tok);
    localStorage.setItem("accessToken", tok);

    const profileUrl = `${import.meta.env.VITE_SERVER_URL}/api/auth/me`;
    const { data: profileResp } = await axios.get(profileUrl, {
      headers: { Authorization: `Bearer ${tok}` },
    });
    setProfile(profileResp.data);
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);

    const getTokenUrl = `${import.meta.env.VITE_SERVER_URL}/api/auth/get-token`;
    const { data } = await axios.post(getTokenUrl, { email });
    if (!data?.data?.token) {
      throw new Error("Token missing in response");
    }
    const tok = data.data.token;
    setToken(tok);
    localStorage.setItem("accessToken", tok);

    const profileUrl = `${import.meta.env.VITE_SERVER_URL}/api/auth/me`;
    const { data: profileResp } = await axios.get(profileUrl, {
      headers: { Authorization: `Bearer ${tok}` },
    });
    setProfile(profileResp.data);
  };

  const logOut = () => {
    signOut(auth);
    setProfile(null);
    setToken(null);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    if (!user || !user.email) {
      throw new Error("No user logged in");
    }

    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
    await firebaseUpdatePassword(user, newPassword);
    await user.getIdToken(true);
  };

  const authInfo = {
    firebaseUser,
    profile,
    token,
    loading,
    register,
    login,
    logOut,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
      {loading && (
        <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
          <span className="sr-only">Loading...</span>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
