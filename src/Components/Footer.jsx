import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-10 px-6 md:px-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Brand Section */}
        <div>
          <h1 className="text-2xl font-bold">SM CLOTHING</h1>
          <p className="text-gray-700 mt-2">
            Discover fashion that defines you.
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="cursor-pointer text-xl hover:text-gray-500" />
            <FaInstagram className="cursor-pointer text-xl hover:text-gray-500" />
            <FaTwitter className="cursor-pointer text-xl hover:text-gray-500" />
            <FaYoutube className="cursor-pointer text-xl hover:text-gray-500" />
          </div>
        </div>

        {/* Location Section */}
        <div>
          <h1 className="text-lg font-semibold mb-3">LOCATION</h1>
          <p className="text-gray-700">123 Fashion Street, Dhaka, Bangladesh</p>
        </div>

        {/* Links Section */}
        <div>
          <h1 className="text-lg font-semibold mb-3">LINKS</h1>
          <ul className="text-gray-700 space-y-2">
            <li className="hover:text-gray-500 cursor-pointer">Home</li>
            <li className="hover:text-gray-500 cursor-pointer">Shop</li>
            <li className="hover:text-gray-500 cursor-pointer">Collections</li>
            <li className="hover:text-gray-500 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h1 className="text-lg font-semibold mb-3">LEGAL</h1>
          <ul className="text-gray-700 space-y-2">
            <li className="hover:text-gray-500 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-gray-500 cursor-pointer">
              Terms of Service
            </li>
            <li className="hover:text-gray-500 cursor-pointer">
              Refund Policy
            </li>
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h1 className="text-lg font-semibold mb-3">HELP</h1>
          <ul className="text-gray-700 space-y-2">
            <li className="hover:text-gray-500 cursor-pointer">FAQs</li>
            <li className="hover:text-gray-500 cursor-pointer">
              Shipping Info
            </li>
            <li className="hover:text-gray-500 cursor-pointer">Returns</li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 mt-6 border-t border-gray-600 pt-4">
        &copy; {new Date().getFullYear()} SM CLOTHING. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
