import React, { useState } from "react";
import {
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useCreateCouponMutation,
} from "../../../redux/apiSlice";
import { format } from "date-fns";

const Discounts = () => {
  const { data: coupons = [], isLoading, isError } = useGetAllCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxDiscountAmount: "",
    usageLimit: "",
    perUserLimit: "",
    expirationDate: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload with correct field names and types
    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minPurchase:
        form.minPurchase !== "" ? Number(form.minPurchase) : undefined,
      maxDiscountAmount:
        form.maxDiscountAmount !== ""
          ? Number(form.maxDiscountAmount)
          : undefined,
      usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : undefined,
      perUserLimit:
        form.perUserLimit !== "" ? Number(form.perUserLimit) : undefined,
      expirationDate: form.expirationDate || undefined,
      active: form.active,
    };

    try {
      await createCoupon(payload).unwrap();
      // Reset form after successful creation
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minPurchase: "",
        maxDiscountAmount: "",
        usageLimit: "",
        perUserLimit: "",
        expirationDate: "",
        active: true,
      });
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await deleteCoupon(id).unwrap();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Coupons</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-lg shadow"
        >
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Code *</label>
            <input
              type="text"
              name="code"
              placeholder="e.g. SAVE20"
              value={form.code}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Discount Type */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              Discount Type *
            </label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              Discount Value *
            </label>
            <input
              type="number"
              name="discountValue"
              placeholder={
                form.discountType === "percentage" ? "e.g. 20" : "e.g. 10.00"
              }
              value={form.discountValue}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0"
              required
            />
          </div>

          {/* Minimum Purchase */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              Min Purchase (Optional)
            </label>
            <input
              type="number"
              name="minPurchase"
              placeholder="e.g. 100"
              value={form.minPurchase}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0"
            />
          </div>

          {/* Max Discount Amount */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              Max Discount Amount (Optional)
            </label>
            <input
              type="number"
              name="maxDiscountAmount"
              placeholder="e.g. 50"
              value={form.maxDiscountAmount}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0"
            />
          </div>

          {/* Usage Limit */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              Usage Limit (Global)
            </label>
            <input
              type="number"
              name="usageLimit"
              placeholder="e.g. 100"
              value={form.usageLimit}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0"
            />
          </div>

          {/* Per‐User Limit */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              Per‐User Limit
            </label>
            <input
              type="number"
              name="perUserLimit"
              placeholder="e.g. 1"
              value={form.perUserLimit}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0"
            />
          </div>

          {/* Expiration Date */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              Expiration Date *
            </label>
            <input
              type="date"
              name="expirationDate"
              value={form.expirationDate}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Active Toggle */}
          <div className="col-span-1 flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <label className="text-sm font-medium">Active</label>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isCreating ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>

        {/* ==== Coupons Table ==== */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {isLoading ? (
            <p className="p-6 text-center">Loading coupons...</p>
          ) : isError ? (
            <p className="p-6 text-center text-red-600">Failed to load.</p>
          ) : (
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Value</th>
                  <th className="px-6 py-3 text-left">Min Purchase</th>
                  <th className="px-6 py-3 text-left">Max Discount</th>
                  <th className="px-6 py-3 text-left">Usage Limit</th>
                  <th className="px-6 py-3 text-left">Per‐User Limit</th>
                  <th className="px-6 py-3 text-left">Expires</th>
                  <th className="px-6 py-3 text-left">Active</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} className="border-t border-gray-200">
                    <td className="px-6 py-4 font-medium">{c.code}</td>
                    <td className="px-6 py-4">{c.discountType}</td>
                    <td className="px-6 py-4">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `৳ ${c.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                      {c.minPurchase != null ? `৳ ${c.minPurchase}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {c.maxDiscountAmount != null
                        ? `৳ ${c.maxDiscountAmount}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {c.usageLimit != null ? c.usageLimit : "∞"}
                    </td>
                    <td className="px-6 py-4">
                      {c.perUserLimit != null ? c.perUserLimit : "1"}
                    </td>
                    <td className="px-6 py-4">
                      {c.expirationDate
                        ? format(new Date(c.expirationDate), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td className="px-6 py-4">{c.active ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">
                      {format(new Date(c.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discounts;
