import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { IoCardOutline } from "react-icons/io5";
import PaymentForm from "../../Components/PaymentForm";
import { AuthContext } from "../../provider/AuthProvider";
import { clearCart } from "../../redux/cartSlice";
import { useApplyCouponMutation } from "../../redux/apiSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const dispatch = useDispatch();
  const { profile } = useContext(AuthContext);
  const userId = profile?._id || null;

  const cartIds = useSelector((state) => state.cart.ids) || [];
  const cartEntities = useSelector((state) => state.cart.entities) || {};
  const cartItems = cartIds.map((id) => cartEntities[id] || {});

  // 1) Compute raw USD subtotal
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  // 2) Local state for shipping/info & coupon
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [city, setCity] = useState("");
  const [couponCode, setCouponCode] = useState("");

  // 3) Coupon-related state
  const [applyCoupon] = useApplyCouponMutation();
  const [couponError, setCouponError] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(rawSubtotal);

  // 4) Payment success flag
  const [showSuccess, setShowSuccess] = useState(false);

  // 5) Handler: Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      const { discount: d, finalTotal: ft } = await applyCoupon({
        code: couponCode,
        subtotal: rawSubtotal,
        userId,
      }).unwrap();
      setDiscount(d);
      setFinalTotal(ft);
      setCouponError(null);
    } catch (err) {
      setCouponError(err.data?.message || "Failed to validate coupon.");
      setDiscount(0);
      setFinalTotal(rawSubtotal);
    }
  };

  // 6) After payment is confirmed
  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    dispatch(clearCart());
  };

  const handlePaymentError = (msg) => {
    alert("Payment failed: " + msg);
  };

  // 7) Validate shipping info before proceeding to payment
  const validateCustomerInfo = () => {
    if (!firstName || !lastName || !contactNo || !address || !city) {
      alert("Please fill out all required customer information.");
      return false;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return false;
    }
    return true;
  };

  // 8) If payment succeeded, show thank-you screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white border rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Thank you!</h2>
          <p>Your payment was successful and your order has been placed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ─────────── Left Column: Shipping & Coupon ─────────── */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Customer Information</h2>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border-gray-300 rounded p-2"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border-gray-300 rounded p-2"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Number<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            className="w-full border-gray-300 rounded p-2"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Address & Apartment */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Address<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border-gray-300 rounded p-2"
            placeholder="123 Main Street"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Apartment / Suite (optional)
          </label>
          <input
            type="text"
            value={apartmentNo}
            onChange={(e) => setApartmentNo(e.target.value)}
            className="w-full border-gray-300 rounded p-2"
            placeholder="Apt 4B"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">
            City<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border-gray-300 rounded p-2"
            placeholder="New York"
          />
        </div>

        {/* Coupon Code */}
        <div className="space-y-1">
          <label className="block text-sm font-medium mb-1">Coupon Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border-gray-300 rounded p-2"
              placeholder="Enter coupon code"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <h3 className="text-lg font-medium">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          {/* Show discount if applied */}
          {discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Proceed to Payment */}
        <button
          onClick={() => {
            if (!validateCustomerInfo()) return;
            document
              .getElementById("payment-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Proceed to Payment
        </button>
      </div>

      {/* ─────── Right Column: Stripe Card Payment ─────── */}
      <div className="bg-white shadow rounded-lg p-6" id="payment-section">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <IoCardOutline className="mr-2 text-xl" />
          Pay with Card
        </h2>

        <Elements stripe={stripePromise}>
          <PaymentForm
            userId={userId}
            cartItems={cartItems}
            currency={"usd"}
            rates={{ usd: 1 }}
            firstName={firstName}
            lastName={lastName}
            contactNo={contactNo}
            address={address}
            apartmentNo={apartmentNo}
            city={city}
            couponCode={couponCode}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;
