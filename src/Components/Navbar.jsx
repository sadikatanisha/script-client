import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import AuthModal from "./AuthModal";
import CartSlider from "./CartSlider";

import { AuthContext } from "../provider/AuthProvider";
import { useSelector } from "react-redux";
import PromoBar from "./HomeComponents/PromoBar";

const Navbar = () => {
  const { profile, logOut } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart);
  const totalQty = cartItems.ids.length;

  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const openAuth = (mode) => {
    setAuthMode(mode);
    setMenuOpen(false);
  };
  const closeAuth = () => setAuthMode(null);
  const switchAuthMode = (mode) => setAuthMode(mode);

  const linkClasses = ({ isActive }) =>
    `transition duration-300 hover:text-black ${
      isActive ? "border-b-2 border-black " : ""
    }`;

  const handleLogout = async () => {
    try {
      await logOut();
      setIsProfileMenuOpen(false);
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <PromoBar />

      <nav className="sticky top-0 w-full bg-white text-black border-b-2 border-gray-200 z-30 pt-10 lg:pt-14 px-6 lg:px-10 py-4 lg:py-6">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="font-extrabold">
            <NavLink to="/">
              <h1>SM CLOTHING</h1>
            </NavLink>
          </div>

          <div className="flex gap-10 items-center text-lg">
            <NavLink to="/" className={linkClasses}>
              Home
            </NavLink>
            <NavLink to="/shop" className={linkClasses}>
              All Products
            </NavLink>
            <NavLink to="/categories" className={linkClasses}>
              Categories
            </NavLink>
          </div>

          {/* Right side: Profile / Cart (desktop) */}
          <div className="flex items-center gap-4">
            {profile ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-md font-semibold uppercase"
                >
                  {profile.name.charAt(0)}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/user/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Account
                        </Link>
                      </li>
                      {profile.role === "admin" && (
                        <li>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/user/order"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-200"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => openAuth("login")}>
                <Link className=" bg-black text-white font-semibold px-8 py-3 rounded-md hover:bg-gray-200 hover:text-black transition">
                  Login
                </Link>
              </button>
            )}

            <button
              className="relative"
              onClick={() => {
                setShowCart(true);
                setMenuOpen(false);
              }}
            >
              <IoCartOutline className="text-3xl" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex lg:hidden items-center justify-between py-4">
          {/* Logo */}
          <NavLink to="/">
            <h1>SM CLOTHING</h1>
          </NavLink>

          {/* Right‐side icons */}
          <div className="flex items-center gap-4">
            {profile ? (
              <Link
                to="/user/profile"
                className="relative"
                onClick={() => setMenuOpen(false)}
              >
                <RxPerson className="text-2xl" />
              </Link>
            ) : (
              <button onClick={() => openAuth("login")}>
                <RxPerson className="text-2xl" />
              </button>
            )}

            <button
              className="relative"
              onClick={() => {
                setShowCart(true);
                setMenuOpen(false);
              }}
            >
              <IoCartOutline className="text-2xl" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>

            <div className="text-2xl cursor-pointer" onClick={toggleMenu}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>

        {/* Off-canvas Mobile Menu */}
        <div
          className={`
            fixed
            top-10           
            left-0
            w-full
            h-screen        
            bg-white
            z-40            
            transform transition-transform duration-500 lg:hidden
            ${menuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <FaTimes
              className="text-2xl cursor-pointer text-black"
              onClick={toggleMenu}
            />
          </div>

          {/* Nav links with top padding */}
          <div className="flex flex-col items-center space-y-6 pt-16 pb-6 text-lg">
            {[
              { label: "Home", to: "/" },
              { label: "All Products", to: "/shop" },
              { label: "Categories", to: "/categories" },
            ].map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `hover:text-black ${isActive ? "border-b-2 font-bold " : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {showCart && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setShowCart(false)}
          />
        )}
        <CartSlider isOpen={showCart} onClose={() => setShowCart(false)} />

        {/* Auth modal */}
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={closeAuth}
            onSwitchMode={switchAuthMode}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
