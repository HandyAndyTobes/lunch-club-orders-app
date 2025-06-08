
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { useOrders } from "@/hooks/useSupabaseData";

interface OrdersListProps {
  currentWeek: string;
}

const OrdersList = ({ currentWeek }: OrdersListProps) => {
  const { orders, loading } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTable, setFilterTable] = useState("all");

  const currentWeekOrders = orders.filter(order => order.week === currentWeek);
  
  const filteredOrders = currentWeekOrders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTable = filterTable === "all" || order.table_number === filterTable;
    return matchesSearch && matchesTable;
  });

  const totalRevenue = currentWeekOrders.reduce((sum, order) => sum + (order.paid_amount || 0), 0);
  const totalOrders = currentWeekOrders.length;

  const uniqueTables = [...new Set(currentWeekOrders.map(order => order.table_number).filter(Boolean))].sort();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Orders This Week</h2>
        </div>
        <Card className="p-8 text-center">
          <div className="text-gray-500">Loading orders...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
          <Search className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Orders This Week</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{totalOrders}</div>
            <div className="text-sm text-green-600">Total Orders</div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-700">£{totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-amber-600">Total Income</div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{uniqueTables.length}</div>
            <div className="text-sm text-blue-600">Tables Used</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-green-200 focus:border-green-400"
          />
        </div>
        <Select value={filterTable} onValueChange={setFilterTable}>
          <SelectTrigger className="w-full sm:w-48 border-green-200 focus:border-green-400">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by table" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {uniqueTables.map(table => (
              <SelectItem key={table} value={table!}>Table {table}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              {currentWeekOrders.length === 0 
                ? "No orders yet this week" 
                : "No orders match your search criteria"
              }
            </div>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="p-4 hover:shadow-md transition-shadow border-green-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{order.customer_name}</h3>
                    {order.table_number && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Table {order.table_number}
                      </Badge>
                    )}
                    {order.paid_amount && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        £{order.paid_amount.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Meal:</span> {order.meal_choice}
                    </div>
                    {order.dessert && (
                      <div>
                        <span className="font-medium text-gray-700">Dessert:</span> {order.dessert}
                      </div>
                    )}
                    {order.drink && (
                      <div>
                        <span className="font-medium text-gray-700">Drink:</span> {order.drink}
                      </div>
                    )}
                    {order.sub_items.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Extras:</span> {order.sub_items.join(", ")}
                      </div>
                    )}
                  </div>
                  
                  {order.special_request && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <span className="font-medium text-yellow-800">Special Request:</span>
                      <span className="text-yellow-700 ml-1">{order.special_request}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 md:text-right">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersList;
