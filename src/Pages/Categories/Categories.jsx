import React from "react";
import { useGetAdminProductsQuery } from "../../redux/apiSlice";

const Categories = () => {
  // Fetch all products (admin view)
  const {
    data: products = [],
    isLoading,
    isError,
  } = useGetAdminProductsQuery();

  // While loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">Loading categories...</span>
      </div>
    );
  }

  // If there was an error
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-red-500">Failed to load categories.</span>
      </div>
    );
  }

  // Derive unique categories and count how many products each has
  const categoryMap = products.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += 1;
    return acc;
  }, {});

  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Shop by Category</h2>

      {categories.length === 0 ? (
        <div className="text-gray-600">No categories found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Replace the src with a real category image if available */}
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(
                    category.name
                  )}`}
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
                  onClick={() => {
                    // For example, navigate to a filtered product listing page
                    // e.g. navigate(`/products?category=${category.name}`);
                  }}
                  className="mt-4 inline-block bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View {category.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
