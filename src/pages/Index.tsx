import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ClipboardList, Package, Calendar, Settings, UtensilsCrossed, Heart } from "lucide-react";
import OrderForm from "@/components/OrderForm";
import OrdersList from "@/components/OrdersList";
import DessertManager from "@/components/DessertManager";
import AttendanceSummary from "@/components/AttendanceSummary";
import AdminControls from "@/components/AdminControls";
import MenuManager from "@/components/MenuManager";
import PayItForwardManager from "@/components/PayItForwardManager";
import PayItForwardBalance from "@/components/PayItForwardBalance";
import { getCurrentWeek, formatWeekDisplay } from "@/utils/weekUtils";

const Index = () => {
  const [userRole, setUserRole] = useState<"volunteer" | "admin">("volunteer");
  const [currentWeek] = useState(() => getCurrentWeek());

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
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
            <div className="flex items-center space-x-2">
              <Button
                variant={userRole === "volunteer" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserRole("volunteer")}
                className="text-xs"
              >
                Volunteer
              </Button>
              <Button
                variant={userRole === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserRole("admin")}
                className="text-xs"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {userRole === "volunteer" ? (
          // Volunteer View - Simple Order Form + Pay It Forward Balance
          <div className="space-y-6">
            <PayItForwardBalance />
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <ClipboardList className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Place Your Order</h2>
              </div>
              <OrderForm currentWeek={currentWeek} />
            </Card>
          </div>
        ) : (
          // Admin View - Full Dashboard
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="stock" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Stock</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center space-x-2">
                <UtensilsCrossed className="w-4 h-4" />
                <span className="hidden sm:inline">Menu</span>
              </TabsTrigger>
              <TabsTrigger value="pay-it-forward" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Pay It Forward</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="new-order" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">New Order</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
                <OrdersList currentWeek={currentWeek} />
              </Card>
            </TabsContent>

            <TabsContent value="stock">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
                <DessertManager />
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
                <AttendanceSummary currentWeek={currentWeek} />
              </Card>
            </TabsContent>

            <TabsContent value="menu">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
                <MenuManager />
              </Card>
            </TabsContent>

            <TabsContent value="pay-it-forward">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
                <PayItForwardManager />
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
                <AdminControls currentWeek={currentWeek} />
              </Card>
            </TabsContent>

            <TabsContent value="new-order">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">New Order</h2>
                </div>
                <OrderForm currentWeek={currentWeek} />
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
