import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CustomerInfoFields from "@/components/order/CustomerInfoFields";
import MealSelectionField from "@/components/order/MealSelectionField";
import SubItemsField from "@/components/order/SubItemsField";
import DessertDrinkFields from "@/components/order/DessertDrinkFields";
import SpecialRequestField from "@/components/order/SpecialRequestField";
import { toast } from "@/hooks/use-toast";
import { useDessertInventory, useMealOptions, useSubItemOptions, Order } from "@/hooks/useSupabaseData";
import { OrderFormData, validateOrderForm } from "@/utils/orderUtils";

interface EditOrderFormProps {
  order: Order;
  onClose: () => void;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
}

const EditOrderForm = ({ order, onClose, updateOrder }: EditOrderFormProps) => {
  const { desserts, updateDessert } = useDessertInventory();
  const { mealOptions } = useMealOptions();
  const { subItemOptions } = useSubItemOptions();

  const getFormDataFromOrder = (order: Order): OrderFormData => ({
    customerName: order.customer_name,
    mealChoice: order.meal_choice,
    subItems: order.sub_items,
    dessert: order.dessert || "",
    drink: order.drink || "",
    specialRequest: order.special_request || "",
    tableNumber: order.table_number || "",
    paidAmount: order.paid_amount ? order.paid_amount.toString() : "",
    payItForwardAmount: order.pay_it_forward_amount
      ? order.pay_it_forward_amount.toString()
      : "",
  });

  const [formData, setFormData] = useState<OrderFormData>(() => getFormDataFromOrder(order));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(getFormDataFromOrder(order));
  }, [order]);

  const handleFormUpdate = (update: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...update }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOrderForm(formData)) return;
    setIsSubmitting(true);
    try {
      const previousDessert = order.dessert || "";

      await updateOrder(order.id, {
        customer_name: formData.customerName,
        meal_choice: formData.mealChoice,
        sub_items: formData.subItems,
        dessert: formData.dessert || null,
        drink: formData.drink || null,
        special_request: formData.specialRequest || null,
        table_number: formData.tableNumber || null,
      });

      if (previousDessert && previousDessert !== formData.dessert) {
        const prevItem = desserts.find(d => d.name === previousDessert);
        if (prevItem) {
          await updateDessert(prevItem.id, {
            remaining_stock: prevItem.remaining_stock + 1,
          });
        }
      }

      if (formData.dessert && formData.dessert !== previousDessert) {
        const newItem = desserts.find(d => d.name === formData.dessert);
        if (newItem) {
          await updateDessert(newItem.id, {
            remaining_stock: newItem.remaining_stock - 1,
          });
        }
      }
      toast({
        title: "Order Updated",
        description: `Meal updated for ${formData.customerName}.`,
      });
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
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
      <CustomerInfoFields formData={formData} onFormChange={handleFormUpdate} />
      <MealSelectionField formData={formData} onFormChange={handleFormUpdate} mealOptions={activeMealOptions} />
      <SubItemsField formData={formData} onFormChange={handleFormUpdate} subItemOptions={activeSubItemOptions} />
      <DessertDrinkFields formData={formData} onFormChange={handleFormUpdate} availableDesserts={availableDesserts} />
      <SpecialRequestField formData={formData} onFormChange={handleFormUpdate} />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default EditOrderForm;
