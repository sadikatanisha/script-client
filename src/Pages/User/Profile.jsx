// src/Pages/User/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { useGetMydataQuery } from "../../redux/apiSlice";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const { profile, logOut, updatePassword } = useContext(AuthContext);
  const { data: userData, isLoading, isError, error } = useGetMydataQuery();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      setIsChanging(true);
      await updatePassword(currentPassword, newPassword);
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      setMessage(err.message || "Failed to update password.");
    } finally {
      setIsChanging(false);
    }
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };
  if (isLoading) {
    return <p className="text-center py-8">Loading profile…</p>;
  }
  if (isError) {
    return (
      <p className="text-center py-8 text-red-600">
        Error loading profile: {error?.data?.message || "Try again."}
      </p>
    );
  }

  const user = userData?.data || {};
  console.log("user", profile);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg">{profile?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            type="button"
            className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Log Out
          </button>
        </div>

        {/* Change Password Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          {message && (
            <p
              className={`mb-4 text-sm ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          <form className="space-y-4" onSubmit={handlePasswordChange}>
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={isChanging}
              className="w-full bg-gray-100 border text-black py-2 rounded-lg hover:bg-black hover:text-white transition disabled:opacity-50"
            >
              {isChanging ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
