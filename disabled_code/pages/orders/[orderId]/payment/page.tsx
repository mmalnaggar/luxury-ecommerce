"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface PaymentPageProps {
  params: Promise<{ orderId: string }>;
}

interface Order {
  id: string;
  total: number;
  status: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}/confirmation`,
        },
      });

      if (submitError) {
        setError(submitError.message || "An error occurred");
        return;
      }

      toast.success("Payment successful!");
      router.push(`/orders/${orderId}/confirmation`);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderId = async () => {
      const { orderId } = await params;
      setOrderId(orderId);
    };
    getOrderId();
  }, [params]);

  useEffect(() => {
    async function fetchOrderAndCreateIntent() {
      if (!orderId) return;
      try {
        // Fetch order details
        const orderResponse = await fetch(`/api/orders/${orderId}`);
        if (!orderResponse.ok) {
          throw new Error("Failed to fetch order");
        }
        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Create payment intent
        const intentResponse = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            amount: orderData.total,
          }),
        });

        if (!intentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret } = await intentResponse.json();
        setClientSecret(clientSecret);
      } catch (error) {
        toast.error("Error initializing payment");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderAndCreateIntent();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!order || !clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="text-gray-600">Could not initialize payment</p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Payment</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 font-bold flex justify-between">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        </div>
      </div>
    </div>
  );
} 