
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, PoundSterling, TrendingUp } from "lucide-react";
import { useOrders, Order } from "@/hooks/useSupabaseData";

interface CustomerSummary {
  name: string;
  orders: Order[];
  totalSpent: number;
  tableNumber?: string | null;
}

interface AttendanceSummaryProps {
  currentWeek: string;
}

const AttendanceSummary = ({ currentWeek }: AttendanceSummaryProps) => {
  const { orders, loading } = useOrders();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  // Get all unique weeks from orders
  const allWeeks = [...new Set(orders.map(order => order.week))].sort().reverse();
  
  // Filter orders for selected week
  const weekOrders = orders.filter(order => order.week === selectedWeek);
  
  // Calculate summary data
  const totalAttendees = weekOrders.length;
  const uniqueCustomers = [...new Set(weekOrders.map(order => order.customer_name))].length;
  const totalRevenue = weekOrders.reduce((sum, order) => {
    const amount = order.paid_amount ?? 0;
    return sum + amount;
  }, 0);
  const averageSpend = totalAttendees > 0 ? totalRevenue / totalAttendees : 0;

  // Group orders by customer for detailed view
  const customerSummary = weekOrders.reduce((acc, order) => {
    const name = order.customer_name;
    if (!acc[name]) {
      acc[name] = {
        name,
        orders: [],
        totalSpent: 0,
        tableNumber: order.table_number
      };
    }
    acc[name].orders.push(order);
    const amount = order.paid_amount ?? 0;
    acc[name].totalSpent += amount;
    return acc;
  }, {} as Record<string, CustomerSummary>);

  const customers = Object.values(customerSummary);

  // Meal popularity analysis
  const mealCounts = weekOrders.reduce((acc, order) => {
    acc[order.meal_choice] = (acc[order.meal_choice] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularMeals = Object.entries(mealCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading attendance...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Summary</h2>
        </div>
        
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-full sm:w-48 border-blue-200 focus:border-blue-400">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            {allWeeks.map(week => (
              <SelectItem key={week} value={week}>
                Week of {new Date(week).toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{totalAttendees}</div>
              <div className="text-sm text-blue-600">Total Orders</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">{uniqueCustomers}</div>
              <div className="text-sm text-green-600">Unique Customers</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center space-x-3">
            <PoundSterling className="w-6 h-6 text-amber-600" />
            <div>
              <div className="text-2xl font-bold text-amber-700">£{totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-amber-600">Total Revenue</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-700">£{averageSpend.toFixed(2)}</div>
              <div className="text-sm text-purple-600">Average Spend</div>
            </div>
          </div>
        </Card>
      </div>

      {weekOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">No attendance data for this week</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer List */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Attendees ({customers.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-600">
                      {customer.orders.length} order{customer.orders.length > 1 ? 's' : ''}
                      {customer.tableNumber && ` • Table ${customer.tableNumber}`}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    £{customer.totalSpent.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Meals */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Popular Meals
            </h3>
            <div className="space-y-3">
              {popularMeals.map(([meal, count], index) => (
                <div key={meal} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{meal}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {count} orders
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AttendanceSummary;
