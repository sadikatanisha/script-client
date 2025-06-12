import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-10 px-6 md:px-10 bg-black">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 gap-6 ">
        {/* Brand Section */}
        <div>
          <h1 className="text-2xl font-bold text-white">SM CLOTHING</h1>
          <p className="text-gray-300 mt-2">
            Discover fashion that defines you.
          </p>
          <div className="flex space-x-4 mt-4 text-gray-300">
            <FaFacebookF className="cursor-pointer text-xl hover:text-gray-200" />
            <FaInstagram className="cursor-pointer text-xl hover:text-gray-200" />
            <FaTwitter className="cursor-pointer text-xl hover:text-gray-200" />
            <FaYoutube className="cursor-pointer text-xl hover:text-gray-200" />
          </div>
        </div>

        {/* Location Section */}
        <div>
          <h1 className="text-lg font-semibold mb-3 ">LOCATION</h1>
          <p className="text-gray-300 text-center lg:text-left">
            123 Fashion Street, Dhaka, Bangladesh
          </p>
        </div>

        {/* Links Section */}
        <div className="mx-auto text-center lg:text-left">
          <h1 className="text-lg font-semibold mb-3">LINKS</h1>
          <ul className="text-gray-300 space-y-2 ">
            <Link to="/">
              <li className="hover:text-gray-500 cursor-pointer mb-2">Home</li>
            </Link>
            <Link to="/shop">
              <li className="hover:text-gray-500 cursor-pointer mb-2">Shop</li>
            </Link>
            <Link to="/categories">
              <li className="hover:text-gray-500 cursor-pointer mb-2">
                Categories
              </li>
            </Link>
            <Link to="/about">
              <li className="hover:text-gray-500 cursor-pointer mb-2">About</li>
            </Link>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="mx-auto text-center lg:text-left">
          <h1 className="text-lg font-semibold mb-3">LEGAL</h1>
          <ul className="text-gray-300 space-y-2">
            <Link to="/terms-and-conditions">
              <li className="hover:text-gray-500 cursor-pointer mb-2">
                Privacy Policy
              </li>
            </Link>
            <Link to="/terms-and-conditions">
              <li className="hover:text-gray-500 cursor-pointer mb-2">
                Terms of Service
              </li>
            </Link>
            <Link to="/terms-and-conditions">
              <li className="hover:text-gray-500 cursor-pointer mb-2">
                Refund Policy
              </li>
            </Link>
          </ul>
        </div>

        {/* <div>
          <h1 className="text-lg font-semibold mb-3">HELP</h1>
          <ul className="text-gray-300 space-y-2">
            <li className="hover:text-gray-500 cursor-pointer">FAQs</li>
            <li className="hover:text-gray-500 cursor-pointer">
              Shipping Info
            </li>
            <li className="hover:text-gray-500 cursor-pointer">Returns</li>
          </ul>
        </div> */}
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-300 mt-6 border-t-1 border-gray-500 pt-4">
        &copy; {new Date().getFullYear()} SM CLOTHING. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
