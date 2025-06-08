
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useOrders, useDessertInventory, useMealOptions, useSubItemOptions } from "@/hooks/useSupabaseData";
import CustomerInfoFields from "./order/CustomerInfoFields";
import MealSelectionField from "./order/MealSelectionField";
import SubItemsField from "./order/SubItemsField";
import DessertDrinkFields from "./order/DessertDrinkFields";
import PaymentRequestFields from "./order/PaymentRequestFields";
import {
  OrderFormData,
  createNewOrder,
  getInitialFormData,
  validateOrderForm,
  checkDessertStock,
  recordPayItForwardUsage
} from "@/utils/orderUtils";

interface OrderFormProps {
  currentWeek: string;
  mode?: "admin" | "public";
}

const OrderForm = ({ currentWeek, mode = "admin" }: OrderFormProps) => {
  const { addOrder } = useOrders();
  const { desserts, updateDessert } = useDessertInventory();
  const { mealOptions } = useMealOptions();
  const { subItemOptions } = useSubItemOptions();

  const [formData, setFormData] = useState<OrderFormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormUpdate = (update: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...update }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOrderForm(formData)) return;

    const availableDesserts = desserts.filter(d => d.active && d.remaining_stock > 0);
    if (!checkDessertStock(formData.dessert, availableDesserts)) return;

    setIsSubmitting(true);

    try {
      // Create the order data for Supabase
      const orderData = {
        customer_name: formData.customerName,
        meal_choice: formData.mealChoice,
        sub_items: formData.subItems,
        dessert: formData.dessert || null,
        drink: formData.drink || null,
        special_request: formData.specialRequest || null,
        table_number: formData.tableNumber || null,
        paid_amount: formData.paidAmount ? parseFloat(formData.paidAmount) : null,
        pay_it_forward_amount: formData.payItForwardAmount ? parseFloat(formData.payItForwardAmount) : null,
        week: currentWeek,
        timestamp: new Date().toISOString()
      };

      // Save the order to Supabase
      const newOrder = await addOrder(orderData);

      // Update dessert inventory if a dessert was selected
      if (formData.dessert) {
        const dessertItem = desserts.find(d => d.name === formData.dessert);
        if (dessertItem) {
          await updateDessert(dessertItem.id, {
            remaining_stock: dessertItem.remaining_stock - 1
          });
        }
      }

      // Record Pay It Forward usage if applicable
      if (formData.payItForwardAmount && parseFloat(formData.payItForwardAmount) > 0) {
        await recordPayItForwardUsage(
          formData.customerName,
          formData.payItForwardAmount,
          newOrder.id
        );
      }

      toast({
        title: "Order Submitted!",
        description: `Order for ${formData.customerName} has been recorded.`,
      });

      setFormData(getInitialFormData());
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDesserts = desserts.filter(d => d.active && d.remaining_stock > 0);
  const activeMealOptions = mealOptions.filter(m => m.active).map(m => m.name);
  const activeSubItemOptions = subItemOptions.filter(s => s.active).map(s => s.name);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CustomerInfoFields 
        formData={formData} 
        onFormChange={handleFormUpdate} 
        mode={mode}
      />

      <MealSelectionField 
        formData={formData} 
        onFormChange={handleFormUpdate} 
        mealOptions={activeMealOptions} 
      />

      <SubItemsField 
        formData={formData} 
        onFormChange={handleFormUpdate} 
        subItemOptions={activeSubItemOptions} 
      />

      <DessertDrinkFields 
        formData={formData} 
        onFormChange={handleFormUpdate} 
        availableDesserts={availableDesserts} 
      />

      {mode === "admin" && (
        <PaymentRequestFields 
          formData={formData} 
          onFormChange={handleFormUpdate} 
        />
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 text-lg"
      >
        {isSubmitting ? "Submitting..." : mode === "public" ? "Place Order" : "Submit Order"}
      </Button>
    </form>
  );
};

export default OrderForm;
