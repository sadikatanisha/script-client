import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FiCreditCard } from "react-icons/fi";
import {
  useCreatePaymentIntentMutation,
  useSaveOrderMutation,
} from "../redux/apiSlice";

const PaymentForm = ({
  userId,
  cartItems,
  currency,
  rates,
  firstName,
  lastName,
  contactNo,
  address,
  apartmentNo,
  city,
  couponCode,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [createIntent] = useCreatePaymentIntentMutation();
  const [saveOrder] = useSaveOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  // Calculate raw USD subtotal for display; backend will re‐validate coupon
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.discountPrice || item.price) || 0;
    return sum + price * (item.quantity || 0) * rates[currency];
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError("");

    try {
      const { clientSecret, paymentIntentId } = await createIntent({
        items: cartItems.map((item) => ({
          price: parseFloat(item.discountPrice || item.price) * rates[currency],
          quantity: item.quantity,
          productId: item._id,
        })),
        currency: currency.toLowerCase(),
        userId: userId,
        couponCode: couponCode || null,
      }).unwrap();

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (error) {
        setCardError(error.message);
        onError(error.message);
        setIsProcessing(false);
        return;
      }
      if (paymentIntent?.status !== "succeeded") {
        throw new Error("Payment failed");
      }

      await saveOrder({
        userId,
        firstName,
        lastName,
        contactNo,
        address,
        apartmentNo: apartmentNo || undefined,
        city,
        couponCode: couponCode || undefined,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: parseFloat(item.discountPrice || item.price) * rates[currency],
        })),
        totalAmount,
        paymentIntentId,
      }).unwrap();

      onSuccess();
    } catch (err) {
      const msg = err.data?.message || err.message || "Payment error";
      setCardError(msg);
      onError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: { fontSize: "14px", color: "#111" },
      invalid: { color: "#e53e3e" },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded">
        <label className="block text-xs mb-1">Card Number</label>
        <CardNumberElement
          options={elementOptions}
          className="p-2 rounded w-full"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1 p-3 border rounded">
          <label className="block text-xs mb-1">Expiry</label>
          <CardExpiryElement
            options={elementOptions}
            className="p-2 rounded w-full"
          />
        </div>
        <div className="flex-1 p-3 border rounded">
          <label className="block text-xs mb-1">CVC</label>
          <CardCvcElement
            options={elementOptions}
            className="p-2 rounded w-full"
          />
        </div>
      </div>
      {cardError && <p className="text-red-500 text-xs">{cardError}</p>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 rounded text-white ${
          isProcessing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-white hover:text-black border"
        } flex items-center justify-center gap-2`}
      >
        <FiCreditCard />
        {isProcessing
          ? "Processing..."
          : `Pay ${currency.toUpperCase()} ${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
