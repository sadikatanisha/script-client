// src/components/PromoBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useGetActiveCouponQuery } from "../../redux/apiSlice";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhoneAlt,
} from "react-icons/fa";

const PromoBar = () => {
  const { data: coupons = [], isLoading, isError } = useGetActiveCouponQuery();
  const activeCoupon =
    Array.isArray(coupons) && coupons.length > 0 ? coupons[0] : null;

  const [visible, setVisible] = useState(true);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY.current && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 12s linear infinite;
          }
        `}
      </style>

      <div
        className={`
          fixed top-0 left-0 w-full z-50 transform transition-transform duration-500
          ${visible ? "translate-y-0" : "-translate-y-full h-40px"}
        `}
      >
        <div className="bg-black text-white text-md tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
            {/* Left side: moving text */}
            <div className="overflow-hidden w-full md:w-1/2">
              {isLoading ? (
                <span className="marquee">Loading promo…</span>
              ) : isError ? (
                <span className="marquee">Error loading promo.</span>
              ) : activeCoupon ? (
                <div className="marquee flex items-center space-x-2">
                  <span>🎉 Use code</span>
                  <span className="font-semibold uppercase">
                    {activeCoupon.code}
                  </span>
                  <span>
                    for{" "}
                    {activeCoupon.discountType === "percentage"
                      ? `${activeCoupon.discountValue}% off`
                      : `৳${activeCoupon.discountValue}`}
                    !
                  </span>
                  <Link
                    to="/shop"
                    className="underline hover:text-blue-300 whitespace-nowrap"
                  >
                    Shop now
                  </Link>
                </div>
              ) : (
                <div className="marquee flex items-center space-x-2">
                  <FaPhoneAlt className="inline-block" />
                  <span>Call us: +1 (234) 567-890</span>
                </div>
              )}
            </div>

            {!activeCoupon && !isLoading && !isError && (
              <div className="hidden md:flex items-center space-x-4">
                <span>Follow us:</span>
                <a
                  href="https://facebook.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://twitter.com/yourhandle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://instagram.com/yourhandle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300"
                >
                  <FaInstagram />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoBar;
