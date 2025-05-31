import React from "react";
import { addToCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    const payload = {
      _id: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.discountPrice ?? product.price,
      quantity: 1,
    };
    dispatch(addToCart(payload));
  };
  return (
    <div
      key={product._id}
      className="bg-white rounded-lg overflow-hidden  transition flex flex-col"
    >
      {/* Image: taller than wide */}
      <div className="w-full h-96 overflow-hidden">
        <img
          src={product.images?.[0]?.url || ""}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x600?text=No+Image";
          }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 p-2 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
          <p className="text-lg font-medium text-gray-700 mb-2">
            ৳ {product.price}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/shop/${product._id}`}
            className="w-full text-center py-2 border border-black text-black rounded-full hover:bg-black hover:text-white transition"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            className="w-full text-center py-2 bg-black text-white rounded-full hover:bg-black transition"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
