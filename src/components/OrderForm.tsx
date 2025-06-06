
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  
  // Get meal and sub-item options from local storage with fallbacks
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

  const [formData, setFormData] = useState<OrderFormData>(getInitialFormData());

  const handleFormUpdate = (update: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...update }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOrderForm(formData)) {
      return;
    }

    // Check dessert stock
    if (!checkDessertStock(formData.dessert, dessertInventory)) {
      return;
    }

    // Create new order
    const newOrder = createNewOrder(formData, currentWeek);
    
    // Reduce dessert stock if dessert was selected
    if (formData.dessert) {
      const updatedInventory = updateDessertInventory(formData.dessert, dessertInventory);
      setDessertInventory(updatedInventory);
    }

    // Save the order
    setOrders([...orders, newOrder]);
    
    toast({
      title: "Order Submitted!",
      description: `Order for ${formData.customerName} has been recorded.`,
    });

    // Reset form
    setFormData(getInitialFormData());
  };

  const availableDesserts = dessertInventory.filter(d => d.active && d.remainingStock > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CustomerInfoFields 
        formData={formData} 
        onFormChange={handleFormUpdate} 
      />
      
      <MealSelectionField 
        formData={formData} 
        onFormChange={handleFormUpdate} 
        mealOptions={mealOptions} 
      />
      
      <SubItemsField 
        formData={formData} 
        onFormChange={handleFormUpdate} 
        subItemOptions={subItemOptions} 
      />
      
      <DessertDrinkFields 
        formData={formData} 
        onFormChange={handleFormUpdate} 
        availableDesserts={availableDesserts} 
      />
      
      <PaymentRequestFields 
        formData={formData} 
        onFormChange={handleFormUpdate} 
      />

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
