
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface OrderFormData {
  customerName: string;
  mealChoice: string;
  subItems: string[];
  dessert: string;
  drink: string;
  specialRequest: string;
  tableNumber: string;
  paidAmount: string;
  payItForwardAmount?: string;
}

export const createNewOrder = (formData: OrderFormData, currentWeek: string) => {
  return {
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
};

export const validateOrderForm = (formData: OrderFormData): boolean => {
  if (!formData.customerName || !formData.mealChoice) {
    toast({
      title: "Missing Information",
      description: "Please fill in customer name and meal choice.",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

export const checkDessertStock = (
  dessert: string, 
  availableDesserts: Array<{ name: string; remaining_stock: number }>
): boolean => {
  if (!dessert) return true;
  
  const dessertItem = availableDesserts.find(d => d.name === dessert);
  if (!dessertItem || dessertItem.remaining_stock <= 0) {
    toast({
      title: "Dessert Unavailable",
      description: "Sorry, this dessert is out of stock.",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

export const recordPayItForwardUsage = async (
  customerName: string,
  amount: string,
  orderId: string
): Promise<boolean> => {
  if (!amount || parseFloat(amount) <= 0) return true;

  const { error } = await supabase
    .from('pay_it_forward_usage')
    .insert({
      recipient_name: customerName,
      amount: parseFloat(amount),
      order_id: orderId,
      notes: `Used for order ${orderId}`
    });

  if (error) {
    console.error('Error recording pay it forward usage:', error);
    toast({
      title: "Error",
      description: "Failed to record Pay It Forward usage.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};

export const getInitialFormData = (): OrderFormData => ({
  customerName: "",
  mealChoice: "",
  subItems: [],
  dessert: "",
  drink: "",
  specialRequest: "",
  tableNumber: "",
  paidAmount: "",
  payItForwardAmount: "",
});
