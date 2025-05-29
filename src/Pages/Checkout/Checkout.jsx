import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  IoLocationOutline,
  IoCashOutline,
  IoCardOutline,
} from "react-icons/io5";
import { useCreateOrderMutation } from "../../redux/apiSlice";

const DELIVERY_RATES = {
  Dhaka: 120,
  Chattogram: 100,
  Others: 150,
};

const Checkout = () => {
  const dispatch = useDispatch();
  const [
    createOrder,
    {
      isLoading: isCreating,
      isError: orderError,
      error: orderErrorObj,
      isSuccess: orderSuccess,
    },
  ] = useCreateOrderMutation();

  const cartIds = useSelector((state) => state.cart.ids) || [];
  const cartEntities = useSelector((state) => state.cart.entities) || {};
  const cartItems = cartIds.map((id) => cartEntities[id]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Customer Info State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [city, setCity] = useState("");

  // Delivery & Payment State
  const [location, setLocation] = useState("Dhaka");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const deliveryFee = DELIVERY_RATES[location] || DELIVERY_RATES.Others;
  const total = subtotal + deliveryFee;

  const handleLocationChange = (e) => setLocation(e.target.value);
  const handlePaymentChange = (e) => setPaymentMethod(e.target.value);

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!firstName || !lastName || !contactNo || !address || !city) {
      alert("Please fill out all required customer information.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderPayload = {
      firstName,
      lastName,
      contactNo,
      address,
      apartmentNo: apartmentNo || undefined,
      city,
      items: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryCharge: deliveryFee,
      totalAmount: total,
      paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
    };

    try {
      await createOrder(orderPayload).unwrap();
      alert("Order placed successfully!");
      // Optionally clear cart: dispatch(clearCart());
    } catch (err) {
      console.error("Error placing order:", err);
      alert(err.data?.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Customer + Billing & Payment Form */}
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
              required
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
              required
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
            required
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
            required
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
            required
          />
        </div>

        {/* Delivery Location */}
        <div>
          <label className="block text-sm font-medium mb-1 items-center">
            <IoLocationOutline className="mr-2 text-xl inline-block" /> Delivery
            Location
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

        {/* Payment Method */}
        <div>
          <h3 className="text-xl font-medium mb-2">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={handlePaymentChange}
                className="form-radio"
              />
              <IoCashOutline className="ml-2 text-2xl" />
              <span className="ml-2">Cash on Delivery</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={handlePaymentChange}
                className="form-radio"
              />
              <IoCardOutline className="ml-2 text-2xl" />
              <span className="ml-2">Card Payment</span>
            </label>
          </div>
        </div>

        <button
          disabled={isCreating}
          onClick={handlePlaceOrder}
          className={`w-full text-white py-3 rounded-lg transition ${
            isCreating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isCreating ? "Placing Order..." : "Place Order"}
        </button>

        {orderError && (
          <p className="text-red-500 mt-2">
            {orderErrorObj?.data?.message || "Failed to place order."}
          </p>
        )}
        {orderSuccess && (
          <p className="text-green-600 mt-2">Order placed successfully!</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <div className="space-y-4 max-h-64 overflow-auto">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>৳ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>৳ {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>৳ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
