// components/Orders.jsx
import React, { useState } from "react";
import {
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/apiSlice";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const { data: orders = [], isLoading, isError } = useGetAllOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const [detailModalId, setDetailModalId] = useState(null);
  const {
    data: detailOrder,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetOrderDetailsQuery(detailModalId, { skip: !detailModalId });
  console.log(detailOrder);

  // Status modal state
  const [statusModalId, setStatusModalId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const openDetailModal = (id) => setDetailModalId(id);
  const closeDetailModal = () => setDetailModalId(null);

  const openStatusModal = (order) => {
    setStatusModalId(order._id);
    setNewStatus(order.status);
  };

  const closeStatusModal = () => setStatusModalId(null);

  const handleConfirmStatus = async () => {
    try {
      await updateStatus({ id: statusModalId, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      closeStatusModal();
    }
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="text-center border-t border-gray-200"
            >
              <td className="px-4 py-2">{order._id}</td>
              <td className="px-4 py-2">
                {order.firstName} {order.lastName}
              </td>
              <td className="px-4 py-2">${order.totalAmount.toFixed(2)}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => openDetailModal(order._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  View
                </button>
                <button
                  onClick={() => openStatusModal(order)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Change Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail Modal */}
      {detailModalId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button
              onClick={closeDetailModal}
              className="absolute top-2 right-2 text-xl"
            >
              ×
            </button>
            {isDetailLoading && <p>Loading details...</p>}
            {isDetailError && <p>Failed to load order details.</p>}
            {detailOrder && (
              <>
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                <p>
                  <strong>Name:</strong> {detailOrder.firstName}{" "}
                  {detailOrder.lastName}
                </p>
                <p>
                  <strong>Contact:</strong> {detailOrder.contactNo}
                </p>
                <p>
                  <strong>Address:</strong> {detailOrder.address}
                  {detailOrder.apartmentNo &&
                    `, Apt ${detailOrder.apartmentNo}`}
                  , {detailOrder.city}
                </p>
                <p>
                  <strong>Payment:</strong> {detailOrder.paymentMethod}
                </p>
                <p>
                  <strong>Delivery Charge:</strong> $
                  {detailOrder.deliveryCharge.toFixed(2)}
                </p>
                <p>
                  <strong>Items:</strong>
                </p>
                <ul className="list-disc ml-6">
                  {detailOrder.items.map((it, idx) => (
                    <li key={idx} className="mb-2">
                      <img
                        src={it.productId.images[0].url}
                        alt={it.name}
                        className="w-12 h-12 inline-block mr-2"
                      />
                      {it.quantity} x {it.productId.name}{" "}
                      {it.size && `(${it.size})`}
                      {it.color && `- ${it.color}`}
                      {` - $${(it.price * it.quantity).toFixed(2)}`}
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  <strong>Total:</strong> ${detailOrder.totalAmount.toFixed(2)}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {statusModalId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full relative">
            <button
              onClick={closeStatusModal}
              className="absolute top-2 right-2 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Change Order Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-gray-200 rounded px-2 py-1 mb-4"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeStatusModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatus}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
