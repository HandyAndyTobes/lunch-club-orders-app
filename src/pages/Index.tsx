
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

import OrderForm from "./OrderForm";
import OrdersList from "./OrdersList";
import AdminControls from "./AdminControls";
import AttendanceSummary from "./AttendanceSummary";
import PayItForwardManager from "./PayItForwardManager";
import PayItForwardBalance from "./PayItForwardBalance";
import MenuManager from "./MenuManager";
import DessertManager from "./DessertManager";

const Index = () => {
  const [view, setView] = useLocalStorage("view", "order");
  const [passwordInput, setPasswordInput] = useState("");
  const { isAuthenticated, login } = useAdminAuth();

  const userRole = view; // "order" or "admin"

  if (userRole === "admin" && !isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>
        <Input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter admin password"
        />
        <Button
          onClick={() => {
            if (!login(passwordInput)) {
              toast({
                title: "Access Denied",
                description: "Incorrect password",
                variant: "destructive",
              });
            }
          }}
          className="w-full"
        >
          Enter
        </Button>
      </div>
    );
  }

  return (
    <Tabs value={view} onValueChange={setView} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="order">Order</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>

      <TabsContent value="order">
        <div className="space-y-4">
          <OrderForm currentWeek={"2025-06-06"} />
          <OrdersList currentWeek={"2025-06-06"} />
        </div>
      </TabsContent>

      <TabsContent value="admin">
        <div className="space-y-4">
          <AdminControls />
          <AttendanceSummary />
          <PayItForwardManager />
          <PayItForwardBalance />
          <MenuManager />
          <DessertManager />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Index;
