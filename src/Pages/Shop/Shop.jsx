import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useGetAdminProductsQuery } from "../../redux/apiSlice";
import ProductCard from "../../Components/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { data: products, isLoading } = useGetAdminProductsQuery();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const filteredProducts = products?.filter((product) => {
    return (
      (selectedCategory ? product.category === selectedCategory : true) &&
      (selectedColor
        ? product.availableColors?.some((color) => color.name === selectedColor)
        : true) &&
      (selectedSize ? product.availableSizes?.includes(selectedSize) : true)
    );
  });

  const sortedProducts = filteredProducts?.slice().sort((a, b) => {
    if (sortOption === "priceLowHigh") {
      return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
    }
    if (sortOption === "priceHighLow") {
      return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
    }
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {/* Filters */}
      <div className="md:col-span-1 space-y-6">
        <h2 className="text-xl font-semibold">Filters</h2>

        {/* Category Filter */}
        <div>
          <label className="font-medium">Category</label>
          <select
            className="w-full mt-1 p-2 border border-gray-100 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(products?.map((p) => p.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Color Filter */}
        <div>
          <label className="font-medium">Color</label>
          <select
            className="w-full mt-1 p-2 border border-gray-100 rounded"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">All</option>
            {[
              ...new Set(
                products?.flatMap((p) => p.availableColors?.map((c) => c.name))
              ),
            ].map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="font-medium">Size</label>
          <select
            className="w-full mt-1 p-2 border border-gray-100 rounded"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(products?.flatMap((p) => p.availableSizes ?? []))].map(
              (size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              )
            )}
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label className="font-medium">Sort By</label>
          <select
            className="w-full mt-1 p-2 border border-gray-100 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="md:col-span-3">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : sortedProducts?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default Shop;
