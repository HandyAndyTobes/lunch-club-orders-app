
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface OrderFormProps {
  currentWeek: string;
}

const OrderForm = ({ currentWeek }: OrderFormProps) => {
  const [orders, setOrders] = useLocalStorage<any[]>("orders", []);
  const [dessertInventory, setDessertInventory] = useLocalStorage("dessertInventory", [
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

  const [formData, setFormData] = useState({
    customerName: "",
    mealChoice: "",
    subItems: [] as string[],
    dessert: "",
    drink: "",
    specialRequest: "",
    tableNumber: "",
    paidAmount: "",
  });

  const handleSubItemChange = (item: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, subItems: [...prev.subItems, item] }));
    } else {
      setFormData(prev => ({ ...prev, subItems: prev.subItems.filter(i => i !== item) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.mealChoice) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and meal choice.",
        variant: "destructive"
      });
      return;
    }

    // Check dessert stock
    if (formData.dessert) {
      const dessert = dessertInventory.find(d => d.name === formData.dessert);
      if (!dessert || dessert.remainingStock <= 0) {
        toast({
          title: "Dessert Unavailable",
          description: "Sorry, this dessert is out of stock.",
          variant: "destructive"
        });
        return;
      }

      // Reduce dessert stock
      const updatedInventory = dessertInventory.map(d =>
        d.name === formData.dessert
          ? { ...d, remainingStock: d.remainingStock - 1 }
          : d
      );
      setDessertInventory(updatedInventory);
    }

    const newOrder = {
      ...formData,
      week: currentWeek,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    setOrders([...orders, newOrder]);
    
    toast({
      title: "Order Submitted!",
      description: `Order for ${formData.customerName} has been recorded.`,
    });

    // Reset form
    setFormData({
      customerName: "",
      mealChoice: "",
      subItems: [],
      dessert: "",
      drink: "",
      specialRequest: "",
      tableNumber: "",
      paidAmount: "",
    });
  };

  const availableDesserts = dessertInventory.filter(d => d.active && d.remainingStock > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="Enter customer name"
            className="border-green-200 focus:border-green-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
            id="tableNumber"
            type="number"
            value={formData.tableNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: e.target.value }))}
            placeholder="Table number"
            className="border-green-200 focus:border-green-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mealChoice">Meal Choice *</Label>
        <Select value={formData.mealChoice} onValueChange={(value) => setFormData(prev => ({ ...prev, mealChoice: value }))}>
          <SelectTrigger className="border-green-200 focus:border-green-400">
            <SelectValue placeholder="Select a meal" />
          </SelectTrigger>
          <SelectContent>
            {mealOptions.map(meal => (
              <SelectItem key={meal} value={meal}>{meal}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Sub-Items (Optional)</Label>
        <div className="grid grid-cols-2 gap-3">
          {subItemOptions.map(item => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={formData.subItems.includes(item)}
                onCheckedChange={(checked) => handleSubItemChange(item, checked as boolean)}
              />
              <Label htmlFor={item} className="text-sm font-normal">{item}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dessert">Dessert</Label>
          <Select value={formData.dessert} onValueChange={(value) => setFormData(prev => ({ ...prev, dessert: value }))}>
            <SelectTrigger className="border-green-200 focus:border-green-400">
              <SelectValue placeholder="Select dessert" />
            </SelectTrigger>
            <SelectContent>
              {availableDesserts.map(dessert => (
                <SelectItem key={dessert.name} value={dessert.name}>
                  {dessert.name} ({dessert.remainingStock} left)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="drink">Drink</Label>
          <Input
            id="drink"
            value={formData.drink}
            onChange={(e) => setFormData(prev => ({ ...prev, drink: e.target.value }))}
            placeholder="Tea, Coffee, Juice..."
            className="border-green-200 focus:border-green-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paidAmount">Amount Paid (£)</Label>
        <Input
          id="paidAmount"
          type="number"
          step="0.01"
          value={formData.paidAmount}
          onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: e.target.value }))}
          placeholder="0.00"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequest">Special Requests</Label>
        <Textarea
          id="specialRequest"
          value={formData.specialRequest}
          onChange={(e) => setFormData(prev => ({ ...prev, specialRequest: e.target.value }))}
          placeholder="Any special dietary requirements or requests..."
          className="border-green-200 focus:border-green-400"
          rows={3}
        />
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
