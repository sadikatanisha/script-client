import React from "react";
import { useGetOrderHistoryQuery } from "../../redux/apiSlice";

const OrderHistory = () => {
  const { data, isLoading, isError, error } = useGetOrderHistoryQuery();
  console.log("order history", data);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        {error?.data?.message || "Failed to load order history."}
      </div>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order ID:</span>
                <span className="text-sm text-gray-600">{order._id}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Date:</span>
                <span className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Status:</span>
                <span
                  className={`text-sm font-semibold ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 px-1">Product</th>
                      <th className="py-2 px-1">Qty</th>
                      <th className="py-2 px-1">Price</th>
                      <th className="py-2 px-1">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr
                        key={item.productId._id}
                        className="border-t border-gray-300"
                      >
                        <td className="py-2 px-1">{item.productId.name}</td>
                        <td className="py-2 px-1">{item.quantity}</td>
                        <td className="py-2 px-1">${item.price.toFixed(2)}</td>
                        <td className="py-2 px-1">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end items-center">
                <span className="font-medium mr-2">Total:</span>
                <span className="text-lg font-semibold">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
