
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  customerName: string;
  mealChoice: string;
  subItems: string[];
  dessert: string;
  drink: string;
  specialRequest: string;
  tableNumber: string;
  paidAmount: string;
  payItForwardAmount?: string;
  week: string;
  timestamp: string;
  id: string;
}

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

export interface DessertItem {
  name: string;
  startingStock: number;
  remainingStock: number;
  active: boolean;
}

export const createNewOrder = (formData: OrderFormData, currentWeek: string): Order => {
  return {
    ...formData,
    week: currentWeek,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
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
  dessertInventory: DessertItem[]
): boolean => {
  if (!dessert) return true;
  
  const dessertItem = dessertInventory.find(d => d.name === dessert);
  if (!dessertItem || dessertItem.remainingStock <= 0) {
    toast({
      title: "Dessert Unavailable",
      description: "Sorry, this dessert is out of stock.",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

export const updateDessertInventory = (
  dessert: string, 
  dessertInventory: DessertItem[]
): DessertItem[] => {
  if (!dessert) return dessertInventory;
  
  return dessertInventory.map(d =>
    d.name === dessert
      ? { ...d, remainingStock: d.remainingStock - 1 }
      : d
  );
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
