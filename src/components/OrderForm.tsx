
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CustomerInfoFields from "./order/CustomerInfoFields";
import MealSelectionField from "./order/MealSelectionField";
import SubItemsField from "./order/SubItemsField";
import DessertDrinkFields from "./order/DessertDrinkFields";
import PaymentRequestFields from "./order/PaymentRequestFields";
import {
  DessertItem,
  OrderFormData,
  createNewOrder,
  getInitialFormData,
  validateOrderForm,
  checkDessertStock,
  updateDessertInventory
} from "@/utils/orderUtils";
import { supabase } from "@/integrations/supabase/client";

interface OrderFormProps {
  currentWeek: string;
}

const OrderForm = ({ currentWeek }: OrderFormProps) => {
  const [orders, setOrders] = useLocalStorage<any[]>("orders", []);
  const [dessertInventory, setDessertInventory] = useLocalStorage<DessertItem[]>("dessertInventory", [
    { name: "Chocolate Cake", startingStock: 10, remainingStock: 10, active: true },
    { name: "Apple Pie", startingStock: 8, remainingStock: 8, active: true },
    { name: "Ice Cream", startingStock: 15, remainingStock: 15, active: true },
    { name: "Fruit Salad", startingStock: 12, remainingStock: 12, active: true },
  ]);

  const [mealOptions] = useLocalStorage<string[]>("mealOptions", [
    "Soup of the Day",
    "Ham & Cheese Panini",
    "Roast Dinner",
    "Fish & Chips",
    "Jacket Potato",
    "Chicken Salad"
  ]);

  const [subItemOptions] = useLocalStorage<string[]>("subItemOptions", [
    "Buttered Bread",
    "Side Salad",
    "Chips",
    "Coleslaw",
    "Garlic Bread",
    "Extra Vegetables"
  ]);

  const [formData, setFormData] = useState<OrderFormData>({
    ...getInitialFormData(),
    usePayItForward: false,
    isVolunteerMeal: false,
  });

  const [payItForwardBalance, setPayItForwardBalance] = useState<number>(0);

  const handleFormUpdate = (update: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...update }));
  };

  const fetchPayItForwardBalance = async () => {
    const { data, error } = await supabase
      .from("pay_it_forward_balance")
      .select("current_balance")
      .single();

    if (!error && data) {
      setPayItForwardBalance(data.current_balance);
    }
  };

  useEffect(() => {
    fetchPayItForwardBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOrderForm(formData)) return;
    if (!checkDessertStock(formData.dessert, dessertInventory)) return;

    // Set final paid amount based on volunteer or pay-it-forward selection
    let finalPaidAmount = "0.00";
    if (!formData.isVolunteerMeal && !formData.usePayItForward) {
      finalPaidAmount = formData.paidAmount;
    }

    const newOrder = createNewOrder({ ...formData, paidAmount: finalPaidAmount }, currentWeek);

    // Update dessert inventory
    if (formData.dessert) {
      const updatedInventory = updateDessertInventory(formData.dessert, dessertInventory);
      setDessertInventory(updatedInventory);
    }

    setOrders([...orders, newOrder]);

    if (formData.usePayItForward && !formData.isVolunteerMeal && parseFloat(formData.paidAmount) > 0) {
      const { error } = await supabase.from("pay_it_forward_usage").insert({
        recipient_name: formData.customerName,
        amount: parseFloat(formData.paidAmount),
        notes: `Used via order on ${currentWeek}`,
        order_id: newOrder.id || null
      });

      if (error) {
        toast({
          title: "Error",
          description: "Pay It Forward usage could not be recorded.",
          variant: "destructive",
        });
      } else {
        fetchPayItForwardBalance();
      }
    }

    toast({
      title: "Order Submitted!",
      description: `Order for ${formData.customerName} has been recorded.`,
    });

    setFormData({
      ...getInitialFormData(),
      usePayItForward: false,
      isVolunteerMeal: false,
    });
  };

  const availableDesserts = dessertInventory.filter(d => d.active && d.remainingStock > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CustomerInfoFields formData={formData} onFormChange={handleFormUpdate} />
      <MealSelectionField formData={formData} onFormChange={handleFormUpdate} mealOptions={mealOptions} />
      <SubItemsField formData={formData} onFormChange={handleFormUpdate} subItemOptions={subItemOptions} />
      <DessertDrinkFields formData={formData} onFormChange={handleFormUpdate} availableDesserts={availableDesserts} />
      <PaymentRequestFields formData={formData} onFormChange={handleFormUpdate} />

      <div className="space-y-1">
        <Label className="text-sm text-green-700 flex items-center space-x-2">
          <Checkbox
            checked={formData.isVolunteerMeal}
            onCheckedChange={(checked) => handleFormUpdate({
              isVolunteerMeal: checked,
              usePayItForward: checked ? false : formData.usePayItForward
            })}
          />
          <span>This is a volunteer meal</span>
        </Label>
      </div>

      <div className="space-y-1">
        <Label className="text-sm text-pink-700 flex items-center space-x-2">
          <Checkbox
            checked={formData.usePayItForward}
            onCheckedChange={(checked) => handleFormUpdate({ usePayItForward: checked })}
            disabled={parseFloat(formData.paidAmount) > payItForwardBalance || formData.isVolunteerMeal}
          />
          <span>Use Pay It Forward Fund?</span>
        </Label>
        <p className="text-xs text-pink-600">
          Available: £{payItForwardBalance.toFixed(2)}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3"
      >
        Submit Order
      </Button>
    </form>
  );
};

export default OrderForm;
