
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { createOrder } from "./orderUtils";

const OrderForm = ({
  currentWeek,
  mode = "admin"
}: {
  currentWeek: string;
  mode?: "admin" | "public";
}) => {
  const [form, setForm] = useState({
    name: "",
    meal: "",
    dessert: "",
    drink: "",
    paidAmount: "",
    usePayItForward: false,
    isVolunteerMeal: false
  });

  const [orders, setOrders] = useLocalStorage<any[]>("orders", []);
  const [menu, setMenu] = useLocalStorage("menu", []);
  const [desserts, setDesserts] = useLocalStorage("desserts", []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newOrder = {
      ...form,
      week: currentWeek,
      paidAmount: mode === "public" || form.isVolunteerMeal ? "0.00" : form.paidAmount,
      usePayItForward: mode === "public" ? false : form.usePayItForward,
      isVolunteerMeal: mode === "public" ? false : form.isVolunteerMeal,
    };

    if (!newOrder.name || !newOrder.meal) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and select a meal.",
        variant: "destructive",
      });
      return;
    }

    const order = createOrder(newOrder);
    setOrders([...orders, order]);

    toast({
      title: "Order Submitted",
      description: "Your lunch order has been saved!",
    });

    setForm({
      name: "",
      meal: "",
      dessert: "",
      drink: "",
      paidAmount: "",
      usePayItForward: false,
      isVolunteerMeal: false,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} />
      </div>

      <div>
        <Label>Meal</Label>
        <select name="meal" value={form.meal} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Select a meal</option>
          {menu.map((m: any, idx: number) => (
            <option key={idx} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Dessert</Label>
        <select name="dessert" value={form.dessert} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Select a dessert</option>
          {desserts.map((d: any, idx: number) => (
            <option key={idx} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Drink</Label>
        <Input name="drink" value={form.drink} onChange={handleChange} />
      </div>

      {mode !== "public" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.usePayItForward}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, usePayItForward: !!checked }))
              }
              id="pif"
            />
            <Label htmlFor="pif">Use Pay It Forward</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isVolunteerMeal}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isVolunteerMeal: !!checked }))
              }
              id="volunteer"
            />
            <Label htmlFor="volunteer">Volunteer Meal (Free)</Label>
          </div>

          <div>
            <Label>Amount Paid (£)</Label>
            <Input
              name="paidAmount"
              type="number"
              step="0.01"
              value={form.paidAmount}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <Button onClick={handleSubmit}>Submit Order</Button>
    </div>
  );
};

export default OrderForm;
