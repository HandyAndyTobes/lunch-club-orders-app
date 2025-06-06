
import { toast } from "@/hooks/use-toast";

export interface Order {
  customerName: string;
  mealChoice: string;
  subItems: string[];
  dessert: string;
  drink: string;
  specialRequest: string;
  tableNumber: string;
  paidAmount: string;
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

export const getInitialFormData = (): OrderFormData => ({
  customerName: "",
  mealChoice: "",
  subItems: [],
  dessert: "",
  drink: "",
  specialRequest: "",
  tableNumber: "",
  paidAmount: "",
});
