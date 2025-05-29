import React, { useState, useEffect } from "react";
import { useCreateProductMutation } from "../../../redux/apiSlice";
import { useDropzone } from "react-dropzone";
import ProductForm from "../../../Components/DashboardComponents/ProductForm";

// Helper function to generate a slug from the product name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

const AddProduct = () => {
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
    availableColors: "",
    availableSizes: "",
    tags: "",
  });

  // useDropzone for image uploads
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const mapped = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      // append to existing files instead of overwriting
      setFiles((prev) => [...prev, ...mapped]);
    },
  });

  const [createProduct, { isLoading, isError, error }] =
    useCreateProductMutation();

  // Local states for dynamic color and size inputs
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [colors, setColors] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (product.name && !product.slug) {
      setProduct((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  }, [product.name, product.slug]);

  const addColor = (e) => {
    e.preventDefault();
    if (
      colorName.trim() &&
      colorHex.trim() &&
      !colors.some(
        (color) =>
          color.name.toLowerCase() === colorName.trim().toLowerCase() &&
          color.hex.toLowerCase() === colorHex.trim().toLowerCase()
      )
    ) {
      setColors([...colors, { name: colorName.trim(), hex: colorHex.trim() }]);
      setColorName("");
      setColorHex("");
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(
      colors.filter(
        (color) =>
          !(
            color.name === colorToRemove.name && color.hex === colorToRemove.hex
          )
      )
    );
  };

  const addSize = (e) => {
    e.preventDefault();
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const removeSize = (size) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const removeFile = (fileName) => {
    setFiles((currFiles) => currFiles.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      availableColors: JSON.stringify(colors),
      availableSizes: sizes.join(","),
    };

    const formData = new FormData();
    Object.entries(updatedProduct).forEach(([key, value]) => {
      formData.append(key, value);
    });
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await createProduct(formData).unwrap();
      console.log("Product submitted:", updatedProduct);
      setProduct({
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
        availableColors: "",
        availableSizes: "",
        tags: "",
      });
      setFiles([]);
      setColors([]);
      setSizes([]);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Add New Product
        </h2>
        <ProductForm
          product={product}
          handleChange={handleChange}
          colors={colors}
          colorName={colorName}
          colorHex={colorHex}
          setColorName={setColorName}
          setColorHex={setColorHex}
          addColor={addColor}
          removeColor={removeColor}
          sizes={sizes}
          sizeInput={sizeInput}
          setSizeInput={setSizeInput}
          addSize={addSize}
          removeSize={removeSize}
          files={files}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          removeFile={removeFile}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
};

export default AddProduct;
