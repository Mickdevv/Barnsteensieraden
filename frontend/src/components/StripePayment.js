import React, { useState } from "react";
import { useStripe, useElements, IdealBankElement } from "@stripe/react-stripe-js";
import { Button, Form } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";

function StripePayment({ amount, currency, clientSecret, onSuccess, customerName }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or elements not loaded");
      return;
    }

    setLoading(true);

    const idealBank = elements.getElement(IdealBankElement);

    try {
      // Confirm Ideal payment
      const { paymentIntent, error } = await stripe.confirmIdealPayment(
        clientSecret,
        {
          payment_method: {
            ideal: idealBank,
            billing_details: {
              name: customerName || 'Customer Name', // Use passed customerName or fallback
            },
          },
          return_url: window.location.href,
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
        setError(error.message);
        setLoading(false);
        return;
      }

      // Check payment intent status
      if (paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded:", paymentIntent);
        setTimeout(() => {
          
        }, 5000);
        onSuccess(paymentIntent);
      } else {
        console.error("Payment failed:", paymentIntent.status);
        setError("Payment failed.");
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Message variant="danger">{error}</Message>}
      <IdealBankElement className="my-3" />
      <Button type="submit" disabled={!stripe || loading} className="btn-primary">
        {loading ? <Loader /> : `Pay ${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`}
      </Button>
    </Form>
  );
}

export default StripePayment;
