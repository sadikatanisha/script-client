import React, { useState } from "react";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useToggleFeaturedMutation,
} from "../../../redux/apiSlice";
import UpdateForm from "../../../Components/DashboardComponents/UpdateForm";
import { FiEdit, FiTrash, FiStar, FiX } from "react-icons/fi";

const ManageProducts = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [toggleFeatured] = useToggleFeaturedMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleToggle = async (product) => {
    try {
      await toggleFeatured({
        id: product._id,
        featured: !product.featured,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateProduct({
        id: selectedProduct._id,
        formData,
      }).unwrap();
      setSelectedProduct(null);
      refetch();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        {error?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Featured
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  ৳{product.discountPrice ?? product.price}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {product.countInStock}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleToggle(product)}
                    className={`inline-flex items-center px-2 py-1 border rounded ${
                      product.featured
                        ? "bg-amber-100 border-amber-500 text-amber-700"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                  >
                    <FiStar className="w-4 h-4 mr-1" />
                    {product.featured ? "Yes" : "No"}
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Edit"
                    >
                      <FiEdit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-1 hover:bg-red-50 rounded"
                      aria-label="Delete"
                    >
                      <FiTrash className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                Edit {selectedProduct.name}
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <UpdateForm
                initialProduct={selectedProduct}
                onSubmitData={handleUpdate}
                submitButtonText="Save Changes"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
