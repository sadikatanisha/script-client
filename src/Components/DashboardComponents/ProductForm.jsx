import React from "react";

const ProductForm = ({
  product,
  handleChange,
  colors,
  colorName,
  colorHex,
  setColorName,
  setColorHex,
  addColor,
  removeColor,
  sizes,
  sizeInput,
  setSizeInput,
  addSize,
  removeSize,
  files,
  getRootProps,
  getInputProps,
  removeFile,
  onSubmit,
  isLoading,
  isError,
  error,
}) => {
  return (
    <div className="">
      <form onSubmit={onSubmit} className="space-y-4 ">
        {/* Basic product fields */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
          required
        />
        {/* Slug field with suggestion */}
        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={product.slug}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
          rows="4"
          required
        ></textarea>
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={product.sku}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
          required
        />
        <input
          type="number"
          name="discountPrice"
          placeholder="Discount Price"
          value={product.discountPrice}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={product.brand}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
        />
        <input
          type="number"
          name="countInStock"
          placeholder="Count in Stock"
          value={product.countInStock}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
          required
        />
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isCustomizable"
              checked={product.isCustomizable}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Customizable</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Featured Product</span>
          </label>
        </div>
        {/* Dynamic Colors with Hex */}
        <div>
          <label className="block mb-1 font-medium">Available Colors</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Color Name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded"
            />
            <input
              type="text"
              placeholder="Hex Value (e.g., #ff0000)"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded"
            />
            <button
              onClick={addColor}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
              >
                <span>
                  {color.name} ({color.hex})
                </span>
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="ml-1 text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Dynamic Sizes */}
        <div>
          <label className="block mb-1 font-medium">Available Sizes</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter size and press Enter"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSize(e);
              }}
              className="w-full p-2 border border-gray-200 rounded"
            />
            <button
              onClick={addSize}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <div
                key={size}
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
              >
                <span>{size}</span>
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="ml-1 text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Tags Field */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={product.tags}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded"
        />
        {/* Image Upload Section */}
        <div className="border-dashed border-2 border-gray-300 p-4 rounded">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <p className="text-center text-gray-600">
              Drag & drop images here, or click to select files
            </p>
          </div>
          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {files.map((file) => (
                <div key={file.name} className="relative w-24 h-24">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="absolute top-0 right-0 bg-red-100 text-white text-xs rounded-full p-1"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
        {isError && (
          <p className="text-red-500 text-center">
            {error?.data?.message || "An error occurred."}
          </p>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
