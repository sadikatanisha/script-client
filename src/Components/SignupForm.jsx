// SignupForm.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";

const SignupForm = ({ onClose, onSwitchToLogin }) => {
  const { register, loading } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register({ name, email, password, contact });
      toast.success("Signup successful!", {
        onClose: () => onClose(),
        autoClose: 1500,
      });
    } catch (err) {
      console.error("Signup failed:", err);
      const msg = err.message || "Signup failed. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black border-2 transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center">
        Already have an account?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={onSwitchToLogin}
        >
          Log In
        </button>
      </div>

      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        ✖
      </button>
    </div>
  );
};

export default SignupForm;
