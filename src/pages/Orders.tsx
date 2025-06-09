import { useState } from "react";
import OrdersList from "@/components/OrdersList";
import NavButtons from "@/components/NavButtons";
import { getCurrentWeek, formatWeekDisplay } from "@/utils/weekUtils";
import { Users } from "lucide-react";

const Orders = () => {
  const [currentWeek] = useState(() => getCurrentWeek());
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DMT Lunch Club App</h1>
                <p className="text-sm text-gray-600">Week of {formatWeekDisplay(currentWeek)}</p>
              </div>
            </div>
            <NavButtons active="orders" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <OrdersList currentWeek={currentWeek} readOnly />
      </div>
    </div>
  );
};

export default Orders;
