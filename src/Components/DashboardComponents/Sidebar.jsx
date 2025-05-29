import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiBarChart } from "react-icons/fi";
import { CiSettings, CiMedal, CiBoxList, CiCirclePlus } from "react-icons/ci";
import { SlHome } from "react-icons/sl";
import { GoHistory } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";
import { PiConfetti } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import { BsBox } from "react-icons/bs";
import { BiArrowBack, BiCaretRightSquare } from "react-icons/bi";

const sidebarMenu = {
  admin: [
    {
      name: "Add Product",
      path: "/dashboard/add-product",
      icon: <CiCirclePlus />,
    },
    {
      name: "Discounts",
      path: "/dashboard/manage-discounts",
      icon: <PiConfetti />,
    },
    {
      name: "Manage Users",
      path: "/dashboard/manage-users",
      icon: <IoPersonOutline />,
    },
    {
      name: "Manage Products",
      path: "/dashboard/manage-products",
      icon: <AiOutlineProduct />,
    },
    { name: "Manage Orders", path: "manage-orders", icon: <BsBox /> },
    {
      name: "Manage Content",
      path: "/dashboard/manage-content",
      icon: <BiCaretRightSquare />,
    },
    {
      name: "Back To Home",
      path: "/",
      icon: <BiArrowBack />,
    },
  ],
};

const Sidebar = ({ userRole, mobileOpen, handleDrawerToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const menuItems = sidebarMenu[userRole] || [];

  return (
    <div
      className={`fixed h-full bg-gray-800 text-white transition-all duration-300 ${
        isExpanded ? "w-60" : "w-16"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        {isExpanded && <h1 className="text-xl font-bold">E-Shop</h1>}
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-xl">
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={index}
              to={`${item.path}`}
              className={`flex items-center gap-3 px-4 py-3 my-1 mx-2 rounded-lg transition duration-200 ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-gray-700"
              }`}
              onClick={handleDrawerToggle}
            >
              <span className="text-lg">{item.icon}</span>
              {isExpanded && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
