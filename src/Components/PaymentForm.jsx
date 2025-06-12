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
  const [amountInCents, setAmountInCents] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError("");

    try {
      const {
        clientSecret,
        paymentIntentId,
        amountInCents: cents,
      } = await createIntent({
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        currency: currency.toLowerCase(),
        userId,
        couponCode: couponCode || null,
      }).unwrap();

      setAmountInCents(cents);

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
          price: item.price,
        })),
        totalAmount: cents / 100,
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
        className={`
          w-full py-3 rounded text-white flex items-center justify-center gap-2
          ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-white hover:text-black border"
          }
        `}
      >
        <FiCreditCard />
        {isProcessing
          ? "Processing..."
          : `Pay ${currency.toUpperCase()} $${
              amountInCents != null ? (amountInCents / 100).toFixed(2) : "..."
            }`}
      </button>
    </form>
  );
};

export default PaymentForm;
