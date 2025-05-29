import React, { useState } from "react";
import Sidebar from "../../Components/DashboardComponents/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {/* Sidebar */}
      <Sidebar
        userRole="admin"
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="pl-16 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
