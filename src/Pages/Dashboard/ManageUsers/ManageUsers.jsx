import React, { useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../redux/apiSlice";
import { FiEdit, FiX } from "react-icons/fi";

const ManageUsers = () => {
  // Fetch users
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllUsersQuery();
  console.log(users);

  // Mutation hook
  const [
    updateUserRole,
    { isLoading: isUpdating, isError: isUpdateError, error: updateError },
  ] = useUpdateUserRoleMutation();

  // Local state for modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
  };

  const handleUpdate = async () => {
    try {
      await updateUserRole({
        id: selectedUser._id || selectedUser.id,
        role: newRole,
      }).unwrap();
      console.log("role updated");
      setSelectedUser(null);
      refetch();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        {error?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id || user.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {user.name || "—"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {user.role}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Edit Role"
                  >
                    <FiEdit className="w-5 h-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Update Role: {selectedUser.email}
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium">Select Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              {isUpdateError && (
                <p className="text-red-500">
                  {updateError?.data?.message || updateError.message}
                </p>
              )}

              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
