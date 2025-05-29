import React from "react";
import { useGetFeaturedProductsQuery } from "../../redux/apiSlice";
import ProductCard from "../ProductCard";

const FeaturedProducts = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetFeaturedProductsQuery();

  if (isLoading) {
    return (
      <div className="px-10 py-10 flex justify-center items-center">
        <span className="text-lg">Loading featured products…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-10 py-10 text-red-500">
        {error?.data?.message || "Failed to load featured products."}
      </div>
    );
  }

  return (
    <div className="px-10 py-10">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-tight">
        Featured Products
      </h1>

      {!products || products.length === 0 ? (
        <p className="text-gray-500">No featured products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
