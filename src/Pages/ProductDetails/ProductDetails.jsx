import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // ← import useNavigate
import { useGetProductDetailsQuery } from "../../redux/apiSlice";
import { addToCart } from "../../redux/cartSlice";
import FeaturedProducts from "../../Components/HomeComponents/FeaturedProducts";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ← initialize navigate
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (product) {
      if (product.availableColors && product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0].hex);
      }
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
    }
  }, [product]);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">Error loading product</div>
    );
  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  // Helper: builds the payload object consistently
  const buildCartPayload = (product) => ({
    _id: product._id,
    name: product.name,
    image: product.images[0]?.url,
    price: product.discountPrice ?? product.price,
    quantity: 1,
    color: selectedColor,
    size: selectedSize,
  });

  const handleAddToCart = (product) => {
    const payload = buildCartPayload(product);
    dispatch(addToCart(payload));
    // No redirect here—just adds to cart
  };

  // ← NEW: “Buy Now” handler
  const handleBuyNow = (product) => {
    const payload = buildCartPayload(product);
    dispatch(addToCart(payload));

    // After adding, immediately send them to /cart (or /checkout)
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={product.images[currentImageIndex]?.url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={image.public_id}
                onClick={() => setCurrentImageIndex(index)}
                className={`shrink-0 w-20 h-20 rounded-lg border-2 ${
                  index === currentImageIndex
                    ? "border-blue-500"
                    : "border-transparent"
                } overflow-hidden`}
              >
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  {product.discountPrice ? (
                    <>
                      <span className="text-black font-bold">
                        ${product.discountPrice}
                      </span>
                      <span className="ml-2 text-gray-400 line-through">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    `$${product.price}`
                  )}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded ${
                  product.countInStock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span>Category: {product.category}</span>
              {product.brand && (
                <>
                  <span>•</span> <span>Brand: {product.brand}</span>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Color Selection */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Colors</h3>
              <div className="flex gap-2">
                {product.availableColors.map((color) => (
                  <div key={color.hex} className="flex flex-col items-center">
                    <button
                      onClick={() => setSelectedColor(color.hex)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color.hex
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                    <p className="mt-2 text-sm text-gray-500">{color.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleBuyNow(product)} // ← use the new handler
              className=" w-full bg-white border text-black py-2 rounded hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>
          </div>

          {/* Product Meta */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {product.tags?.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FeaturedProducts />
    </div>
  );
};

export default ProductDetails;
