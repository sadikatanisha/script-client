import React, { useState, useMemo } from "react";
import { useGetAdminProductsQuery } from "../../redux/apiSlice";
import ProductCard from "../ProductCard";

const HomeProducts = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetAdminProductsQuery();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const unique = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // 3) Now handle loading / error
  if (isLoading) {
    return (
      <div className="px-10 py-10 flex justify-center items-center">
        <span className="text-lg">Loading products…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-10 py-10 text-red-500">
        {error?.data?.message || "Failed to load products."}
      </div>
    );
  }

  return (
    <div className="px-10 py-10">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-tight">
        Our Products
      </h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 pb-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-sm sm:text-lg font-medium px-3 py-2 uppercase border-b-2 transition-all ${
              activeCategory === category
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:border-gray-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeProducts;
