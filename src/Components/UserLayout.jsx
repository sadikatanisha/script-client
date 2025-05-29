// src/Components/UserLayout.jsx
import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-100 border-r border-gray-300 p-6">
        <h2 className="text-xl font-semibold mb-6">User Menu</h2>
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `py-2 px-3 rounded-md transition ${
                isActive
                  ? "bg-white shadow font-semibold"
                  : "text-gray-700 hover:bg-white hover:shadow"
              }`
            }
          >
            My Profile
          </NavLink>

          <NavLink
            to="order"
            className={({ isActive }) =>
              `py-2 px-3 rounded-md transition ${
                isActive
                  ? "bg-white shadow font-semibold"
                  : "text-gray-700 hover:bg-white hover:shadow"
              }`
            }
          >
            My Orders
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
