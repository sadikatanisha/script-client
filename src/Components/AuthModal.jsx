// AuthModal.js
import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = ({ mode, onClose, onSwitchMode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-40">
      {mode === "login" ? (
        <LoginForm
          onClose={onClose}
          onSwitchToSignup={() => onSwitchMode("signup")}
        />
      ) : (
        <SignupForm
          onClose={onClose}
          onSwitchToLogin={() => onSwitchMode("login")}
        />
      )}
    </div>
  );
};

export default AuthModal;
