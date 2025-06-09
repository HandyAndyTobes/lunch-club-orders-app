
import React, { useState } from "react";
import OrderForm from "./components/OrderForm";
import { getCurrentWeek } from "./utils/weekUtils";

const PublicOrderPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-green-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Your Lunch</h1>
            <p className="text-gray-600">Place your order for today's lunch service</p>
          </div>
          {submitted && (
            <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 border border-green-200 text-center">
              Order received! Thank you.
            </div>
          )}
          <OrderForm currentWeek={getCurrentWeek()} mode="public" onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default PublicOrderPage;
