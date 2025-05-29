import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { updateQuantity, removeFromCart } from "../../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  // Normalized cart state
  const cartIds = useSelector((state) => state.cart.ids) || [];
  const cartEntities = useSelector((state) => state.cart.entities) || {};

  // Build array of items
  const cartItems = cartIds.map((id) => cartEntities[id]);

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Compute total
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!cartItems.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded m-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600 mt-1">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <button
                  onClick={() => handleDecrease(item._id, item.quantity)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item._id, item.quantity)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between m-4">
              <p className="text-lg font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemove(item._id)}
                className="text-red-600 hover:text-red-800"
              >
                <IoTrashOutline size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white shadow rounded-lg p-4">
        <p className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</p>
        <Link
          to="/checkout"
          className="mt-4 sm:mt-0 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
