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
    const map = {};

    for (const product of products) {
      const cat = product.category || "Uncategorized";
      if (!map[cat]) {
        map[cat] = {
          count: 0,
          img: product.images?.[0]?.url || "",
        };
      }
      map[cat].count += 1;
    }

    return Object.entries(map).map(([name, { count, img }]) => ({
      name,
      count,
      img:
        img ||
        `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`,
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
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              <img
                src={category.img}
                alt={category.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4 flex flex-col">
              <h3 className="text-lg font-medium capitalize">
                {category.name}
              </h3>
              <span className="text-sm text-gray-500">
                {category.count} item{category.count > 1 ? "s" : ""}
              </span>
              <button
                onClick={() =>
                  navigate(
                    `/shop?category=${encodeURIComponent(category.name)}`
                  )
                }
                className="mt-4 inline-block bg-black text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
              >
                View {category.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
