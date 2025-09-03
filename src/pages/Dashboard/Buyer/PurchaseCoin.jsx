// src/pages/Dashboard/Buyer/PurchaseCoin.jsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';  // React Router v6: useNavigate

// Initialize Stripe with your public key
const stripePromise = loadStripe('your-stripe-public-key'); // Replace with your Stripe public key

// Define available plans
const plans = [
  { coins: 10, price: 1, planId: 'plan_10coins' },
  { coins: 150, price: 10, planId: 'plan_150coins' },
  { coins: 500, price: 20, planId: 'plan_500coins' },
  { coins: 1000, price: 35, planId: 'plan_1000coins' },
];

function PurchaseCoin() {
  const navigate = useNavigate();  // useNavigate for navigation

  // Handle the payment logic
  const handlePayment = async (plan) => {
    const stripe = await stripePromise;

    // Call the backend to create the Checkout session and get the session ID
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: plan.planId, price: plan.price }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

    if (error) {
      console.error("Error during Stripe Checkout", error);
    } else {
      // After successful payment, navigate to success or dashboard
      navigate('/dashboard');  // Or '/success' depending on your logic
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Purchase Coins</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.planId} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer" onClick={() => handlePayment(plan)}>
            <h3 className="text-xl font-semibold text-gray-800">{plan.coins} Coins</h3>
            <p className="text-gray-600">= ${plan.price}</p>
            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PurchaseCoin;
