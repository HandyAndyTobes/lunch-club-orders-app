
import React from "react";
import OrderForm from "./OrderForm";

const PublicOrderPage = () => {
  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Order Your Lunch</h1>
      <OrderForm currentWeek={new Date().toISOString().slice(0, 10)} mode="public" />
    </div>
  );
};

export default PublicOrderPage;
