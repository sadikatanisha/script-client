import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const UpdateForm = ({
  initialProduct = {},
  onSubmitData,
  submitButtonText,
}) => {
  // Core product fields
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    sku: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    countInStock: "",
    isCustomizable: false,
    featured: false,
    tags: "",
    ...initialProduct,
  });

  // Separate state for existing vs new images
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  // Colors & Sizes
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [colors, setColors] = useState(initialProduct.availableColors || []);
  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState(initialProduct.availableSizes || []);

  // Populate initial images
  useEffect(() => {
    if (initialProduct.images) {
      setExistingImages(
        initialProduct.images.map((img, idx) => ({
          // use img.id if available, else fallback to URL
          id: img.id || img.url || idx,
          url: img.url,
        }))
      );
    }
  }, [initialProduct.images]);

  // Sync product when initialProduct changes
  useEffect(() => {
    setProduct((prev) => ({ ...prev, ...initialProduct }));
    setColors(initialProduct.availableColors || []);
    setSizes(initialProduct.availableSizes || []);
  }, [initialProduct]);

  // Auto-generate slug
  useEffect(() => {
    if (product.name && !product.slug) {
      setProduct((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  }, [product.name, product.slug]);

  // Dropzone: append new files
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (accepted) => {
      const mapped = accepted.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setNewFiles((prev) => [...prev, ...mapped]);
    },
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Color handlers
  const addColor = (e) => {
    e.preventDefault();
    const name = colorName.trim();
    const hex = colorHex.trim();
    if (
      name &&
      hex &&
      !colors.some(
        (c) =>
          c.name.toLowerCase() === name.toLowerCase() &&
          c.hex.toLowerCase() === hex.toLowerCase()
      )
    ) {
      setColors((prev) => [...prev, { name, hex }]);
      setColorName("");
      setColorHex("");
    }
  };
  const removeColor = (c) => setColors((prev) => prev.filter((x) => x !== c));

  // Size handlers
  const addSize = (e) => {
    e.preventDefault();
    const s = sizeInput.trim();
    if (s && !sizes.includes(s)) {
      setSizes((prev) => [...prev, s]);
      setSizeInput("");
    }
  };
  const removeSize = (s) => setSizes((prev) => prev.filter((x) => x !== s));

  // Remove image handlers
  const removeExisting = (id) =>
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  const removeNew = (name) =>
    setNewFiles((prev) => prev.filter((file) => file.name !== name));

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...product,
      availableColors: JSON.stringify(colors),
      availableSizes: sizes.join(","),
    };
    const formData = new FormData();
    Object.entries(updated).forEach(([key, val]) => {
      // only send real values
      if (val != null && val !== "") {
        formData.append(key, val);
      }
    });
    // Include existing image IDs or URLs
    existingImages.forEach((img) => {
      formData.append("existingImages", img.id);
    });
    // Include only new files
    newFiles.forEach((file) => {
      formData.append("images", file);
    });
    onSubmitData(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* TEXT FIELDS */}
      <input
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-200 rounded"
        required
      />
      <input
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
        rows={4}
        required
      />
      <input
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
        name="category"
        placeholder="Category"
        value={product.category}
        onChange={handleChange}
        className="w-full p-2 border border-gray-200 rounded"
        required
      />
      <input
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
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isCustomizable"
            checked={product.isCustomizable}
            onChange={handleChange}
          />{" "}
          Customizable
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={product.featured}
            onChange={handleChange}
          />{" "}
          Featured
        </label>
      </div>

      {/* COLORS */}
      <div>
        <label>Available Colors</label>
        <div className="flex gap-2">
          <input
            placeholder="Color Name"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="p-2 border border-gray-200 rounded"
          />
          <input
            placeholder="Hex (e.g. #ff0000)"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="p-2 border border-gray-200 rounded"
          />
          <button
            onClick={addColor}
            className="px-4 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {colors.map((c, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-200 rounded-full flex items-center"
            >
              {c.name} ({c.hex})
              <button
                onClick={() => removeColor(c)}
                className="ml-1 text-red-500"
              >
                ✖
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SIZES */}
      <div>
        <label>Available Sizes</label>
        <div className="flex gap-2">
          <input
            placeholder="Enter size"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSize(e)}
            className="p-2 border border-gray-200 rounded"
          />
          <button
            onClick={addSize}
            className="px-4 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {sizes.map((s) => (
            <span
              key={s}
              className="px-3 py-1 bg-gray-200 rounded-full flex items-center"
            >
              {s}
              <button
                onClick={() => removeSize(s)}
                className="ml-1 text-red-500"
              >
                ✖
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* TAGS */}
      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={product.tags}
        onChange={handleChange}
        className="w-full p-2 border border-gray-200 rounded"
      />

      {/* IMAGE PREVIEWS */}
      <div className="mt-4 flex flex-wrap gap-4">
        {existingImages.map((img) => (
          <div key={img.id} className="relative w-24 h-24">
            <img
              src={img.url}
              alt="Existing"
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeExisting(img.id)}
              className="absolute top-0 right-0 bg-red-100 text-white text-xs rounded-full p-1"
            >
              ✖
            </button>
          </div>
        ))}
        {newFiles.map((file) => (
          <div key={file.name} className="relative w-24 h-24">
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeNew(file.name)}
              className="absolute top-0 right-0 bg-red-100 text-white text-xs rounded-full p-1 "
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className="border-2  border-gray-400 border-dashed p-4 rounded cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-center">
          Drag & drop images here, or click to select files
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default UpdateForm;
