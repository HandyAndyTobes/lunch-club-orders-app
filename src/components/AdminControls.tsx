
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, RotateCcw, Download, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useOrders, useDessertInventory } from "@/hooks/useSupabaseData";

interface AdminControlsProps {
  currentWeek: string;
}

const AdminControls = ({ currentWeek }: AdminControlsProps) => {
  const { orders, refetch: refetchOrders } = useOrders();
  const { desserts, updateDessert, refetch: refetchDesserts } = useDessertInventory();
  const [attendance, setAttendance] = useLocalStorage<any[]>("attendance", []);

  const currentWeekOrders = orders.filter(order => order.week === currentWeek);
  const totalRevenue = currentWeekOrders.reduce((sum, order) => sum + (order.paid_amount || 0), 0);

  const clearWeekOrders = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('week', currentWeek);

      if (error) throw error;

      await refetchOrders();

      toast({
        title: "Orders Cleared",
        description: `All orders for the week of ${new Date(currentWeek).toLocaleDateString()} have been cleared.`,
      });
    } catch (error) {
      console.error('Error clearing orders:', error);
      toast({
        title: "Error",
        description: "Failed to clear orders.",
        variant: "destructive",
      });
    }
  };

  const generateAttendanceSheet = () => {
    const customerSummary = currentWeekOrders.reduce((acc, order) => {
      const name = order.customer_name;
      if (!acc[name]) {
        acc[name] = {
          name,
          totalSpent: 0,
          orders: []
        };
      }
      acc[name].totalSpent += order.paid_amount || 0;
      acc[name].orders.push(order);
      return acc;
    }, {} as Record<string, any>);

    const attendanceRecord = {
      week: currentWeek,
      attendees: Object.values(customerSummary),
      totalRevenue,
      totalAttendees: currentWeekOrders.length,
      uniqueCustomers: Object.keys(customerSummary).length,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    setAttendance([...attendance, attendanceRecord]);
    
    toast({
      title: "Attendance Sheet Generated",
      description: "Weekly attendance summary has been saved.",
    });
  };

  const resetAllStock = async () => {
    try {
      for (const dessert of desserts) {
        await updateDessert(dessert.id, {
          remaining_stock: dessert.starting_stock
        });
      }

      await refetchDesserts();

      toast({
        title: "Stock Reset",
        description: "All dessert stock has been reset for the new week.",
      });
    } catch (error) {
      console.error('Error resetting stock:', error);
      toast({
        title: "Error",
        description: "Failed to reset stock.",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const exportData = {
      orders: currentWeekOrders,
      attendance: attendance.filter(record => record.week === currentWeek),
      dessertInventory: desserts,
      exportDate: new Date().toISOString(),
      week: currentWeek
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `church-lunch-data-${currentWeek}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Week data has been downloaded as JSON file.",
    });
  };

  const clearAllData = async () => {
    try {
      await supabase.from('orders').delete().neq('id', '');
      await supabase.from('pay_it_forward_donations').delete().neq('id', '');
      await supabase.from('pay_it_forward_usage').delete().neq('id', '');

      for (const dessert of desserts) {
        await updateDessert(dessert.id, {
          remaining_stock: dessert.starting_stock
        });
      }

      await refetchOrders();
      await refetchDesserts();

      setAttendance([]);

      toast({
        title: "All Data Cleared",
        description: "All orders and Pay It Forward records have been removed and stock reset.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      toast({
        title: "Error",
        description: "Failed to clear all data.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Controls</h2>
      </div>

      {/* Current Week Summary */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Current Week Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{currentWeekOrders.length}</div>
            <div className="text-sm text-blue-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">£{totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-blue-600">Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{[...new Set(currentWeekOrders.map(o => o.customerName))].length}</div>
            <div className="text-sm text-blue-600">Unique Customers</div>
          </div>
        </div>
      </Card>

      {/* Weekly Operations */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-600" />
          Weekly Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={generateAttendanceSheet}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            disabled={currentWeekOrders.length === 0}
          >
            <FileText className="w-4 h-4" />
            <span>Generate Attendance Sheet</span>
          </Button>

          <Button
            onClick={resetAllStock}
            variant="outline"
            className="flex items-center space-x-2 border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Weekly Stock</span>
          </Button>

          <Button
            onClick={exportData}
            variant="outline"
            className="flex items-center space-x-2 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="w-4 h-4" />
            <span>Export Week Data</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 border-red-300 text-red-700 hover:bg-red-50"
                disabled={currentWeekOrders.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Week Orders</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Week Orders</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {currentWeekOrders.length} orders for the week of {new Date(currentWeek).toLocaleDateString()}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearWeekOrders} className="bg-red-600 hover:bg-red-700">
                  Clear Orders
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="font-semibold text-lg mb-4 flex items-center text-red-800">
          <Trash2 className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-red-700">
            These actions will permanently delete data and cannot be undone.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear ALL Data</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete ALL orders, attendance records, and reset all stock levels. This action cannot be undone. Are you absolutely sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllData} className="bg-red-600 hover:bg-red-700">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-3">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Total Orders (All Time)</span>
            <Badge variant="outline">{orders.length}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Attendance Records</span>
            <Badge variant="outline">{attendance.length}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Active Desserts</span>
            <Badge variant="outline">{desserts.filter(d => d.active).length}</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminControls;
