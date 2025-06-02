// src/Pages/Categories/Categories.jsx

import React, { useMemo } from "react";
import { useGetAdminProductsQuery } from "../../redux/apiSlice";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const {
    data: products = [],
    isLoading,
    isError,
  } = useGetAdminProductsQuery();

  const categories = useMemo(() => {
    if (!products.length) return [];

    const map = {};
    for (const product of products) {
      const cat = product.category || "Uncategorized";
      if (!map[cat]) {
        map[cat] = product.images?.[0]?.url || "";
      }
    }
    return Object.entries(map).map(([name, imgUrl]) => ({
      name,
      img:
        imgUrl ||
        `https://via.placeholder.com/200?text=${encodeURIComponent(name)}`,
    }));
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">Loading categories...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-red-500">Failed to load categories.</span>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-20">
        <span className="text-gray-600">No categories found.</span>
      </div>
    );
  }

  return (
    <div className="px-10 py-10">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-tight">
        Our Categories
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center space-y-4 cursor-pointer"
            onClick={() =>
              navigate(`/shop?category=${encodeURIComponent(category.name)}`)
            }
          >
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
              <img
                src={category.img}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-medium capitalize">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
