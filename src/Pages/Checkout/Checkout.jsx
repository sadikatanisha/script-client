import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { IoLocationOutline, IoCardOutline } from "react-icons/io5";
import PaymentForm from "../../Components/PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Delivery rates in BDT (৳)
const DELIVERY_RATES = {
  Dhaka: 120,
  Chattogram: 100,
  Others: 150,
};

const Checkout = () => {
  // Grab cart from Redux
  const cartIds = useSelector((state) => state.cart.ids) || [];
  const cartEntities = useSelector((state) => state.cart.entities) || {};
  const cartItems = cartIds.map((id) => cartEntities[id]);

  // Sum up subtotal (main currency unit, e.g. BDT)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Customer Info State for guest
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [city, setCity] = useState("");

  // Delivery Location (default Dhaka)
  const [location, setLocation] = useState("Dhaka");

  // Calculate fees/totals
  const deliveryFee = DELIVERY_RATES[location] || DELIVERY_RATES.Others;
  const total = subtotal + deliveryFee;

  const handleLocationChange = (e) => setLocation(e.target.value);

  const [showSuccess, setShowSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    // You might also clear the cart via dispatch(clearCart()) here
  };

  const handlePaymentError = (msg) => {
    alert("Payment failed: " + msg);
  };

  // Pre-check that customer filled required fields
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
      {/* ─────────────── Left Column: Customer Info & Summary ─────────────── */}
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
            placeholder="01XXXXXXXXX"
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
            placeholder="Dhaka"
          />
        </div>

        {/* Delivery Location */}
        <div>
          <label className=" text-sm font-medium mb-1 flex items-center">
            <IoLocationOutline className="mr-2 text-xl" />
            Delivery Location
          </label>
          <select
            className="w-full border-gray-300 rounded p-2"
            value={location}
            onChange={handleLocationChange}
          >
            {Object.keys(DELIVERY_RATES).map((loc) => (
              <option key={loc} value={loc}>
                {loc} (৳ {DELIVERY_RATES[loc]})
              </option>
            ))}
          </select>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <h3 className="text-lg font-medium">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>৳ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>$ {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Validation before PaymentForm */}
        <button
          onClick={() => {
            if (!validateCustomerInfo()) return;
            // If valid, scroll to PaymentForm or highlight it
            document
              .getElementById("payment-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Proceed to Payment
        </button>
      </div>

      {/* ─────────────── Right Column: Stripe Card Payment ─────────────── */}
      <div className="bg-white shadow rounded-lg p-6" id="payment-section">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <IoCardOutline className="mr-2 text-xl" />
          Pay with Card
        </h2>

        <Elements stripe={stripePromise}>
          <PaymentForm
            cartItems={cartItems}
            currency={"usd"}
            rates={{ usd: 1 }}
            firstName={firstName}
            lastName={lastName}
            contactNo={contactNo}
            address={address}
            apartmentNo={apartmentNo}
            city={city}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;
